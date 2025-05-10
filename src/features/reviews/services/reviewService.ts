// src/features/reviews/services/reviewService.ts
import apiClient from '../../../api/apiClient';
import { Review, ReviewInput } from '../types';

export const reviewService = {
  getReviewsByProvider: async (providerId: number): Promise<Review[]> => {
    try {
      const response = await apiClient.get(`/reviews/provider/${providerId}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener reviews:', error);
      throw error;
    }
  },

  createReview: async (review: ReviewInput): Promise<Review> => {
    try {
      const response = await apiClient.post('/reviews', review);
      return response.data;
    } catch (error) {
      console.error('Error al crear review:', error);
      throw error;
    }
  },

  // Opcional: actualizar o eliminar reviews
  updateReview: async (id: number, review: Partial<ReviewInput>): Promise<Review> => {
    try {
      const response = await apiClient.put(`/reviews/${id}`, review);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar review:', error);
      throw error;
    }
  },

  deleteReview: async (id: number): Promise<void> => {
    try {
      await apiClient.delete(`/reviews/${id}`);
    } catch (error) {
      console.error('Error al eliminar review:', error);
      throw error;
    }
  },
    // NUEVOS MÉTODOS - Añade estos dos métodos
    getMyReviews: async (): Promise<Review[]> => {
      try {
        // Endpoint para obtener las reviews que ha hecho el usuario actual (cliente)
        const response = await apiClient.get('/reviews/my-reviews');
        
        // Si el backend aún no tiene este endpoint, puedes mostrar datos simulados:
        if (!response.data) {
          console.warn('Endpoint /reviews/my-reviews no implementado en el backend');
          return []; // Retornar array vacío mientras se implementa
        }
        
        return response.data;
      } catch (error) {
        console.error('Error al obtener mis reviews:', error);
        return []; // Retornar array vacío en caso de error
      }
    },
    
    getReviewsForMyProviderProfile: async (): Promise<Review[]> => {
      try {
        // Endpoint para obtener las reviews recibidas por el proveedor actual
        const response = await apiClient.get('/reviews/my-provider-profile');
        
        // Si el backend aún no tiene este endpoint, puedes usar la alternativa:
        if (!response.data) {
          console.warn('Endpoint /reviews/my-provider-profile no implementado');
          
          // Alternativa: usar getProviderProfile para obtener el ID y luego las reviews
          const profileResponse = await apiClient.get('/providers/me');
          if (profileResponse.data && profileResponse.data.id) {
            return await reviewService.getReviewsByProvider(profileResponse.data.id);
          }
          return [];
        }
        
        return response.data;
      } catch (error) {
        console.error('Error al obtener reviews de mi perfil:', error);
        return []; // Retornar array vacío en caso de error
      }
    }
};