// useProviderProfile.ts
import { useState, useEffect } from 'react';
import { providerService } from '../services/providerService';
import { Provider } from '../types';

export const useProviderProfile = () => {
  const [provider, setProvider] = useState<Provider | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProviderProfile = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await providerService.getMyProfile();
      setProvider(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al cargar el perfil');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProviderProfile();
  }, []);

  return {
    provider,
    isLoading,
    error,
    refreshProfile: loadProviderProfile
  };
};