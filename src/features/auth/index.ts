// src/features/auth/index.ts
// Re-exporta todo lo que debería ser público desde este módulo

// Contexto
export { AuthProvider, useAuth } from './context/AuthContext';

// Componentes
export { default as LoginForm } from './components/LoginForm';
export { default as RegisterForm } from './components/RegisterForm';
export { default as BecomeProviderForm } from './components/BecomeProviderForm';

// Páginas
export { default as LoginPage } from './pages/LoginPage';
export { default as RegisterPage } from './pages/RegisterPage';
export { default as BecomeProviderPage } from './pages/BecomeProviderPage';

// Tipos
export type { User, LoginPayload, RegisterPayload, AuthResponse } from './types';

// Servicios
export { authService } from './services/authService';