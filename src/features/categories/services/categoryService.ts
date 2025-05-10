// src/features/categories/services/categoryService.ts
import apiClient from '../../../api/apiClient';
import axios from 'axios';
import { Category, Subcategory } from '../types';

// Bandera para habilitar/deshabilitar los datos de prueba
const USE_MOCK_DATA = false; // Cambia a true si quieres forzar el uso de datos mock

export const categoryService = {
  /**
   * Obtiene todas las categorías
   */
  getAll: async (): Promise<Category[]> => {
    if (USE_MOCK_DATA) {
      console.log('Usando datos mock para categorías');
      return mockCategories;
    }

    try {
      const response = await apiClient.get('/categories?includeSubcategories=true');
      console.log("Respuesta de categorías:", response.data);
      
      // Adaptador para diferentes estructuras
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data && typeof response.data === 'object') {
        if (Array.isArray(response.data.data)) return response.data.data;
        if (Array.isArray(response.data.categories)) return response.data.categories;
        if (Array.isArray(response.data.results)) return response.data.results;
      }
      
      console.warn("Formato no reconocido, usando categorías de respaldo");
      return mockCategories;
    } catch (error) {
      console.error('Error fetching categories:', error);
      return mockCategories; // Retornar datos de ejemplo para no romper la UI
    }
  },
  
  /**
   * Obtiene una categoría por su ID
   */
  getById: async (id: number): Promise<Category | null> => {
    if (USE_MOCK_DATA) {
      const category = mockCategories.find(cat => cat.id === id);
      return category || null;
    }

    try {
      const response = await apiClient.get(`/categories/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error);
      return mockCategories.find(cat => cat.id === id) || null;
    }
  },
  
  /**
   * Obtiene las subcategorías de una categoría específica
   * Prueba múltiples estrategias para obtener los datos
   */
  getSubcategories: async (categoryId: number): Promise<Subcategory[]> => {
    console.log(`Intentando obtener subcategorías para categoría ${categoryId}`);
    
    // Si está habilitado el modo de datos mock, devolver directamente
    if (USE_MOCK_DATA) {
      console.log('Usando datos mock para subcategorías');
      return mockSubcategories.filter(sub => sub.categoryId === categoryId);
    }
    
    // ESTRATEGIA 1: A través del API Gateway (ruta estándar)
    try {
      console.log("Estrategia 1: Usando API Gateway - ruta estándar");
      const response = await apiClient.get(`/categories/${categoryId}/subcategories`);
      console.log("Respuesta:", response.data);
      
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data;
      } else if (response.data && typeof response.data === 'object') {
        if (Array.isArray(response.data.data)) return response.data.data;
        if (Array.isArray(response.data.subcategories)) return response.data.subcategories;
        if (Array.isArray(response.data.results)) return response.data.results;
      }
      
      console.log("La respuesta no contiene un array de subcategorías");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error("Error de API:", error.response.status, error.response.data);
        } else if (error.request) {
          console.error("No se recibió respuesta del servidor");
        } else {
          console.error("Error en la configuración:", error.message);
        }
      } else {
        console.error("Error desconocido:", error);
      }
    }
    
    // ESTRATEGIA 2: A través del API Gateway (ruta alternativa)
    try {
      console.log("Estrategia 2: Usando API Gateway - ruta de consulta");
      const response = await apiClient.get(`/subcategories?categoryId=${categoryId}`);
      console.log("Respuesta (estrategia 2):", response.data);
      
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data;
      } else if (response.data && typeof response.data === 'object') {
        if (Array.isArray(response.data.data)) return response.data.data;
        if (Array.isArray(response.data.subcategories)) return response.data.subcategories;
        if (Array.isArray(response.data.results)) return response.data.results;
      }
    } catch (error) {
      console.error("Error con estrategia 2:", error);
    }
    
    // ESTRATEGIA 3: Conexión directa al servicio (bypass del gateway)
    try {
      console.log("Estrategia 3: Conexión directa al servicio");
      // Intenta conectar directamente al category-service
      const directResponse = await fetch(`http://localhost:3005/subcategories?categoryId=${categoryId}`);
      if (directResponse.ok) {
        const data = await directResponse.json();
        console.log("Respuesta directa:", data);
        
        if (Array.isArray(data) && data.length > 0) {
          return data;
        }
      } else {
        console.error("Error en respuesta directa:", directResponse.status);
      }
    } catch (error) {
      console.error("Error con conexión directa:", error);
    }
    
    // Todas las estrategias fallaron, usar datos de respaldo
    console.warn("Usando datos mock como último recurso");
    return mockSubcategories.filter(sub => sub.categoryId === categoryId);
  }
};

// Datos de ejemplo para usar si la API falla
const mockCategories: Category[] = [
  { id: 1, name: 'Belleza y Cuidado Personal', slug: 'belleza-cuidado-personal' },
  { id: 2, name: 'Automóviles y Mecánica', slug: 'automoviles-mecanica' },
  { id: 3, name: 'Construcción y Reparaciones', slug: 'construccion-reparaciones' },
  { id: 4, name: 'Cuidado de Mascotas', slug: 'cuidado-mascotas' },
  { id: 5, name: 'Educación y Enseñanza', slug: 'educacion-ensenanza' }
];

const mockSubcategories: Subcategory[] = [
  { id: 101, name: 'Peluquería', categoryId: 1, slug: 'peluqueria' },
  { id: 102, name: 'Manicura y Pedicura', categoryId: 1, slug: 'manicura-pedicura' },
  { id: 103, name: 'Maquillaje', categoryId: 1, slug: 'maquillaje' },
  { id: 104, name: 'Masajes', categoryId: 1, slug: 'masajes' },
  { id: 201, name: 'Mecánica General', categoryId: 2, slug: 'mecanica-general' },
  { id: 202, name: 'Electricidad Automotriz', categoryId: 2, slug: 'electricidad-automotriz' },
  { id: 203, name: 'Lavado de Autos', categoryId: 2, slug: 'lavado-autos' },
  { id: 301, name: 'Albañilería', categoryId: 3, slug: 'albanileria' },
  { id: 302, name: 'Plomería', categoryId: 3, slug: 'plomeria' },
  { id: 303, name: 'Electricidad', categoryId: 3, slug: 'electricidad' },
  { id: 401, name: 'Peluquería Canina', categoryId: 4, slug: 'peluqueria-canina' },
  { id: 402, name: 'Paseo de Perros', categoryId: 4, slug: 'paseo-perros' },
  { id: 501, name: 'Clases Particulares', categoryId: 5, slug: 'clases-particulares' },
  { id: 502, name: 'Idiomas', categoryId: 5, slug: 'idiomas' }
];

export default categoryService;