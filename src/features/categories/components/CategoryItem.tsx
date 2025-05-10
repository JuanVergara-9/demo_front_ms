// src/features/categories/components/CategoryItem.tsx
import React, { useState, useEffect } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { categoryService } from '../services/categoryService';
import { Category, Subcategory } from '../types';
import SubcategoryList from './SubcategoryList';

interface CategoryItemProps {
  category: Category;
  isExpanded: boolean;
  onToggle: () => void;
  onSelect: () => void;
}

const CategoryItem: React.FC<CategoryItemProps> = ({
  category,
  isExpanded,
  onToggle,
}) => {
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Solo cargar las subcategorías cuando se expande
    if (isExpanded && subcategories.length === 0) {
      const loadSubcategories = async () => {
        setIsLoading(true);
        try {
          const data = await categoryService.getSubcategories(category.id);
          setSubcategories(data);
        } catch (error) {
          console.error('Error al cargar subcategorías:', error);
        } finally {
          setIsLoading(false);
        }
      };

      loadSubcategories();
    }
  }, [isExpanded, category.id, subcategories.length]);

  return (
    <div className="category-item card mb-3">
      <div 
        className="card-header d-flex justify-content-between align-items-center"
        onClick={onToggle}
      >
        <h3 className="category-name mb-0">{category.name}</h3>
        <button 
          className="btn btn-link text-decoration-none p-0" 
          aria-expanded={isExpanded}
          aria-controls={`subcategories-${category.id}`}
          aria-label={isExpanded ? 'Contraer categoría' : 'Expandir categoría'}
        >
          {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
        </button>
      </div>
      
      {isExpanded && (
        <div className="card-body" id={`subcategories-${category.id}`}>
          {isLoading ? (
            <div className="text-center py-3">Cargando subcategorías...</div>
          ) : (
            <SubcategoryList 
              categoryId={category.id}
              subcategories={subcategories}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryItem;