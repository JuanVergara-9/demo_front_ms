// src/features/reviews/services/reviewService.ts
import apiClient from '../../../api/apiClient';
import { Review, ReviewInput } from '../types';

// Datos mock para demostración
const mockReviews: Review[] = [
  {
    id: 6,
    rating: 5,
    comment: "Excelente profesional, muy puntual y eficiente. El trabajo quedó perfecto y en tiempo récord.",
    userId: 10,
    providerId: 6,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 días atrás
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    userName: "María González"
  },
  {
    id: 7,
    rating: 4,
    comment: "Muy buen servicio aunque llegó un poco tarde. El resultado final fue satisfactorio.",
    userId: 11,
    providerId: 6,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 días atrás
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    userName: "Carlos Rodríguez"
  },
  {
    id: 4,
    rating: 5,
    comment: "Increíble atención y profesionalismo. Sin duda volveré a contratarle.",
    userId: 12,
    providerId: 6,
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(), // 25 días atrás
    updatedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    userName: "Laura Pérez"
  },
];

// Arreglar CORS para todas las peticiones
apiClient.defaults.withCredentials = true;

export const reviewService = {
  getReviewsByProvider: async (providerId: number): Promise<Review[]> => {
    try {
      console.log(`Mock: Obteniendo reseñas para el proveedor ${providerId}`);
      // Devolver datos mock filtrados por providerId
      return mockReviews.filter(r => r.providerId === providerId);
      
      // Código original comentado
      // const response = await apiClient.get(`/reviews/provider/${providerId}`);
      // return response.data;
    } catch (error) {
      console.error('Error al obtener reviews:', error);
      return mockReviews.filter(r => r.providerId === providerId); // Fallback a datos mock
    }
  },

  createReview: async (review: ReviewInput): Promise<Review> => {
    try {
      console.log('Mock: Creando nueva reseña', review);
      
      // Simular la creación de una reseña
      const newReview: Review = {
        id: mockReviews.length + 1,
        rating: review.rating,
        comment: review.comment || "",
        userId: 99, // Usuario actual simulado
        providerId: review.providerId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userName: "Usuario Demo"
      };
      
      // Agregar a la lista de mock
      mockReviews.push(newReview);
      console.log('Mock: Reseña creada con éxito', newReview);
      
      return newReview;
      
      // Código original comentado
      // const response = await apiClient.post('/reviews', review);
      // return response.data;
    } catch (error) {
      console.error('Error al crear review:', error);
      throw error;
    }
  },

  // Opcional: actualizar o eliminar reviews
  updateReview: async (id: number, review: Partial<ReviewInput>): Promise<Review> => {
    try {
      console.log(`Mock: Actualizando reseña ${id}`, review);
      
      // Encontrar la reseña en el array mock
      const index = mockReviews.findIndex(r => r.id === id);
      if (index === -1) throw new Error('Reseña no encontrada');
      
      // Actualizar la reseña
      mockReviews[index] = {
        ...mockReviews[index],
        ...review,
        updatedAt: new Date().toISOString()
      };
      
      console.log('Mock: Reseña actualizada', mockReviews[index]);
      return mockReviews[index];
      
      // Código original comentado
      // const response = await apiClient.put(`/reviews/${id}`, review);
      // return response.data;
    } catch (error) {
      console.error('Error al actualizar review:', error);
      throw error;
    }
  },

  deleteReview: async (id: number): Promise<void> => {
    try {
      console.log(`Mock: Eliminando reseña ${id}`);
      
      // Encontrar el índice de la reseña
      const index = mockReviews.findIndex(r => r.id === id);
      if (index === -1) throw new Error('Reseña no encontrada');
      
      // Eliminar la reseña del array
      mockReviews.splice(index, 1);
      console.log('Mock: Reseña eliminada con éxito');
      
      // Código original comentado
      // await apiClient.delete(`/reviews/${id}`);
    } catch (error) {
      console.error('Error al eliminar review:', error);
      throw error;
    }
  },

  // NUEVOS MÉTODOS
  getMyReviews: async (): Promise<Review[]> => {
    try {
      console.log('Mock: Obteniendo mis reseñas');
      
      // Simular reseñas hechas por el usuario actual (userId = 99)
      const myReviews = mockReviews.filter(r => r.userId === 99);
      
      // Si no hay reseñas del usuario actual, crear algunas de ejemplo
      if (myReviews.length === 0) {
        const exampleReviews: Review[] = [
          {
            id: 100,
            rating: 4,
            comment: "Trabajé con este profesional hace una semana y quedé muy satisfecho con el resultado.",
            userId: 99, // Usuario simulado actual
            providerId: 3,
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            userName: "Usuario Demo"
          },
          {
            id: 101,
            rating: 5,
            comment: "Excelente servicio, lo recomiendo ampliamente.",
            userId: 99, // Usuario simulado actual
            providerId: 4,
            createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
            userName: "Usuario Demo"
          }
        ];
        
        // Añadir al array de mock
        mockReviews.push(...exampleReviews);
        return exampleReviews;
      }
      
      return myReviews;
      
      // Código original comentado
      // const response = await apiClient.get('/reviews/my-reviews');
      // return response.data || [];
    } catch (error) {
      console.error('Error al obtener mis reviews:', error);
      return []; // Retornar array vacío en caso de error
    }
  },
    
  getReviewsForMyProviderProfile: async (): Promise<Review[]> => {
    try {
      console.log('Mock: Obteniendo reseñas de mi perfil de proveedor');
      
      // Simular que el usuario actual es el proveedor con ID 1
      const providerIdActual = 1;
      
      // Obtener reseñas para este proveedor
      const providersReviews = mockReviews.filter(r => r.providerId === providerIdActual);
      return providersReviews;
      
      // Código original comentado
      // const response = await apiClient.get('/reviews/my-provider-profile');
      // return response.data || [];
    } catch (error) {
      console.error('Error al obtener reviews de mi perfil:', error);
      return []; // Retornar array vacío en caso de error
    }
  }
};

// Añadir función auxiliar al objeto window para pruebas desde la consola
if (typeof window !== 'undefined') {
  (window as any).addTestReview = async (providerId: number, rating: number, comment: string) => {
    try {
      const result = await reviewService.createReview({
        providerId,
        rating,
        comment
      });
      console.log('Reseña agregada:', result);
      return result;
    } catch (error) {
      console.error('Error al agregar reseña:', error);
    }
  };
  
  console.info('Función addTestReview() disponible en la consola del navegador.');
  console.info('Uso: addTestReview(providerId, rating, comment)');
  console.info('Ejemplo: addTestReview(1, 5, "Excelente servicio")');
}