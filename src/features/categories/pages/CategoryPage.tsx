// src/features/categories/pages/CategoryPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CategorySearch from '../components/CategorySearch';
import CategoryList from '../components/CategoryList';
import ProvidersList from '../../providers/components/ProviderList';
import { Category } from '../types';

const CategoryPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  // Extraer términos de búsqueda de la URL si existen
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('q');
    if (query) {
      setSearchTerm(query);
      setIsSearching(true);
    } else {
      setIsSearching(false);
    }
  }, [location.search]);
  
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    // Actualizar la URL sin cambiar de página
    navigate(`/categories?q=${encodeURIComponent(term)}`, { replace: true });
    setIsSearching(true);
  };
  
  // FUNCIÓN CORREGIDA para manejar la selección de subcategorías
  const handleCategorySelect = (category: Category) => {
    console.log('Categoría seleccionada:', category);
    
    // Verificar si se seleccionó una subcategoría
    if ('selectedSubcategoryId' in category && category.selectedSubcategoryId) {
      console.log(`Subcategoría seleccionada: ID=${category.selectedSubcategoryId}, Nombre=${category.selectedSubcategoryName}`);
      
      // Navegar a la categoría con el parámetro de subcategoría
      navigate(`/categories/${category.id}?subcategory=${category.selectedSubcategoryId}`);
    } else {
      // Navegación normal a la categoría (sin subcategoría)
      console.log(`Navegando a categoría: ID=${category.id}, Nombre=${category.name}`);
      navigate(`/categories/${category.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-50 to-sky-50 py-12 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
            {isSearching 
              ? `Resultados para "${searchTerm}"` 
              : "Encuentra el servicio que necesitas"}
          </h1>
          <CategorySearch onSearch={handleSearch} />
        </div>
      </div>
      
      <div className="max-w-5xl mx-auto py-10 px-4">
        {isSearching ? (
          // Mostrar resultados de búsqueda
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Proveedores disponibles
            </h2>
            <ProvidersList searchTerm={searchTerm} />
          </section>
        ) : (
          // Mostrar todas las categorías
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Todas las categorías
            </h2>
            <CategoryList onCategorySelect={handleCategorySelect} />
          </section>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;