// src/features/providers/components/CategorySelector.tsx
import React, { useState, useEffect } from 'react';
import { ChevronDownIcon, ChevronRightIcon, CheckCircleIcon, ListFilterIcon } from 'lucide-react';
import { categoryService } from '../../categories/services/categoryService';
import { Category, Subcategory } from '../../categories/types';

interface CategorySelectorProps {
  selectedCategories: number[];
  selectedSubcategories: number[];
  onCategoriesChange: (categories: number[]) => void;
  onSubcategoriesChange: (subcategories: number[]) => void;
}

// Interfaz para categoría con subcategorías anidadas
interface CategoryWithSubcategories extends Category {
  subcategories: Subcategory[];
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  selectedCategories,
  selectedSubcategories,
  onCategoriesChange,
  onSubcategoriesChange,
}) => {
  const [categories, setCategories] = useState<CategoryWithSubcategories[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<number[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Cerrar el dropdown cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Cargar categorías y subcategorías
  useEffect(() => {
    const loadCategories = async () => {
      setIsLoading(true);
      try {
        // Obtener categorías
        const categoriesResponse = await categoryService.getAll();
        
        // Construir estructura de categorías con subcategorías
        const categoriesWithSubs: CategoryWithSubcategories[] = [];
        
        for (const category of categoriesResponse) {
          try {
            // Obtener subcategorías para esta categoría
            const subcategoriesResponse = await categoryService.getSubcategories(category.id);
            
            categoriesWithSubs.push({
              ...category,
              subcategories: subcategoriesResponse || []
            });
          } catch (err) {
            console.error(`Error fetching subcategories for category ${category.id}:`, err);
            categoriesWithSubs.push({
              ...category,
              subcategories: []
            });
          }
        }
        
        setCategories(categoriesWithSubs);
      } catch (err: any) {
        console.error("Error al cargar categorías:", err);
        setError(`Error al cargar categorías: ${err.message || 'Error desconocido'}`);
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, []);

  // Expandir/colapsar una categoría
  const toggleExpand = (categoryId: number) => {
    setExpandedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  // Manejar selección de subcategoría
  const handleSubcategoryChange = (subcategoryId: number, categoryId: number, isChecked: boolean) => {
    if (isChecked) {
      // Añadir subcategoría
      onSubcategoriesChange([...selectedSubcategories, subcategoryId]);
      
      // Añadir categoría si no está ya seleccionada
      if (!selectedCategories.includes(categoryId)) {
        onCategoriesChange([...selectedCategories, categoryId]);
      }
    } else {
      // Remover subcategoría
      const newSubcategories = selectedSubcategories.filter(id => id !== subcategoryId);
      onSubcategoriesChange(newSubcategories);
      
      // Si no quedan subcategorías de esta categoría, remover también la categoría
      const categorySubcats = categories
        .find(c => c.id === categoryId)?.subcategories || [];
      
      const hasSelectedSubcats = categorySubcats.some(s => 
        s.id !== subcategoryId && newSubcategories.includes(s.id)
      );
      
      if (!hasSelectedSubcats) {
        onCategoriesChange(selectedCategories.filter(id => id !== categoryId));
      }
    }
  };

  // Obtener nombres de las subcategorías seleccionadas
  const getSelectedSubcategoryNames = () => {
    const result: string[] = [];
    categories.forEach(category => {
      category.subcategories.forEach(subcategory => {
        if (selectedSubcategories.includes(subcategory.id)) {
          result.push(subcategory.name);
        }
      });
    });
    return result;
  };

  if (isLoading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Cargando categorías...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
        <p className="text-yellow-600">No se encontraron categorías disponibles.</p>
      </div>
    );
  }

  const selectedNames = getSelectedSubcategoryNames();

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Botón principal para mostrar/ocultar el selector */}
      <button
        type="button"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className={`w-full flex items-center justify-between px-4 py-3 border rounded-lg text-left 
          ${selectedSubcategories.length ? 'border-primary-300 bg-primary-50' : 'border-gray-300 bg-white'} 
          hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors`}
      >
        <div className="flex items-center">
          <ListFilterIcon className="w-5 h-5 text-gray-500 mr-2" />
          <span className="text-gray-700 font-medium">
            {selectedSubcategories.length
              ? `${selectedSubcategories.length} servicios seleccionados`
              : 'Categorías y servicios'}
          </span>
        </div>
        <ChevronDownIcon className={`w-5 h-5 text-gray-500 transition-transform ${dropdownOpen ? 'transform rotate-180' : ''}`} />
      </button>

      {/* Mostrar mini-badges con los nombres seleccionados */}
      {selectedNames.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {selectedNames.map((name, index) => (
            <span 
              key={index} 
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
            >
              {name}
            </span>
          ))}
        </div>
      )}

      {/* Dropdown de categorías y subcategorías */}
      {dropdownOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 max-h-[60vh] overflow-auto">
          <div className="p-2">
            {categories.map(category => (
              <div 
                key={`category-${category.id}`} 
                className="mb-2 rounded-md overflow-hidden border border-gray-200"
              >
                {/* Cabecera de categoría */}
                <div
                  onClick={() => toggleExpand(category.id)}
                  className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50"
                >
                  <div className="flex items-center">
                    <span className="font-medium text-gray-800">
                      {category.name}
                    </span>
                    {selectedSubcategories.some(id => 
                      category.subcategories.some(s => s.id === id)
                    ) && (
                      <span className="ml-2 text-xs text-primary-600">
                        ({category.subcategories.filter(s => 
                          selectedSubcategories.includes(s.id)
                        ).length} seleccionados)
                      </span>
                    )}
                  </div>
                  
                  {/* Icono de expansión */}
                  <div className="text-gray-400">
                    {expandedCategories.includes(category.id) ? (
                      <ChevronDownIcon size={20} />
                    ) : (
                      <ChevronRightIcon size={20} />
                    )}
                  </div>
                </div>
                
                {/* Panel de subcategorías */}
                {expandedCategories.includes(category.id) && (
                  <div className="bg-gray-50 p-3 border-t border-gray-100">
                    {category.subcategories && category.subcategories.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {category.subcategories.map(subcategory => (
                          <div 
                            key={`subcategory-${subcategory.id}`}
                            className="flex items-center p-2 hover:bg-white rounded cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSubcategoryChange(
                                subcategory.id,
                                category.id,
                                !selectedSubcategories.includes(subcategory.id)
                              );
                            }}
                          >
                            <input
                              id={`subcategory-${subcategory.id}`}
                              type="checkbox"
                              checked={selectedSubcategories.includes(subcategory.id)}
                              onChange={() => {}}
                              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                              aria-label={`Seleccionar ${subcategory.name}`}
                              onClick={(e) => e.stopPropagation()}
                            />
                            <label 
                              htmlFor={`subcategory-${subcategory.id}`}
                              className="ml-2 text-sm text-gray-700 cursor-pointer flex-1"
                            >
                              {subcategory.name}
                            </label>
                            {selectedSubcategories.includes(subcategory.id) && (
                              <CheckCircleIcon size={16} className="text-primary-600 ml-1" />
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 italic">
                        Esta categoría no tiene subcategorías disponibles
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Footer del dropdown */}
          <div className="p-2 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
            <span className="text-sm text-gray-500">
              {selectedSubcategories.length} servicios seleccionados
            </span>
            <button
              type="button"
              onClick={() => setDropdownOpen(false)}
              className="px-3 py-1 text-sm font-medium text-white bg-primary-600 rounded hover:bg-primary-700"
            >
              Aceptar
            </button>
          </div>
        </div>
      )}

      {/* Mensaje de aviso si no hay selección */}
      {selectedSubcategories.length === 0 && (
        <p className="text-sm text-amber-600 mt-2">
          Por favor selecciona al menos una subcategoría de servicios
        </p>
      )}
    </div>
  );
};

export default CategorySelector;