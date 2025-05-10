// src/features/categories/services/subcategoryService.ts
import apiClient from '../../../api/apiClient';
import { Subcategory } from '../types';

export const subcategoryService = {
  /**
   * Obtiene todas las subcategorías usando el nuevo endpoint centralizado
   */
  getAll: async (): Promise<Subcategory[]> => {
    try {
      const response = await apiClient.get('/categories/all-subcategories');
      
      // Verificar si la respuesta tiene el formato { status, data }
      if (response.data && response.data.status === 200 && Array.isArray(response.data.data)) {
        return response.data.data; // Extraer el array de la propiedad data
      }
      
      // Si es directamente un array
      if (Array.isArray(response.data)) {
        return response.data;
      }
      
      console.error('Formato de respuesta inválido:', response.data);
      return [];
    } catch (error) {
      console.error('Error al obtener subcategorías:', error);
      throw error;
    }
  },

  /**
   * Obtiene una subcategoría por su ID
   * Este método podría fallar si no existe un endpoint directo para subcategorías
   * Se podría adaptar para buscar en todas las subcategorías de todas las categorías
   */
  getById: async (id: number): Promise<Subcategory> => {
    try {
      // Obtenemos todas las subcategorías
      const allSubcategories = await subcategoryService.getAll();
      
      // Buscamos la subcategoría por ID
      const subcategory = allSubcategories.find(sub => sub.id === id);
      
      if (!subcategory) {
        throw new Error(`No se encontró la subcategoría con ID ${id}`);
      }
      
      return subcategory;
    } catch (error) {
      console.error(`Error al obtener subcategoría con ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Obtiene todas las subcategorías por categoría
   * Este endpoint sí debería funcionar según la estructura del backend
   */
  getByCategoryId: async (categoryId: number): Promise<Subcategory[]> => {
    try {
      // Eliminar el prefijo /api/ para evitar duplicación con la baseURL
      const response = await apiClient.get(`/categories/${categoryId}/subcategories`);
      
      // Verificar si la respuesta tiene el formato { status, data }
      if (response.data && response.data.status === 200 && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      
      // Si es directamente un array
      if (Array.isArray(response.data)) {
        return response.data;
      }
      
      console.error(`Formato de respuesta inválido para subcategorías de categoría ${categoryId}:`, response.data);
      return [];
    } catch (error) {
      console.error(`Error al obtener subcategorías de categoría ${categoryId}:`, error);
      throw error;
    }
  }
};