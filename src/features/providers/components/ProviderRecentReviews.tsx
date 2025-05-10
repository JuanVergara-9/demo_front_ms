// src/features/providers/components/ProviderRecentReviews.tsx
import React, { useState, useEffect } from 'react';
import { reviewService } from '../../reviews/services/reviewService';
import { ProviderReview } from '../types';
import { Link } from 'react-router-dom';

interface ProviderRecentReviewsProps {
  providerId: number;
  limit?: number;
}

const ProviderRecentReviews: React.FC<ProviderRecentReviewsProps> = ({ 
  providerId, 
  limit = 3 
}) => {
  const [reviews, setReviews] = useState<ProviderReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadReviews = async () => {
      setIsLoading(true);
      try {
        // Corrección: usar getReviewsByProvider en lugar de getByProvider
        const data = await reviewService.getReviewsByProvider(providerId);
        
        // Si necesitas aplicar el límite manualmente:
        const limitedData = limit ? data.slice(0, limit) : data;
        const sanitizedData = limitedData.map(review => ({
          ...review,
          comment: review.comment ?? '', // Ensure comment is a string
        }));
        setReviews(sanitizedData);
      } catch (err) {
        console.error('Error al cargar reseñas:', err);
        setError('Error al cargar reseñas');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadReviews();
  }, [providerId, limit]);

  if (isLoading) {
    return <div className="text-center py-2">Cargando reseñas...</div>;
  }

  // Registrar el error pero no mostrarlo directamente al usuario
  if (error) {
    console.error(error);
  }

  // Mensaje mejorado cuando no hay reseñas (incluso si hay error)
  if (reviews.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="fw-medium fs-6 mb-1">No hay reseñas todavía</p>
        <p className="text-muted small">Cuando tus clientes dejen reseñas, aparecerán aquí</p>
      </div>
    );
  }

  return (
    <div className="recent-reviews">
      {reviews.map(review => (
        <div key={review.id} className="review-item mb-3">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <div className="reviewer-name fw-bold">{review.userName || 'Usuario'}</div>
              <div className="review-date text-muted small">
                {new Date(review.createdAt).toLocaleDateString()}
              </div>
            </div>
            <div className="review-rating">
              {[...Array(5)].map((_, i) => (
                <span 
                  key={i} 
                  className={`star ${i < review.rating ? 'filled' : ''}`}
                >★</span>
              ))}
            </div>
          </div>
          <p className="review-comment mt-1 mb-0 small">
            {review.comment?.length > 100 
              ? `${review.comment.substring(0, 100)}...` 
              : review.comment}
          </p>
          
          <hr className="my-2" />
        </div>
      ))}
      
      <div className="text-center">
        <Link to={`/provider/reviews/${providerId}`} className="btn btn-sm btn-outline-primary">
          Ver todas las reseñas
        </Link>
      </div>
    </div>
  );
};

export default ProviderRecentReviews;