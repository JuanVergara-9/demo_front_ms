import React from 'react';
import { Subcategory } from '../types';

interface SubcategoryListProps {
  categoryId: number;
  subcategories: Subcategory[];
  onSelect?: (subcategoryId: number) => void;
}

const SubcategoryList: React.FC<SubcategoryListProps> = ({ 
  categoryId, 
  subcategories,
  onSelect
}) => {
  return (
    <div className="py-2">
      {/* Lista completa de subcategorías */}
      <div className="space-y-1">
        {subcategories.map(subcategory => (
          <div key={subcategory.id} className="py-1.5">
            <button
              onClick={() => onSelect?.(subcategory.id)}
              className="text-left w-full text-gray-800 hover:text-blue-600 focus:text-blue-600 
                        transition-colors focus:outline-none text-[15px]"
            >
              {subcategory.name}
            </button>
          </div>
        ))}
      </div>
      
      {/* Botón de todos los servicios */}
      {subcategories.length > 0 && (
        <div className="mt-4 pt-2 border-t border-gray-100">
          <a
            href={`/categories/${categoryId}/services`}
            className="inline-block text-blue-600 border border-blue-600 rounded-md px-4 py-2 text-sm 
                     hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 
                     focus:ring-blue-400 focus:ring-opacity-50"
          >
            Ver todos los servicios
          </a>
        </div>
      )}
    </div>
  );
};

export default SubcategoryList;