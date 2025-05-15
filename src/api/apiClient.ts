import axios from 'axios';
import { mockAPIHandler } from '../mocks/mockAPIHandler';

// Crear instancia base de axios
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flag para determinar si se usa modo mock o no
const USE_MOCK_MODE = true; // Cambiar a false para conectar con backend real

// Interceptor de request: Simular respuestas en modo mock
apiClient.interceptors.request.use(
  (config) => {
    // Agregar token si existe
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Si estamos en modo mock, interceptar la solicitud
    if (USE_MOCK_MODE) {
      console.log(`[MOCK API] Interceptando: ${config.method?.toUpperCase()} ${config.url}`);
      
      // Devolver una promesa que será resuelta por el mock handler
      return new Promise((resolve) => {
        const mockResponse = mockAPIHandler(config);
        // Simular latencia de red
        setTimeout(() => {
          resolve({ 
            ...config,
            adapter: () =>
              Promise.resolve({
                ...mockResponse,
                config: {
                  ...config,
                  headers: config.headers ?? {},
                },
              })
          });
        }, 300);
      });
    }

    // En modo normal, continuar con la solicitud
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;