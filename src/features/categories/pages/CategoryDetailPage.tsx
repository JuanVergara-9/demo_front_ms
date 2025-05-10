import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { categoryService } from '../services/categoryService';
import ProvidersList from '../../providers/components/ProviderList';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import { Category, Subcategory } from '../types';

const CategoryDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [category, setCategory] = useState<Category | null>(null);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<number | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isValidCategory, setIsValidCategory] = useState<boolean>(true);
  const [parentCategoryId, setParentCategoryId] = useState<number | null>(null);
  
  // Nuevos estados para filtros
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>('rating');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Leer el parámetro subcategory de la URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const subcategoryParam = searchParams.get('subcategory');
    
    if (subcategoryParam) {
      const subcategoryId = parseInt(subcategoryParam);
      console.log(`📌 Detectado parámetro subcategory=${subcategoryId} en la URL`);
      
      // Solo establecer si es válido
      if (!isNaN(subcategoryId)) {
        console.log(`✅ Seleccionando subcategoría desde parámetro URL: ${subcategoryId}`);
        setSelectedSubcategoryId(subcategoryId);
      }
    }
  }, [location.search]);

  // Verificar si el ID es una categoría válida o una subcategoría
  useEffect(() => {
    const validateCategoryId = async () => {
      if (!id) return;

      try {
        const categoryId = parseInt(id);
        console.log(`Verificando si ID ${categoryId} es una categoría válida...`);
        
        try {
          // Intentar cargar la categoría
          const categoryData = await categoryService.getById(categoryId);
          
          if (categoryData) {
            console.log(`✅ ID ${categoryId} es una categoría válida: ${categoryData.name}`);
            setIsValidCategory(true);
          } else {
            // Si no hay error pero tampoco datos, verificar si es una subcategoría
            console.log(`❌ ID ${categoryId} no es una categoría válida, buscando como subcategoría...`);
            setIsValidCategory(false);
            
            // Buscar si es una subcategoría
            const allCategories = await categoryService.getAll();
            for (const cat of allCategories) {
              const subs = await categoryService.getSubcategories(cat.id);
              const matchingSub = subs.find(sub => sub.id === categoryId);
              
              if (matchingSub) {
                console.log(`✅ ID ${categoryId} es una subcategoría de la categoría ${cat.id} (${cat.name})`);
                setParentCategoryId(cat.id);
                
                // Redirigir usando el parámetro de consulta
                console.log(`🚀 Redirigiendo a la ruta correcta: /categories/${cat.id}?subcategory=${categoryId}`);
                navigate(`/categories/${cat.id}?subcategory=${categoryId}`, { replace: true });
                return null; // Detener la ejecución porque vamos a navegar
              }
            }
          }
        } catch (error) {
          console.error(`Error verificando categoría ${categoryId}:`, error);
          setIsValidCategory(false);
          
          // Buscar si es una subcategoría
          const allCategories = await categoryService.getAll();
          for (const cat of allCategories) {
            const subs = await categoryService.getSubcategories(cat.id);
            const matchingSub = subs.find(sub => sub.id === categoryId);
            
            if (matchingSub) {
              console.log(`✅ ID ${categoryId} es una subcategoría de la categoría ${cat.id} (${cat.name})`);
              setParentCategoryId(cat.id);
              
              console.log(`🚀 Redirigiendo a la ruta correcta: /categories/${cat.id}?subcategory=${categoryId}`);
              navigate(`/categories/${cat.id}?subcategory=${categoryId}`, { replace: true });
              return null;
            }
          }
        }
      } catch (err) {
        console.error('Error en la validación de categoría:', err);
      }
      
      const categoryId = id ? parseInt(id) : null;
      return categoryId;
    };
    
    validateCategoryId().then(validCategoryId => {
      if (validCategoryId) {
        // Solo cargamos si no vamos a redirigir
        loadCategoryDetails(validCategoryId);
      }
    });
  }, [id, navigate]);

  // Cargar detalles de categoría
  const loadCategoryDetails = async (categoryId: number) => {
    console.log(`Cargando detalles para categoría ID: ${categoryId}`);
    setIsLoading(true);
    
    try {
      const [categoryData, subcategoriesData] = await Promise.all([
        categoryService.getById(categoryId),
        categoryService.getSubcategories(categoryId)
      ]);

      console.log(`Categoría cargada: ${categoryData?.name || 'Desconocida'}`);
      console.log(`Subcategorías cargadas: ${subcategoriesData.length}`);
      
      setCategory(categoryData);
      setSubcategories(subcategoriesData);

      // Gestión de subcategoría seleccionada
      const searchParams = new URLSearchParams(location.search);
      const subcategoryParam = searchParams.get('subcategory');
      
      if (subcategoryParam) {
        console.log(`📌 Ya se estableció subcategoría desde URL: ${subcategoryParam}`);
      } else if (!isValidCategory && parentCategoryId) {
        // Si estábamos en una subcategoría incorrecta, seleccionar la subcategoría original
        const originalId = parseInt(id || '0');
        const isSubcategoryOfParent = subcategoriesData.some(sub => sub.id === originalId);
        
        if (isSubcategoryOfParent) {
          console.log(`Seleccionando subcategoría original ID: ${originalId}`);
          setSelectedSubcategoryId(originalId);
        }
      }
    } catch (err) {
      console.error('Error cargando detalles de categoría:', err);
      setError('Error al cargar los detalles de la categoría');
    } finally {
      setIsLoading(false);
    }
  };

  // Actualizar la subcategoría seleccionada cuando cambia el ID
  useEffect(() => {
    if (selectedSubcategoryId && subcategories.length > 0) {
      const subcategory = subcategories.find(sub => sub.id === selectedSubcategoryId) || null;
      
      if (subcategory) {
        console.log(`✅ Subcategoría encontrada: ${subcategory.name} (ID: ${selectedSubcategoryId})`);
        setSelectedSubcategory(subcategory);
      } else {
        console.log(`❌ Subcategoría con ID ${selectedSubcategoryId} no encontrada en esta categoría`);
        setSelectedSubcategoryId(null);
        setSelectedSubcategory(null);
      }
    } else {
      setSelectedSubcategory(null);
    }
  }, [selectedSubcategoryId, subcategories]);

  // Manejar selección de subcategorías
  const handleSubcategorySelect = (subId: number) => {
    console.log(`Seleccionando subcategoría ID: ${subId}`);
    
    // Actualizar URL con el parámetro de subcategoría
    const newUrl = `/categories/${category?.id}?subcategory=${subId}`;
    console.log(`🔗 Actualizando URL: ${newUrl}`);
    navigate(newUrl, { replace: true });
    
    setSelectedSubcategoryId(subId);
  };

  // Manejar búsqueda
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    // Implementa la lógica de búsqueda aquí
    console.log(`Búsqueda: ${term} en ${selectedSubcategory?.name || category?.name}`);
  };

  if (isLoading) {
    return <LoadingSpinner text="Cargando detalles de categoría..." />;
  }

  if (error || !category) {
    return <div className="bg-red-100 text-red-700 p-4 rounded-md mx-auto max-w-5xl my-8">
      {error || 'Categoría no encontrada'}
    </div>;
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con imagen de fondo y degradado */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="absolute inset-0 opacity-20 bg-cover bg-center" 
             style={{backgroundImage: `url(${selectedSubcategory?.imageUrl || category?.imageUrl || '/images/patterns/services-pattern.jpg'})`}}>
        </div>
        
        <div className="container mx-auto px-4 py-12 relative z-10">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="text-sm mb-6 flex items-center text-blue-100">
            <a href="/" className="hover:text-white">Inicio</a>
            <svg className="h-4 w-4 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <a href="/categories" className="hover:text-white">Categorías</a>
            {selectedSubcategory && (
              <>
                <svg className="h-4 w-4 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <a href={`/categories/${category?.id}`} className="hover:text-white">{category?.name}</a>
              </>
            )}
          </nav>
          
          {/* Título principal */}
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            {selectedSubcategory ? selectedSubcategory.name : category?.name}
          </h1>
          
          {/* Subtítulo o descripción */}
          <p className="text-xl text-blue-100 mt-3 max-w-3xl">
            {selectedSubcategory 
              ? `Encuentra los mejores profesionales de ${selectedSubcategory.name} cerca de ti` 
              : category?.description || `Explora todos los servicios en ${category?.name}`}
          </p>
          
          {/* Buscador */}
          <div className="mt-8 max-w-2xl">
            <div className="relative">
              <input 
                type="text" 
                placeholder={`Buscar en ${selectedSubcategory?.name || category?.name}...`}
                className="pl-4 pr-12 py-3 w-full rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label={`Buscar en ${selectedSubcategory?.name || category?.name}`}
                onChange={(e) => setSearchTerm(e.target.value)}
                value={searchTerm}
              />
              <button 
                className="absolute right-0 top-0 h-full px-4 text-blue-600 hover:text-blue-800"
                aria-label="Buscar" 
                onClick={() => handleSearch(searchTerm)}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        {/* Pestañas de subcategorías */}
        {subcategories.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Servicios disponibles</h2>
              
              {!selectedSubcategoryId && (
                <span className="text-sm text-gray-500">
                  Selecciona un servicio específico para ver proveedores especializados
                </span>
              )}
            </div>
            
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="flex overflow-x-auto scrollbar-hide">
                {subcategories.map(subcategory => (
                  <button
                    key={subcategory.id}
                    onClick={() => handleSubcategorySelect(subcategory.id)}
                    aria-pressed={subcategory.id === selectedSubcategoryId}
                    aria-label={`Seleccionar subcategoría: ${subcategory.name}`}
                    className={`flex-shrink-0 px-6 py-3 font-medium text-sm transition-colors duration-200 relative
                      ${subcategory.id === selectedSubcategoryId 
                        ? 'text-blue-600' 
                        : 'text-gray-600 hover:text-gray-800'}
                    `}
                  >
                    {subcategory.name}
                    {subcategory.id === selectedSubcategoryId && (
                      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Sección de filtros y resultados */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Panel de filtros */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-5 sticky top-4">
              <h3 className="font-medium text-gray-900 mb-4">Filtros</h3>
              
              {/* Filtro de calificación */}
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-2">Calificación mínima</p>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button 
                      key={star}
                      onClick={() => setMinRating(star)}
                      aria-label={`Calificación mínima ${star} estrellas`}
                      className={`rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                        ${star <= minRating ? 'text-yellow-400' : 'text-gray-300'}`}
                    >
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  ))}
                  <span className="ml-2 text-sm font-medium text-gray-700">o más</span>
                </div>
              </div>
              
              {/* Filtro de ordenamiento */}
              <div>
                <label htmlFor="sort-by" className="text-sm font-medium text-gray-700 mb-2 block">
                  Ordenar por
                </label>
                <select 
                  id="sort-by"
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  aria-label="Ordenar por"
                >
                  <option value="rating">Mejor calificación</option>
                  <option value="reviews">Más reseñas</option>
                  <option value="newest">Más recientes</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Lista de proveedores */}
          <div className="flex-grow">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                  <span>{selectedSubcategoryId ? `${selectedSubcategory?.name}` : category?.name}</span>
                  <span className="ml-3 text-sm bg-blue-100 text-blue-800 py-1 px-2 rounded-full">
                    2 profesionales
                  </span>
                </h2>
              </div>

              {/* Lista de proveedores */}
              <div className="providers-wrapper">
                {selectedSubcategoryId && selectedSubcategory ? (
                  <ProvidersList 
                    subcategoryId={selectedSubcategoryId}
                    subcategoryName={selectedSubcategory.name}
                    categoryId={undefined}
                    minRating={minRating}
                    sortBy={sortBy}
                    searchTerm={searchTerm}
                    key={`subcategory-${selectedSubcategoryId}`}
                  />
                ) : (
                  <ProvidersList 
                    categoryId={category.id}
                    subcategoryId={undefined}
                    minRating={minRating}
                    sortBy={sortBy}
                    searchTerm={searchTerm}
                    key={`category-${category.id}`}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryDetailPage;