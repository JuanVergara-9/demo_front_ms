// src/features/providers/components/ProviderReviews.tsx
import React, { useEffect, useState } from 'react';
import { reviewService } from '../../reviews/services/reviewService';
import { ProviderReview, RatingSummary } from '../types';
import ReviewForm from '../../reviews/components/ReviewForm';
import ReviewItem from '../../reviews/components/ReviewItem';
import { useAuth } from '../../../hooks/useAuth';
import LoadingSpinner from '../../../components/common/LoadingSpinner';

interface ProviderReviewsProps {
  providerId: number;
}

const ProviderReviews: React.FC<ProviderReviewsProps> = ({ providerId }) => {
  const [reviews, setReviews] = useState<ProviderReview[]>([]);
  const [summary, setSummary] = useState<RatingSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState<ProviderReview | null>(null);
  const [userReview, setUserReview] = useState<ProviderReview | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const limit = 5;
  
  const { isAuthenticated, user } = useAuth();
  
  // Cargar reseñas iniciales
  useEffect(() => {
    const loadReviews = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const [reviewsData, summaryData] = await Promise.all([
          reviewService.getByProvider(providerId, { limit, offset: 0 }),
          reviewService.getSummary(providerId)
        ]);
        
        setReviews(reviewsData);
        setSummary(summaryData);
        setOffset(reviewsData.length);
        setHasMore(reviewsData.length === limit);
        
        // Verificar si el usuario actual ya ha dejado una reseña
        if (isAuthenticated) {
          const { hasReviewed, review } = await reviewService.checkUserReviewedProvider(providerId);
          if (hasReviewed && review) {
            setUserReview(review);
          }
        }
      } catch (err) {
        setError('Error al cargar reseñas');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadReviews();
  }, [providerId, isAuthenticated]);
  
  // Cargar más reseñas
  const loadMoreReviews = async () => {
    if (!hasMore) return;
    
    try {
      const newReviews = await reviewService.getByProvider(providerId, {
        limit,
        offset
      });
      
      if (newReviews.length > 0) {
        setReviews(prev => [...prev, ...newReviews]);
        setOffset(offset + newReviews.length);
        setHasMore(newReviews.length === limit);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error al cargar más reseñas:', err);
    }
  };
  
  // Manejar envío exitoso de una reseña
  const handleReviewSuccess = async () => {
    setShowReviewForm(false);
    setEditingReview(null);
    
    // Recargar datos
    try {
      const [newReviews, newSummary] = await Promise.all([
        reviewService.getByProvider(providerId, { limit, offset: 0 }),
        reviewService.getSummary(providerId)
      ]);
      
      setReviews(newReviews);
      setSummary(newSummary);
      setOffset(newReviews.length);
      
      // Actualizar la reseña del usuario
      const { hasReviewed, review } = await reviewService.checkUserReviewedProvider(providerId);
      setUserReview(hasReviewed ? review ?? null : null);
    } catch (err) {
      console.error('Error al actualizar datos después de enviar reseña:', err);
    }
  };
  
  // Manejar eliminación de una reseña
  const handleDeleteReview = async (reviewId: number) => {
    try {
      await reviewService.deleteReview(reviewId);
      
      // Si era la reseña del usuario actual, limpiar ese estado
      if (userReview?.id === reviewId) {
        setUserReview(null);
      }
      
      // Filtrar la reseña eliminada de la lista
      setReviews(prev => prev.filter(review => review.id !== reviewId));
      
      // Actualizar el resumen
      const newSummary = await reviewService.getSummary(providerId);
      setSummary(newSummary);
    } catch (err) {
      console.error('Error al eliminar reseña:', err);
      alert('No se pudo eliminar la reseña. Por favor, intenta nuevamente.');
    }
  };
  
  // Manejar edición de una reseña
  const handleEditReview = (review: ProviderReview) => {
    setEditingReview(review);
    setShowReviewForm(true);
  };
  
  if (isLoading && reviews.length === 0) {
    return <LoadingSpinner />;
  }
  
  if (error && reviews.length === 0) {
    return <div className="alert alert-danger">{error}</div>;
  }
  
  return (
    <div className="provider-reviews">
      {/* Resumen de calificaciones */}
      {summary && (
        <div className="rating-summary card mb-4">
          <div className="card-body">
            <div className="row align-items-center">
              <div className="col-md-4 text-center">
                <div className="average-rating">
                  <div className="rating-value">{summary.averageRating.toFixed(1)}</div>
                  <div className="rating-stars">
                    {[...Array(5)].map((_, i) => (
                      <span 
                        key={i} 
                        className={`star ${i < Math.round(summary.averageRating) ? 'filled' : ''}`}
                      >★</span>
                    ))}
                  </div>
                  <div className="total-reviews">
                    {summary.totalReviews} {summary.totalReviews === 1 ? 'reseña' : 'reseñas'}
                  </div>
                </div>
              </div>
              <div className="col-md-8">
                <div className="rating-distribution">
                  {[5, 4, 3, 2, 1].map(rating => (
                    <div key={rating} className="rating-bar d-flex align-items-center mb-2">
                      <div className="rating-label me-2">{rating} ★</div>
                      <div className="progress flex-grow-1 custom-progress-bar" style={{ height: '8px' }}>
                        <div 
                          className="progress-bar" 
                          role="progressbar" 
                          style={{ 
                            width: summary.totalReviews 
                              ? `${(summary.distribution[rating] || 0) / summary.totalReviews * 100}%`
                              : '0%'
                          }}
                          title={`Rating ${rating}: ${(summary.distribution[rating] || 0)} reseñas`}
                          aria-valuenow={Number(summary.distribution[rating] || 0)} 
                          aria-valuemin={0}
                          aria-valuemax={Number(summary.totalReviews)}
                        ></div>
                      </div>
                      <div className="rating-count ms-2">
                        {summary.distribution[rating] || 0}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Botón para dejar reseña o editar */}
      {isAuthenticated && !showReviewForm && (
        <div className="mb-4">
          {!userReview ? (
            <button 
              className="btn btn-primary" 
              onClick={() => setShowReviewForm(true)}
            >
              Escribir una reseña
            </button>
          ) : (
            <div className="alert alert-info">
              <div className="d-flex justify-content-between align-items-center">
                <div>Ya has dejado una reseña para este proveedor.</div>
                <div>
                  <button 
                    className="btn btn-sm btn-outline-primary me-2" 
                    onClick={() => handleEditReview(userReview)}
                  >
                    Editar mi reseña
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Formulario de reseña */}
      {showReviewForm && (
        <ReviewForm
          providerId={providerId}
          existingReview={editingReview || undefined}
          onSuccess={handleReviewSuccess}
          onCancel={() => {
            setShowReviewForm(false);
            setEditingReview(null);
          }}
        />
      )}
      
      {/* Tu reseña (si existe) */}
      {userReview && !showReviewForm && (
        <div className="mb-4">
          <h5 className="mb-3">Tu reseña</h5>
          <ReviewItem 
            review={userReview}
            onEdit={handleEditReview}
            onDelete={handleDeleteReview}
          />
        </div>
      )}
      
      {/* Reseñas de otros usuarios */}
      <div>
        <h5 className="mb-3">
          {reviews.length > 0 
            ? 'Reseñas de clientes' 
            : 'Este proveedor aún no tiene reseñas'}
        </h5>
        
        {reviews
          .filter(review => !userReview || review.id !== userReview.id)
          .map(review => (
            <ReviewItem 
              key={review.id} 
              review={review}
              onDelete={user?.id === review.userId ? handleDeleteReview : undefined}
              onEdit={user?.id === review.userId ? handleEditReview : undefined}
            />
          ))
        }
        
        {/* Botón para cargar más */}
        {hasMore && reviews.length > 0 && (
          <div className="text-center mt-4">
            <button 
              className="btn btn-outline-primary" 
              onClick={loadMoreReviews}
            >
              Cargar más reseñas
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderReviews;