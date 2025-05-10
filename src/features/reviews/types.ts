// src/features/reviews/types.ts

// Interfaz principal que mapea exactamente al modelo de Sequelize en el backend
export interface Review {
  id: number;                // ID autogenerado que Sequelize crea
  rating: number;            // FLOAT, allowNull: false
  comment: string | null;    // TEXT, allowNull: true
  userId: number;            // INTEGER, allowNull: false
  providerId: number;        // INTEGER, allowNull: false
  createdAt: string;         // Fecha de creación (timestamps: true)
  updatedAt: string;         // Fecha de actualización (timestamps: true)
  
  // Campos opcionales expandidos (para cuando se incluyen relaciones)
  userName?: string;         // Nombre de usuario que dejó la reseña
  userPicture?: string;      // Foto de perfil del usuario
  providerName?: string;     // Nombre del proveedor evaluado
}

// Interfaz para crear una nueva reseña (solo los campos requeridos para POST)
export interface ReviewInput {
  rating: number;            // Calificación (1-5)
  comment?: string;          // Comentario (opcional)
  providerId: number;        // ID del proveedor
  // No necesitamos userId porque se tomará del token de autenticación
}

// Interfaz para actualizar una reseña existente
export interface ReviewUpdate {
  rating?: number;           // Campos opcionales, podemos actualizar solo algunos
  comment?: string;
}

// Interfaz para estadísticas de reseñas
export interface ReviewStats {
  averageRating: number;     // Promedio de calificaciones
  totalReviews: number;      // Total de reseñas
  distribution: {            // Distribución de reseñas por calificación
    '1': number;             // Cantidad de reseñas con 1 estrella
    '2': number;
    '3': number;
    '4': number;
    '5': number;
  };
}

// Interfaz para filtrar reseñas en consultas
export interface ReviewFilters {
  providerId?: number;
  userId?: number;
  minRating?: number;
  maxRating?: number;
  sortBy?: 'newest' | 'oldest' | 'rating_high' | 'rating_low';
  page?: number;
  limit?: number;
}