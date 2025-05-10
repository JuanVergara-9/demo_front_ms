// src/features/providers/services/providerService.ts
import apiClient from '../../../api/apiClient';
import { Provider, ProviderSearchFilters } from '../types';

// Interfaz para estadísticas del proveedor
export interface ProviderStats {
  services: number;
  reviews: number;
  jobs: number;
  rating: number;
  views: number;
}

// Interfaz extendida para búsquedas más avanzadas
export interface AdvancedSearchParams extends ProviderSearchFilters {
  q?: string; // Término de búsqueda
  location?: string; // Para búsqueda por ubicación (ciudad o provincia)
}

export const providerService = {
  // Crear perfil de proveedor con FormData
  createProfile: async (formData: FormData): Promise<Provider> => {
    // 1. Asegurarse de obtener el token más reciente
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.error('No hay token disponible para crear perfil de proveedor');
      throw new Error('Autenticación requerida');
    }
    
    try {
      // 2. Decodificar y verificar el contenido del token
      const tokenParts = token.split('.');
      if (tokenParts.length === 3) {
        const payload = JSON.parse(atob(tokenParts[1]));
        console.log('Contenido del token JWT:', {
          userId: payload.id,
          role: payload.role,
          exp: new Date(payload.exp * 1000).toISOString()
        });
        
        // Verificar que el rol sea correcto
        if (payload.role !== 'provider') {
          console.warn('⚠️ El token no tiene rol de provider:', payload.role);
        }
      }
      
      // 3. Logear información del FormData para verificar campos 
      console.log('FormData contiene estos campos:');
      for (const [key, value] of formData.entries()) {
        const valuePreview = value instanceof File 
          ? `[File: ${value.name}, ${value.type}, ${value.size} bytes]` 
          : value;
        console.log(`- ${key}: ${valuePreview}`);
      }
      
      // 4. Enviar la solicitud con headers mejorados
      console.log('Enviando solicitud a /providers con token');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/providers`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // ⚠️ NO establecer Content-Type para FormData
        },
        body: formData
      });
      
      // 5. Mejor manejo de errores con detalles adicionales
      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        let errorDetail;
        
        if (contentType && contentType.includes('application/json')) {
          errorDetail = await response.json();
        } else {
          errorDetail = await response.text();
        }
        
        console.error('Error al crear perfil de proveedor:', {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
          data: errorDetail
        });
        
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Excepción al crear perfil:', error);
      throw error;
    }
  },

  // Obtener perfil propio
  getMyProfile: async (): Promise<Provider> => {
    try {
      console.log('Solicitando mi perfil de proveedor');
      // Obtener el token más reciente
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Autenticación requerida');
      }
      
      // Usar la misma estructura de URL que has usado en createProfile
      const apiUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/providers/me`;
      console.log('Solicitando perfil de proveedor desde:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorDetail = await response.text();
        console.error('Error al obtener perfil:', {
          status: response.status,
          statusText: response.statusText,
          details: errorDetail
        });
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Excepción al obtener perfil:', error);
      throw error;
    }
  },

  getFeaturedProviders: async (): Promise<Provider[]> => {
    try {
      // El endpoint debe devolver proveedores ordenados por rating/reviews
      const response = await apiClient.get('/providers/featured');
      return response.data;
    } catch (error: any) {
      // NUEVO: Manejar error 404 como "no hay proveedores destacados"
      if (error.response && error.response.status === 404) {
        console.log('No hay proveedores destacados (404)');
        return [];
      }
      console.error('Error al obtener proveedores destacados:', error);
      throw error;
    }
  },
  
  // Actualizar perfil propio (puede ser FormData si incluye archivos)
  updateProfile: async (data: Partial<Provider> | FormData): Promise<Provider> => {
    const token = localStorage.getItem('token');
    
    const config = data instanceof FormData
      ? { 
          headers: { 
            'Content-Type': 'multipart/form-data',
            'Authorization': token ? `Bearer ${token}` : '',
          } 
        }
      : {};
    const response = await apiClient.put('/providers/me', data, config);
    return response.data;
  },

  // Obtener proveedor por ID
  getProviderById: async (id: number): Promise<Provider> => {
    try {
      const response = await apiClient.get(`/providers/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        console.error(`Proveedor con ID ${id} no encontrado`);
      }
      throw error; // Aquí sí propagamos el error, porque queremos mostrar "no encontrado"
    }
  },

  // Método avanzado de búsqueda que soporta múltiples parámetros
  search: async (params: AdvancedSearchParams): Promise<Provider[] | { providers: Provider[], total: number }> => {
    try {
      // Construir parámetros de consulta
      const queryParams = new URLSearchParams();
      
      // Agregar todos los parámetros que no sean undefined, null o string vacío
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          // Si es un objeto, convertirlo a string (su ID)
          if (typeof value === 'object' && value !== null && 'id' in value) {
            queryParams.append(key, value.id.toString());
          } else {
            queryParams.append(key, value.toString());
          }
        }
      });
      
      // Realizar la petición
      console.log(`Buscando proveedores con parámetros: ${queryParams.toString()}`);
      const response = await apiClient.get(`/providers/search?${queryParams.toString()}`);
      
      // Verificar el formato de la respuesta y normalizarla
      if (response.data) {
        if (Array.isArray(response.data)) {
          // Si es un array directo de proveedores
          return response.data;
        } else if (response.data.providers) {
          // Si es un objeto con providers y metadatos
          return {
            providers: response.data.providers,
            total: response.data.total || response.data.providers.length
          };
        } else {
          // Cualquier otro formato, intentar devolver el objeto completo
          return response.data;
        }
      }
      
      // Si la respuesta es inválida
      return [];
    } catch (error: any) {
      // NUEVO: Manejar error 404 como "no hay resultados"
      if (error.response && error.response.status === 404) {
        console.log('Búsqueda sin resultados (404):', params);
        return { providers: [], total: 0 };
      }
      console.error('Error al buscar proveedores:', error);
      throw error;
    }
  },
  
  // Método actualizado que reemplaza al existente, con soporte para filtros
  getByCategory: async (categoryId: number, filters: Partial<ProviderSearchFilters> = {}): Promise<Provider[]> => {
    try {
      // Construir query params basados en los filtros
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
      
      const queryString = params.toString() ? `?${params.toString()}` : '';
      const url = `/providers/category/${categoryId}${queryString}`;
      console.log(`Solicitando proveedores por categoría: ${url}`);
      
      const response = await apiClient.get(url);
      return response.data;
    } catch (error: any) {
      // NUEVO: Manejar error 404 como "no hay resultados"
      if (error.response && error.response.status === 404) {
        console.log(`No hay proveedores para la categoría ${categoryId}`);
        return [];
      }
      console.error(`Error al obtener proveedores por categoría ${categoryId}:`, error);
      throw error;
    }
  },

  // Método actualizado que reemplaza al existente, con soporte para filtros
  getBySubcategory: async (subcategoryId: number, filters: Partial<ProviderSearchFilters> = {}): Promise<Provider[]> => {
    try {
      // Construir query params basados en los filtros
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
      
      const queryString = params.toString() ? `?${params.toString()}` : '';
      const url = `/providers/subcategory/${subcategoryId}${queryString}`;
      
      console.log(`Solicitando proveedores por subcategoría: ${url}`);
      const response = await apiClient.get(url);
      
      // Verificar y normalizar respuesta
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data && response.data.providers) {
        return response.data.providers;
      } else if (response.data && typeof response.data === 'object') {
        return [response.data]; // Si es un objeto individual
      }
      return [];
    } catch (error: any) {
      // NUEVO: Manejar explícitamente error 404
      if (error.response && error.response.status === 404) {
        console.log(`No hay proveedores para la subcategoría ${subcategoryId} (404)`);
        return [];
      }
      
      // Otros errores los propagamos pero con más detalles
      console.error(`Error al obtener proveedores por subcategoría ${subcategoryId}:`, error);
      console.error('Detalles del error:', {
        status: error.response?.status,
        message: error.message,
        responseData: error.response?.data
      });
      throw error;
    }
  },

  // Búsqueda básica (mantenemos por compatibilidad)
  searchProviders: async (query: string): Promise<Provider[]> => {
    try {
      const response = await apiClient.get(`/providers/search?q=${query}`);
      return response.data;
    } catch (error: any) {
      // NUEVO: Manejar error 404 como "no hay resultados"
      if (error.response && error.response.status === 404) {
        console.log(`No hay resultados para la búsqueda "${query}"`);
        return [];
      }
      console.error('Error en búsqueda de proveedores:', error);
      throw error;
    }
  },
  
  // Obtener estadísticas del proveedor (simulado por ahora)
  getProviderStats: async (providerId: number): Promise<ProviderStats> => {
    console.log(`Obteniendo estadísticas para proveedor: ${providerId}`);
    
    // En un entorno real, aquí harías una llamada API:
    // const response = await apiClient.get(`/providers/${providerId}/stats`);
    // return response.data;
    
    // Por ahora devolvemos datos simulados
    return {
      services: 3,
      reviews: 6, 
      jobs: 29,
      rating: 4.7,
      views: 120
    };
  },

  // Obtener todos los proveedores (útil para admin o búsqueda general)
  getAll: async (filters?: ProviderSearchFilters): Promise<Provider[]> => {
    try {
      // Construir query params basados en los filtros
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            if (typeof value === 'object' && value !== null && 'id' in value) {
              params.append(key, value.id.toString());
            } else {
              params.append(key, value.toString());
            }
          }
        });
      }
      
      const queryString = params.toString() ? `?${params.toString()}` : '';
      console.log(`Solicitando todos los proveedores: /providers${queryString}`);
      const response = await apiClient.get(`/providers${queryString}`);
      return response.data;
    } catch (error: any) {
      // NUEVO: Manejar error 404 como "no hay resultados"
      if (error.response && error.response.status === 404) {
        console.log('No hay proveedores disponibles (404)');
        return [];
      }
      console.error('Error al obtener todos los proveedores:', error);
      throw error;
    }
  }
};