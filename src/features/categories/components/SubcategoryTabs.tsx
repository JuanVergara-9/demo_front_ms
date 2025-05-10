import React from 'react';
import { Subcategory } from '../types';

interface SubcategoryTabsProps {
  subcategories: Subcategory[];
  selectedSubcategoryId: number | null;
  onSelect: (subcategoryId: number) => void;
}

const SubcategoryTabs: React.FC<SubcategoryTabsProps> = ({
  subcategories,
  selectedSubcategoryId,
  onSelect,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="flex overflow-x-auto scrollbar-hide">
        {subcategories.map(subcategory => (
          <button
            key={subcategory.id}
            onClick={() => onSelect(subcategory.id)}
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
  );
};

export default SubcategoryTabs;