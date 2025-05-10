// src/features/categories/components/CategorySearch.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCategoriesData } from '../hooks/useCategoriesData';

interface CategorySearchProps {
  onSearch: (term: string) => void;
  placeholder?: string;
}

const CategorySearch: React.FC<CategorySearchProps> = ({ 
  onSearch, 
  placeholder = "¿Qué servicio estás buscando?" 
}) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<Array<any>>([]);
  const { categories, subcategories, isLoading } = useCategoriesData();
  const searchRef = useRef<HTMLDivElement>(null);
  
  // Cerrar sugerencias cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Generar sugerencias basadas en el término de búsqueda
  useEffect(() => {
    if (searchTerm.length < 2 || isLoading) {
      setSuggestions([]);
      return;
    }
    
    const term = searchTerm.toLowerCase();
    
    // Categorías que coinciden
    const matchedCategories = categories
      .filter(cat => cat.name.toLowerCase().includes(term))
      .map(cat => ({
        id: cat.id,
        name: cat.name,
        type: 'category'
      }));
    
    // Subcategorías que coinciden
    const matchedSubcategories = subcategories
      .filter(subcat => subcat.name.toLowerCase().includes(term))
      .map(subcat => {
        const parentCategory = categories.find(cat => cat.id === subcat.categoryId);
        return {
          id: subcat.id,
          name: subcat.name,
          type: 'subcategory',
          categoryId: subcat.categoryId,
          categoryName: parentCategory?.name
        };
      });
    
    // Combinar resultados, priorizando coincidencias exactas
    const allSuggestions = [...matchedCategories, ...matchedSubcategories]
      .sort((a, b) => {
        // Priorizar los que empiezan con el término de búsqueda
        const aStarts = a.name.toLowerCase().startsWith(term);
        const bStarts = b.name.toLowerCase().startsWith(term);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;
        return 0;
      })
      .slice(0, 8); // Limitar a 8 sugerencias
    
    setSuggestions(allSuggestions);
  }, [searchTerm, categories, subcategories, isLoading]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (e.target.value.length >= 2) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm);
      setShowSuggestions(false);
    }
  };
  
  const handleSuggestionClick = (suggestion: any) => {
    setShowSuggestions(false);
    
    if (suggestion.type === 'category') {
      // Navegar a la página de detalle de categoría
      navigate(`/categories/${suggestion.id}`);
    } else {
      // Navegar a la página de categoría con subcategoría seleccionada
      navigate(`/categories/${suggestion.categoryId}?subcategory=${suggestion.id}`);
    }
  };
  
  return (
    <div className="relative" ref={searchRef}>
      <form onSubmit={handleSubmit} className="flex w-full">
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => setShowSuggestions(searchTerm.length >= 2)}
          placeholder={placeholder}
          className="w-full px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors"
        >
          Buscar
        </button>
      </form>
      
      {/* Sugerencias */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-96 overflow-y-auto">
          {suggestions.map((suggestion) => (
            <div
              key={`${suggestion.type}-${suggestion.id}`}
              className="px-4 py-3 cursor-pointer hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <div className="font-medium text-gray-800">{suggestion.name}</div>
              <div className="text-xs text-gray-500 mt-1 flex items-center">
                {suggestion.type === 'category' ? (
                  <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">
                    Categoría
                  </span>
                ) : (
                  <span>
                    <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs">
                      Especialidad
                    </span>
                    {suggestion.categoryName && (
                      <span className="ml-2 text-gray-600">
                        en {suggestion.categoryName}
                      </span>
                    )}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategorySearch;