// src/hooks/useApiError.ts
import { useState } from 'react';
import axios, { AxiosError } from 'axios';

interface ApiErrorState {
  message: string;
  statusCode?: number;
  details?: any;
}

export function useApiError() {
  const [error, setError] = useState<ApiErrorState | null>(null);

  const handleApiError = (err: unknown) => {
    if (axios.isAxiosError(err)) {
      const axiosError = err as AxiosError;
      const statusCode = axiosError.response?.status;
      let message = 'Ha ocurrido un error en la comunicación con el servidor.';
      
      if (statusCode === 401) {
        message = 'Sesión expirada. Por favor, inicia sesión nuevamente.';
      } else if (statusCode === 403) {
        message = 'No tienes permisos para realizar esta acción.';
      } else if (statusCode === 404) {
        message = 'El recurso solicitado no existe.';
      } else if (statusCode === 422 || statusCode === 400) {
        message = 'Los datos enviados no son válidos.';
      } else if (statusCode !== undefined && statusCode >= 500) {
        message = 'Error en el servidor. Por favor, intenta más tarde.';
      }

      setError({
        message,
        statusCode,
        details: axiosError.response?.data
      });
    } else {
      setError({
        message: 'Ha ocurrido un error inesperado.',
        details: err
      });
    }

    console.error('API Error:', err);
  };

  const clearError = () => setError(null);

  return {
    error,
    handleApiError,
    clearError
  };
}