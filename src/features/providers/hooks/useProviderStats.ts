// src/features/providers/hooks/useProviderStats.ts
import { useState, useEffect } from 'react';
import { providerService } from '../services/providerService';

interface ProviderStats {
  services: number;
  reviews: number;
  jobs: number;
  rating: number;
  views: number;
}

export const useProviderStats = (providerId: number) => {
  const [stats, setStats] = useState<ProviderStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const data = await providerService.getProviderStats(providerId);
        setStats(data);
        setError(null);
      } catch (err: any) {
        console.error('Error al cargar estadísticas:', err);
        setError('No se pudieron cargar las estadísticas');
      } finally {
        setIsLoading(false);
      }
    };

    if (providerId) {
      fetchStats();
    }
  }, [providerId]);

  return { stats, isLoading, error };
};