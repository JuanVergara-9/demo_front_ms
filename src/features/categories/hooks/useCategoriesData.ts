// src/features/categories/hooks/useCategoriesData.ts
import { useState, useEffect } from 'react';
import { categoryService } from '../services/categoryService';
import { subcategoryService } from '../services/subcategoryService';
import { Category, Subcategory } from '../types';

export const useCategoriesData = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Cargar categorías y subcategorías en paralelo
        const [categoriesData, subcategoriesData] = await Promise.all([
          categoryService.getAll(),
          subcategoryService.getAll()
        ]);
        
        setCategories(categoriesData || []);
        setSubcategories(subcategoriesData || []);
        
      } catch (err) {
        console.error('Error al cargar categorías y subcategorías:', err);
        setError('No se pudieron cargar las categorías y subcategorías');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Funciones helper para buscar nombres por ID
  const getCategoryName = (id: number): string => {
    const category = categories.find(cat => cat.id === id);
    return category?.name || `Categoría ${id}`;
  };
  
  const getSubcategoryName = (id: number): string => {
    const subcategory = subcategories.find(sub => sub.id === id);
    return subcategory?.name || `Subcategoría ${id}`;
  };

  return {
    categories,
    subcategories,
    isLoading,
    error,
    getCategoryName,
    getSubcategoryName
  };
};