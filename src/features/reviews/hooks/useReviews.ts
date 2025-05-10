// src/features/reviews/hooks/useReviews.ts
import { useState, useEffect } from 'react';
import { Review } from '../types';
import { reviewService } from '../services/reviewService';

export const useReviews = (providerId?: number) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!providerId) {
      setIsLoading(false);
      return;
    }

    const fetchReviews = async () => {
      try {
        setIsLoading(true);
        const data = await reviewService.getReviewsByProvider(providerId);
        setReviews(data);
        setError(null);
      } catch (err) {
        console.error('Error al cargar opiniones:', err);
        setError('No se pudieron cargar las opiniones');
        setReviews([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [providerId]);

  return { reviews, isLoading, error };
};