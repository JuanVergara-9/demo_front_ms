import { useContext } from 'react';
// Importación correcta del contexto exportado
import { AuthContext } from '../features/auth/context/AuthContext';

// Mantener la interfaz User por compatibilidad
export interface User {
  id: number;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
}

// Función de adaptación para mantener compatibilidad con código existente
export const useAuth = () => {
  // Obtener el contexto real de AuthContext
  const authContext = useContext(AuthContext);
  
  if (!authContext) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  // Devolver una versión adaptada que sea compatible con ambas interfaces
  return {
    user: authContext.user,
    isAuthenticated: authContext.isAuthenticated,
    isLoading: authContext.isLoading,
    logout: authContext.logout,
    refreshUser: authContext.refreshUser
  };
};

// Para componentes nuevos, recomendamos usar directamente:
// import { useAuth } from '../features/auth/context/AuthContext';