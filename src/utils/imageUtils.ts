/**
 * Utilidad para manejar URLs de imágenes en la aplicación
 */

// URL base donde se sirven las imágenes
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Genera una URL completa para una imagen de perfil
 * @param filename Nombre del archivo de imagen o ruta parcial
 * @returns URL completa a la imagen o imagen por defecto si filename es nulo
 */
export const getImageUrl = (filename?: string | null): string => {
  if (!filename) return '/assets/default-profile.jpg';
  
  // Si ya es una URL completa, devolverla tal cual
  if (filename.startsWith('http://') || filename.startsWith('https://')) {
    return filename;
  }
  
  // Si ya tiene la ruta de uploads, asegurarse de que tenga la URL base
  if (filename.startsWith('/uploads/')) {
    return `${API_URL}${filename}`;
  }
  
  // Si es solo el nombre del archivo, construir la URL completa
  return `${API_URL}/uploads/${filename}`;
};

/**
 * Genera las iniciales de un nombre para usar como avatar alternativo
 * @param firstName Nombre
 * @param lastName Apellido
 * @returns Iniciales (máximo 2 caracteres)
 */
export const getInitials = (firstName: string = '', lastName: string = ''): string => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};