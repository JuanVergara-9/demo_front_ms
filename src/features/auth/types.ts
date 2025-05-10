// src/features/auth/types.ts

// Modelo de usuario
export interface User {
  id: number;
  name: string; // <-- Nota este campo name
  email: string;
  role: string;
  profilePicture?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Datos para inicio de sesión
export interface LoginPayload {
  email: string;
  password: string;
  rememberMe?: boolean; // Added rememberMe property
}

// Datos para registro de usuario
export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
  confirmPassword?: string; // Solo para validación frontend
}

// Respuesta del servidor tras autenticación
export interface AuthResponse {
  token: string;
  user: User;
  userId?: number;
}

// Estado global de autenticación (para context)
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}