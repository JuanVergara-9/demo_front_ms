// src/features/reviews/components/ReviewList.tsx
import React, { useState } from 'react';
import { Review } from '../types';
import ReviewCard from './ReviewCard';
import ReviewStats from './ReviewStats';

interface ReviewListProps {
  reviews: Review[];
  providerId: number;
  canAddReview: boolean;
}

const ReviewList: React.FC<ReviewListProps> = ({ 
  reviews,
  canAddReview
}) => {
  const [sortBy, setSortBy] = useState<'date' | 'rating'>('date');
  
  // Ordenar reviews
  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else {
      return b.rating - a.rating;
    }
  });
  
  return (
    <div className="space-y-6">
      <ReviewStats reviews={reviews} />
      
      {/* Barra de herramientas */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2">
        <h3 className="text-xl font-semibold text-gray-800">
          {reviews.length} {reviews.length === 1 ? 'Opinión' : 'Opiniones'}
        </h3>
        
        <div className="flex items-center gap-3">
          {/* Selector de ordenamiento */}
          <div className="flex items-center gap-2">
            <label htmlFor="sortBy" className="text-sm text-gray-600">Ordenar por:</label>
            <select
              id="sortBy"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'rating')}
              className="text-sm border border-gray-300 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              <option value="date">Más recientes</option>
              <option value="rating">Mejor calificación</option>
            </select>
          </div>
          
          {/* Botón para añadir reseña */}
          {canAddReview && (
            <button 
              onClick={() => {/* Abrir modal o redirigir */}}
              className="text-sm px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              Escribir opinión
            </button>
          )}
        </div>
      </div>
      
      {/* Lista de reviews */}
      {sortedReviews.length > 0 ? (
        <div>
          {sortedReviews.map(review => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 border border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500">No hay opiniones todavía. ¡Sé el primero en opinar!</p>
        </div>
      )}
    </div>
  );
};

export default ReviewList;