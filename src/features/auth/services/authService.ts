// src/features/auth/services/authService.ts
import apiClient from '../../../api/apiClient';
import { LoginPayload, RegisterPayload, AuthResponse } from '../types';

const AUTH_PREFIX = '/auth';

export const authService = {
  /**
   * Inicia sesión con email y contraseña
   */
  login: async (data: LoginPayload): Promise<AuthResponse> => {
    try {
      console.log("Enviando solicitud de login:", data);
      const response = await apiClient.post(`${AUTH_PREFIX}/login`, data);
      console.log("Respuesta completa de login:", response);
      
      // Validamos que la respuesta tenga la estructura esperada
      const responseData = response.data;
      
      // Si la respuesta no coincide con AuthResponse, adaptarla
      if (!responseData.user && responseData.userData) {
        responseData.user = responseData.userData;
      }
      
      return responseData;
    } catch (error) {
      console.error("Error en servicio de login:", error);
      throw error;
    }
  },

  /**
   * Registra un nuevo usuario
   */
  register: async (data: RegisterPayload): Promise<AuthResponse> => {
    try {
      // Normalizar datos antes de enviar
      const cleanData = {
        firstName: data.firstName?.trim(),
        lastName: data.lastName?.trim(),
        email: data.email?.trim().toLowerCase(),
        password: data.password
      };
      
      console.log("Enviando solicitud de registro:", {
        ...cleanData,
        passwordLength: cleanData.password?.length || 0
      });
      
      const response = await apiClient.post(`${AUTH_PREFIX}/register`, cleanData);
      console.log("Registro exitoso:", {
        status: response.status,
        hasToken: !!response.data.token,
        hasUser: !!response.data.user
      });
      
      return response.data;
    } catch (error: any) {
      console.error("Error en servicio de registro:", error);
      if (error.response) {
        console.error("Detalles de error:", {
          status: error.response.status,
          data: error.response.data
        });
      }
      throw error;
    }
  },

  /**
   * Obtiene información del usuario actual
   */
  getCurrentUser: async (): Promise<{ user: any }> => {
    try {
      const response = await apiClient.get(`${AUTH_PREFIX}/me`);
      return { user: response.data };
    } catch (error) {
      console.error("Error al obtener usuario actual:", error);
      
      // Intento de recuperación desde localStorage
      try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          return { user: JSON.parse(userStr) };
        }
      } catch (parseError) {
        console.error("Error al parsear usuario local:", parseError);
      }
      return { user: null };
    }
  },

  /**
   * Actualiza el rol de usuario (CORREGIDO para usar POST en lugar de PUT)
   */
/**
 * Actualiza el rol de usuario (CORREGIDO para usar PUT y ruta correcta)
 */
upgradeRole: async (newRole: string): Promise<any> => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error("No hay token disponible");
    }
    
    console.log("Token disponible:", token);
    
    // Obtener userId del localStorage si está disponible
    let userId = null;
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        userId = user.id || user.userId;
      } catch (e) {
        console.error("Error al parsear usuario:", e);
      }
    }
    
    // CORRECCIÓN: Enviar userId junto con el role
    console.log("Enviando solicitud para actualizar rol a:", newRole, "para usuario:", userId);
    const response = await apiClient.put(`${AUTH_PREFIX}/role`, {
      role: newRole,
      userId: userId // Añadir el userId explícitamente
    });
    
    return response.data;
  } catch (error: any) {
    console.error("Error en upgradeRole:", error);
    throw error;
  }
},

  /**
   * Cierra la sesión del usuario
   */
  logout: async (): Promise<void> => {
    try {
      await apiClient.post(`${AUTH_PREFIX}/logout`);
    } catch (error) {
      console.error("Error en logout:", error);
    } finally {
      // Limpiar estado local incluso si hay error en el servidor
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }
};