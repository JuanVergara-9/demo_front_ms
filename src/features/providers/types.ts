// Tipo para datos de entrada al crear/actualizar un perfil de proveedor
export interface ProviderProfileData {
    firstName: string;
    lastName: string;
    phone: string;
    birthdate: string;  // formato ISO 'YYYY-MM-DD'
    province: string;
    city: string;
    address: string;
    categories: number[] | { id: number; name: string }[];
    subcategories: number[] | { id: number; name: string }[];
    description: string;
    profilePicture?: File | string | null;
    dniCuit: string;
    certificate?: File | string | null;
    portfolio?: File | string | null;

    
    userId?: number; // Añadir esta propiedad
  }
  
  // Tipo para la respuesta completa de un proveedor desde la API
  export interface Provider {
    id: number;
    userId: number;
    firstName: string;
    lastName: string;
    phone: string;
    birthdate: string;
    province: string;
    city: string;
    address: string;
    categories: {
      id: number;
      name: string;
    }[];
    subcategories: {
      id: number;
      name: string;
      categoryId: number;
    }[];
    description: string;
    profilePicture: string | null;
    dniCuit: string;
    certificate: string | null;
    portfolio: string | null;
    createdAt: string;
    updatedAt: string;
    rating?: number;
    reviewCount?: number;
    
    // Propiedades calculadas que podrían venir de relaciones o agregaciones
    averageRating?: number;
    totalReviews?: number;
    user?: {
      name: string;
      email: string;
    };

  // Versiones en snake_case (todas opcionales)
  user_id?: number;
  first_name?: string;
  last_name?: string;
  birth_date?: string;
  profile_picture?: string | null;
  dni_cuit?: string;
  created_at?: string;
  updated_at?: string;
  average_rating?: number;
  total_reviews?: number;
  }
  
  // Tipo para filtros de búsqueda de proveedores
  export interface ProviderSearchFilters {
    category?: number;
    subcategory?: number;
    province?: string;
    city?: string;
    minRating?: number;
    sortBy?: 'rating' | 'reviews' | 'newest';
    page?: number;
    limit?: number;
  }
  
  // Tipos para reseñas relacionadas con proveedores
  export interface ProviderReview {
    id: number;
    userId: number;
    providerId: number;
    rating: number;
    comment: string;
    createdAt: string;
    userName?: string;
    userPicture?: string;
  }
  
  // Tipo para resumen de calificaciones
  export interface RatingSummary {
    averageRating: number;
    totalReviews: number;
    distribution: {
      [key: number]: number; // e.g., {1: 5, 2: 10, ...} -> 5 reseñas de 1 estrella, etc.
    };
  }