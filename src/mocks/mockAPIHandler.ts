import { AxiosRequestConfig } from 'axios';
import { mockProviders } from './providers';
import { mockCategories, mockSubcategories } from './categories';
import { mockReviews } from './reviews';
import { mockUsers } from './users';

// Gestionar todas las respuestas mock según la ruta y método
export const mockAPIHandler = (config: AxiosRequestConfig) => {
  const { url, method, data } = config;
  console.log(`[MOCK] Procesando ${method} ${url}`);
  
  // Normalizar URL para comparar
  const path = url?.replace(/\/$/, '').toLowerCase();
  
  // ---- PROVIDERS ----
  if (path?.match(/\/providers$/i) && method?.toUpperCase() === 'GET') {
    // Obtener todos los proveedores
    const params = new URLSearchParams(config.params);
    let result = [...mockProviders];
    
    // Aplicar filtros si existen
    if (params.get('category')) {
      const categoryId = Number(params.get('category'));
      result = result.filter(p => p.categories.includes(categoryId));
    }
    
    if (params.get('city')) {
      const city = params.get('city')?.toLowerCase();
      result = result.filter(p => p.city.toLowerCase().includes(city || ''));
    }
    
    if (params.get('search')) {
      const search = params.get('search')?.toLowerCase() || '';
      result = result.filter(p => 
        p.firstName.toLowerCase().includes(search) || 
        p.lastName.toLowerCase().includes(search) ||
        p.description.toLowerCase().includes(search)
      );
    }
    
    return {
      status: 200,
      data: result,
      statusText: 'OK',
      headers: {},
      config
    };
  }
  
  if (path?.match(/\/providers\/\d+$/i) && method?.toUpperCase() === 'GET') {
    // Obtener proveedor por ID
    const id = Number(path.split('/').pop());
    const provider = mockProviders.find(p => p.id === id);
    
    if (provider) {
      return {
        status: 200,
        data: provider,
        statusText: 'OK',
        headers: {},
        config
      };
    }
    return {
      status: 404,
      data: { message: 'Provider not found' },
      statusText: 'Not Found',
      headers: {},
      config
    };
  }
  
  if (path?.match(/\/providers$/i) && method?.toUpperCase() === 'POST') {
    // Crear nuevo proveedor
    try {
      const requestData = JSON.parse(data || '{}');
      const newProvider = {
        id: mockProviders.length + 1,
        ...requestData,
        averageRating: 0,
        totalReviews: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      return {
        status: 201,
        data: newProvider,
        statusText: 'Created',
        headers: {},
        config
      };
    } catch (error) {
      return {
        status: 400,
        data: { message: 'Invalid provider data' },
        statusText: 'Bad Request',
        headers: {},
        config
      };
    }
  }
  
  if (path?.match(/\/providers\/\d+$/i) && method?.toUpperCase() === 'PUT') {
    // Actualizar proveedor
    try {
      const id = Number(path.split('/').pop());
      const provider = mockProviders.find(p => p.id === id);
      
      if (!provider) {
        return {
          status: 404,
          data: { message: 'Provider not found' },
          statusText: 'Not Found',
          headers: {},
          config
        };
      }
      
      const requestData = JSON.parse(data || '{}');
      const updatedProvider = {
        ...provider,
        ...requestData,
        updatedAt: new Date().toISOString()
      };
      
      return {
        status: 200,
        data: updatedProvider,
        statusText: 'OK',
        headers: {},
        config
      };
    } catch (error) {
      return {
        status: 400,
        data: { message: 'Invalid provider data' },
        statusText: 'Bad Request',
        headers: {},
        config
      };
    }
  }
  
  // ---- CATEGORIES ----
  if (path?.match(/\/categories$/i) && method?.toUpperCase() === 'GET') {
    // Obtener todas las categorías
    return {
      status: 200,
      data: mockCategories,
      statusText: 'OK',
      headers: {},
      config
    };
  }
  
  if (path?.match(/\/categories\/\d+$/i) && method?.toUpperCase() === 'GET') {
    // Obtener categoría por ID
    const id = Number(path.split('/').pop());
    const category = mockCategories.find(c => c.id === id);
    
    if (category) {
      return {
        status: 200,
        data: category,
        statusText: 'OK',
        headers: {},
        config
      };
    }
    return {
      status: 404,
      data: { message: 'Category not found' },
      statusText: 'Not Found',
      headers: {},
      config
    };
  }
  
  if (path?.match(/\/categories\/\d+\/subcategories$/i) && method?.toUpperCase() === 'GET') {
    // Obtener subcategorías por categoría
    const categoryId = Number(path.split('/')[2]);
    const subcategories = mockSubcategories.filter(s => s.categoryId === categoryId);
    
    return {
      status: 200,
      data: subcategories,
      statusText: 'OK',
      headers: {},
      config
    };
  }
  
  // ---- REVIEWS ----
  if (path?.match(/\/reviews\/provider\/\d+$/i) && method?.toUpperCase() === 'GET') {
    // Obtener reseñas por proveedor
    const providerId = Number(path.split('/').pop());
    const reviews = mockReviews.filter(r => r.providerId === providerId);
    
    return {
      status: 200,
      data: reviews,
      statusText: 'OK',
      headers: {},
      config
    };
  }
  
  if (path?.match(/\/reviews\/summary\/\d+$/i) && method?.toUpperCase() === 'GET') {
    // Obtener resumen de reseñas para un proveedor
    const providerId = Number(path.split('/').pop());
    const providerReviews = mockReviews.filter(r => r.providerId === providerId);
    const totalReviews = providerReviews.length;
    
    // Calcular rating promedio
    const totalRating = providerReviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;
    
    // Crear distribución de ratings
    const distribution: { [key in 1 | 2 | 3 | 4 | 5]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    providerReviews.forEach(review => {
      const rating = Math.round(review.rating) as 1 | 2 | 3 | 4 | 5;
      distribution[rating] = (distribution[rating] || 0) + 1;
    });
    
    return {
      status: 200,
      data: {
        providerId,
        averageRating,
        totalReviews,
        distribution
      },
      statusText: 'OK',
      headers: {},
      config
    };
  }
  
  if (path?.match(/\/reviews$/i) && method?.toUpperCase() === 'POST') {
    // Crear una nueva reseña
    try {
      const requestData = JSON.parse(data || '{}');
      const newReview = {
        id: mockReviews.length + 1,
        ...requestData,
        userId: 101, // Usuario demo
        userName: "Usuario Demo",
        createdAt: new Date().toISOString()
      };
      
      return {
        status: 201,
        data: newReview,
        statusText: 'Created',
        headers: {},
        config
      };
    } catch (error) {
      return {
        status: 400,
        data: { message: 'Invalid review data' },
        statusText: 'Bad Request',
        headers: {},
        config
      };
    }
  }
  
  if (path?.match(/\/reviews\/check\/\d+$/i) && method?.toUpperCase() === 'GET') {
    // Verificar si el usuario ya ha dejado una reseña
    const providerId = Number(path.split('/').pop());
    // Asumimos que el usuario actual tiene ID 101
    const userReview = mockReviews.find(r => r.providerId === providerId && r.userId === 101);
    
    return {
      status: 200,
      data: {
        hasReviewed: !!userReview,
        review: userReview || null
      },
      statusText: 'OK',
      headers: {},
      config
    };
  }
  
  // ---- AUTH ----
  if (path?.match(/\/auth\/login$/i) && method?.toUpperCase() === 'POST') {
    // Login
    const requestData = JSON.parse(data || '{}');
    const user = mockUsers.find(u => u.email === requestData.email);
    
    if (user && requestData.password === 'demo123') {
      return {
        status: 200,
        data: {
          token: 'mock-token-' + Math.random().toString(36).substr(2),
          user: {
            ...user,
            password: undefined
          }
        },
        statusText: 'OK',
        headers: {},
        config
      };
    }
    return {
      status: 401,
      data: { message: 'Invalid credentials' },
      statusText: 'Unauthorized',
      headers: {},
      config
    };
  }
  
  if (path?.match(/\/auth\/register$/i) && method?.toUpperCase() === 'POST') {
    // Registro
    try {
      const requestData = JSON.parse(data || '{}');
      const newUser = {
        id: mockUsers.length + 1,
        ...requestData,
        role: 'client',
        createdAt: new Date().toISOString()
      };
      
      return {
        status: 201,
        data: {
          token: 'mock-token-' + Math.random().toString(36).substr(2),
          user: {
            ...newUser,
            password: undefined
          }
        },
        statusText: 'Created',
        headers: {},
        config
      };
    } catch (error) {
      return {
        status: 400,
        data: { message: 'Invalid registration data' },
        statusText: 'Bad Request',
        headers: {},
        config
      };
    }
  }
  
  if (path?.match(/\/auth\/me$/i) && method?.toUpperCase() === 'GET') {
    // Obtener datos del usuario actual
    // Asumimos que el usuario autenticado tiene ID 101
    const currentUser = mockUsers.find(u => u.id === 101);
    
    if (currentUser) {
      return {
        status: 200,
        data: {
          ...currentUser,
          password: undefined
        },
        statusText: 'OK',
        headers: {},
        config
      };
    }
    
    return {
      status: 401,
      data: { message: 'Not authenticated' },
      statusText: 'Unauthorized',
      headers: {},
      config
    };
  }
  
  if (path?.match(/\/auth\/become-provider$/i) && method?.toUpperCase() === 'POST') {
    // Convertirse en proveedor
    try {
      const requestData = JSON.parse(data || '{}');
      const newProvider = {
        id: mockProviders.length + 1,
        userId: 101, // ID del usuario actual
        ...requestData,
        averageRating: 0,
        totalReviews: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      return {
        status: 201,
        data: newProvider,
        statusText: 'Created',
        headers: {},
        config
      };
    } catch (error) {
      return {
        status: 400,
        data: { message: 'Invalid provider data' },
        statusText: 'Bad Request',
        headers: {},
        config
      };
    }
  }
  
  // ---- USER PROFILE ----
  if (path?.match(/\/users\/me$/i) && method?.toUpperCase() === 'GET') {
    // Obtener perfil completo del usuario
    const currentUser = mockUsers.find(u => u.id === 101);
    
    if (currentUser) {
      // Verificar si es proveedor
      const providerProfile = mockProviders.find(p => p.userId === currentUser.id);
      
      return {
        status: 200,
        data: {
          ...currentUser,
          password: undefined,
          isProvider: !!providerProfile,
          providerProfile: providerProfile || null
        },
        statusText: 'OK',
        headers: {},
        config
      };
    }
    
    return {
      status: 401,
      data: { message: 'Not authenticated' },
      statusText: 'Unauthorized',
      headers: {},
      config
    };
  }
  
  if (path?.match(/\/users\/me$/i) && method?.toUpperCase() === 'PUT') {
    // Actualizar perfil del usuario
    try {
      const requestData = JSON.parse(data || '{}');
      
      return {
        status: 200,
        data: {
          id: 101,
          ...requestData,
          role: 'client', // Mantener el rol
          password: undefined
        },
        statusText: 'OK',
        headers: {},
        config
      };
    } catch (error) {
      return {
        status: 400,
        data: { message: 'Invalid user data' },
        statusText: 'Bad Request',
        headers: {},
        config
      };
    }
  }
  
  // Default response cuando no hay match
  console.warn(`[MOCK] Endpoint no implementado: ${method} ${url}`);
  return {
    status: 404,
    data: { message: 'Mock API endpoint not implemented' },
    statusText: 'Not Found',
    headers: {},
    config
  };
};