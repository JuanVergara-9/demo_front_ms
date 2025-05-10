// src/features/auth/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom'; // 👈 Añadir esta importación
import { authService } from '../services/authService';
import { providerService } from '../../providers/services/providerService'; 
import { User, LoginPayload, RegisterPayload } from '../types';

// Extender la interfaz para incluir las nuevas funcionalidades
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (data: LoginPayload) => Promise<void>;
  register: (data: RegisterPayload) => Promise<void>;
  logout: () => void;
  becomeProvider: (formData: FormData) => Promise<any>;
  upgradeToProviderRole: () => Promise<any>;
  clearError: () => void;
  refreshUser: () => Promise<void>;
}

// Exportar el contexto para que useAuth.ts pueda importarlo
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Función para cargar el usuario desde localStorage
  const loadUser = () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');

      if (token && userStr) {
        try {
          const userData = JSON.parse(userStr);
          setUser(userData);
        } catch (parseError) {
          console.error('Error parsing user data:', parseError);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error loading user from storage', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar usuario al iniciar
  useEffect(() => {
    loadUser();
    
    const handleUnauthorized = () => {
      logout();
      setError('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
    };
    
    document.addEventListener('unauthorized', handleUnauthorized);
    
    return () => {
      document.removeEventListener('unauthorized', handleUnauthorized);
    };
  }, []);

  // Función login con mejor manejo de respuestas
  const login = async (data: LoginPayload) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Intentando login con email:", data.email);
      
      const response = await authService.login(data);
      console.log("Respuesta de login completa:", response);
      
      // Usar type assertion para evitar errores de TypeScript
      const anyResponse = response as any;
      
      // Extraer token y usuario de forma flexible
      let token = anyResponse.token;
      let userData = anyResponse.user;
      
      // Intentar encontrar token en diferentes ubicaciones
      if (!token) {
        token = anyResponse.access_token || anyResponse.accessToken || 
                (anyResponse.data ? anyResponse.data.token : undefined);
        console.log("Buscando token en ubicaciones alternativas:", !!token);
      }
      
      // Intentar encontrar datos de usuario en diferentes ubicaciones
      if (!userData) {
        userData = anyResponse.userData || 
                  (anyResponse.data ? anyResponse.data.user : undefined) || 
                  anyResponse.userInfo;
        console.log("Buscando datos de usuario en ubicaciones alternativas:", !!userData);
        
        // Si no hay objeto usuario pero tenemos credenciales básicas
        if (!userData && token && data.email) {
          console.log("Creando objeto de usuario mínimo con email:", data.email);
          userData = {
            id: anyResponse.userId || 1,
            email: data.email,
            role: anyResponse.role || 'user',
            name: data.email.split('@')[0]
          };
        }
      }
      
      // Validación final
      if (!token) {
        console.error("No se pudo encontrar un token en la respuesta:", response);
        throw new Error('No se encontró token en la respuesta');
      }
      
      // Guardar token
      localStorage.setItem('token', token);
      
      // Guardar datos del usuario si existen
      if (userData) {
        console.log("Guardando datos de usuario:", userData);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
      } else {
        console.warn("Login exitoso pero sin datos de usuario completos");
        // Intentar obtener datos del usuario con otra llamada
        try {
          await refreshUser();
        } catch (profileError) {
          console.error("Error al obtener perfil después de login:", profileError);
          // Si no se pueden obtener datos adicionales, al menos guardar un usuario básico
          const basicUser = {
            id: 0,
            email: data.email,
            role: 'user',
            name: data.email.split('@')[0]
          };
          localStorage.setItem('user', JSON.stringify(basicUser));
          setUser(basicUser);
        }
      }
    } catch (err: any) {
      // Log detallado del error para diagnóstico
      console.error("Error detallado de login:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      
      // Extraer mensaje de error de diferentes ubicaciones posibles
      const errorMessage = 
        err.response?.data?.message || 
        err.response?.data?.error || 
        err.message || 
        'Error al iniciar sesión';
        
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Implementar register
// En AuthContext.tsx
const register = async (data: RegisterPayload) => {
  setIsLoading(true);
  setError(null);
  
  try {
    const response = await authService.register(data);
    console.log("Register response:", response);
    
    // Guardar token recibido del registro
    if (response.token) {
      console.log("Guardando token después del registro:", response.token.substring(0, 15) + '...');
      localStorage.setItem('token', response.token);
      
      // Guardar datos básicos del usuario
      const userData = response.user || {
        id: response.userId,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: 'user'
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } else {
      console.error("No se recibió token en la respuesta de registro");
      throw new Error("No se recibió token al registrarse");
    }
    
    // No need to return the response as the function should return void
  } catch (err: any) {
    console.error("Error de registro:", err);
    setError(err.response?.data?.error || 'Error al registrar usuario');
    throw err;
  } finally {
    setIsLoading(false);
  }
};
  // Implementar logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };
  
  // Nueva función para actualizar el rol a proveedor
  const upgradeToProviderRole = async () => {
    try {
      console.log("Actualizando rol del usuario a proveedor");
      
      // Llamada al backend para actualizar rol
      const response = await authService.upgradeRole('provider');
      console.log("Respuesta de actualización de rol:", response);
      
      // IMPORTANTE: Guardar el nuevo token si el backend lo devuelve
      if (response.token) {
        console.log("Actualizando token con nuevo rol:", response.token.substring(0, 15) + '...');
        localStorage.setItem('token', response.token);
      }
      
      // Actualizar el usuario local con el nuevo rol
      if (user) {
        const updatedUser = { ...user, role: 'provider' };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        console.log("Usuario actualizado localmente con rol provider");
      }
      
      return response;
    } catch (err: any) {
      console.error("Error al actualizar rol:", err);
      const errorMessage = 
        err.response?.data?.message || 
        err.response?.data?.error || 
        err.message || 
        'Error al actualizar rol';
        
      setError(errorMessage);
      throw err;
    }
  };

  // Implementar becomeProvider - MODIFICADO para usar upgradeToProviderRole
  const becomeProvider = async (formData: FormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // 1. Primero actualizar el rol a proveedor
      const roleResponse = await upgradeToProviderRole();
      console.log("Rol actualizado:", roleResponse);
      
      // 2. Pequeña pausa para asegurar que el token se actualice si es necesario
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 3. Luego crear el perfil de proveedor
      console.log("Creando perfil de proveedor después de actualizar rol");
      const response = await providerService.createProfile(formData);
      console.log("Respuesta de createProfile:", response);
      
      // 4. Actualizar el usuario después de convertirse en proveedor
      await refreshUser();

      // 5. NUEVO: Redireccionar al dashboard de proveedor 👈
      navigate('/provider/dashboard');

      return response;
    } catch (err: any) {
      console.error("Error al convertirse en proveedor:", err);
      const errorDetails = {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      };
      console.error("Detalles del error:", errorDetails);
      
      setError(err.response?.data?.error || 'Error al convertirse en proveedor');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Implementar clearError
  const clearError = () => {
    setError(null);
  };

  // Implementar refreshUser
  const refreshUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log("No hay token para actualizar usuario");
        return;
      }
      
      console.log("Intentando obtener datos actualizados del usuario");
      const response = await authService.getCurrentUser();
      console.log("Respuesta de getCurrentUser:", response);
      
      if (response && response.user) {
        console.log("Actualizando datos de usuario:", response.user);
        localStorage.setItem('user', JSON.stringify(response.user));
        setUser(response.user);
      } else {
        console.warn("getCurrentUser no devolvió datos de usuario");
        
        // Intentar recuperar datos desde localStorage como fallback
        const userStr = localStorage.getItem('user');
        if (userStr) {
          try {
            const storedUser = JSON.parse(userStr);
            setUser(storedUser);
          } catch (parseError) {
            console.error("Error al parsear usuario almacenado:", parseError);
          }
        }
      }
    } catch (err: any) {
      console.error("Error al actualizar datos de usuario:", {
        message: err.message,
        response: err.response?.data
      });
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      error,
      login,
      register,
      logout,
      becomeProvider,
      upgradeToProviderRole,
      clearError,
      refreshUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook para facilitar el uso del contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};