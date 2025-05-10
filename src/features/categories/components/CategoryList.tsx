import React, { useState, useEffect } from 'react';
import { categoryService } from '../services/categoryService';
import { Category, Subcategory } from '../types';
import { ChevronDown, ChevronUp } from 'lucide-react';
import SubcategoryList from './SubcategoryList';

interface CategoryListProps {
  onCategorySelect?: (category: Category) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({ onCategorySelect }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [expandedCategoryId, setExpandedCategoryId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subcategories, setSubcategories] = useState<Record<number, Subcategory[]>>({});
  const [loadingSubcategories, setLoadingSubcategories] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await categoryService.getAll();
        if (Array.isArray(data) && data.length > 0) {
          setCategories(data);
        } else {
          setError('No se pudieron cargar las categorías');
        }
      } catch (err) {
        console.error('Error al cargar categorías:', err);
        setError('Error al cargar las categorías');
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, []);

  const toggleCategory = async (categoryId: number) => {
    // Si ya está expandida, la cerramos
    if (expandedCategoryId === categoryId) {
      setExpandedCategoryId(null);
      return;
    }
    
    // Si no está expandida, la abrimos
    setExpandedCategoryId(categoryId);
    
    // Cargar subcategorías si no las tenemos
    if (!subcategories[categoryId] || subcategories[categoryId].length === 0) {
      try {
        setLoadingSubcategories(prev => ({
          ...prev,
          [categoryId]: true
        }));
        
        const subCats = await categoryService.getSubcategories(categoryId);
        
        setSubcategories(prev => ({
          ...prev,
          [categoryId]: subCats
        }));
      } catch (error) {
        console.error(`Error cargando subcategorías para categoría ${categoryId}:`, error);
      } finally {
        setLoadingSubcategories(prev => ({
          ...prev,
          [categoryId]: false
        }));
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded-md">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-200">
      {categories.map((category) => (
        <div key={category.id} className="overflow-hidden">
          {/* Encabezado de categoría */}
          <button
            onClick={() => toggleCategory(category.id)}
            className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <span className="text-[16px] font-medium text-gray-900">
              {category.name}
            </span>
            <span className="text-gray-500">
              {expandedCategoryId === category.id ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </span>
          </button>
          
          {/* Panel de subcategorías - estilo más limpio */}
          {expandedCategoryId === category.id && (
            <div className="px-5 py-2 border-t border-gray-100">
              {loadingSubcategories[category.id] ? (
                <div className="text-center py-3 text-gray-500">
                  <div className="inline-block animate-pulse">Cargando...</div>
                </div>
              ) : subcategories[category.id]?.length > 0 ? (
                <SubcategoryList
                  categoryId={category.id}
                  subcategories={subcategories[category.id]}
                  onSelect={(subcategoryId) => {
                    const selectedSubcategory = subcategories[category.id].find(
                      s => s.id === subcategoryId
                    );
                    
                    // AQUÍ ESTÁ LA CORRECCIÓN:
                    onCategorySelect?.({
                      ...category, // Mantiene el ID original de la categoría
                      // id: subcategoryId, <-- ELIMINADO: NO reemplazar el ID de la categoría
                      selectedSubcategoryId: subcategoryId, // NUEVO: Agregamos el ID como propiedad separada
                      selectedSubcategoryName: selectedSubcategory?.name || '' // NUEVO: Nombre de la subcategoría
                    });
                  }}
                />
              ) : (
                <p className="text-center py-2 text-gray-500">
                  No hay subcategorías disponibles
                </p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CategoryList;