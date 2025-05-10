// src/features/reviews/components/ReviewStats.tsx
import React from 'react';
import { Review } from '../types';
import StarRating from './StarRating';

interface ReviewStatsProps {
  reviews: Review[];
}

const ReviewStats: React.FC<ReviewStatsProps> = ({ reviews }) => {
  // Calcular promedio
  const averageRating = reviews.length 
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length 
    : 0;
  
  // Calcular cantidad por estrella
  const ratingCounts = Array(5).fill(0);
  reviews.forEach(review => {
    ratingCounts[review.rating - 1]++;
  });
  
  // Calcular porcentajes
  const getPercentage = (count: number) => {
    return reviews.length ? Math.round((count / reviews.length) * 100) : 0;
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Promedio general */}
        <div className="flex-1 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-200 pb-4 md:pb-0">
          <h4 className="text-3xl font-bold text-gray-800 mb-2">{averageRating.toFixed(1)}</h4>
          <StarRating rating={averageRating} size="lg" readOnly />
          <p className="mt-2 text-sm text-gray-500">
            Basado en {reviews.length} {reviews.length === 1 ? 'opinión' : 'opiniones'}
          </p>
        </div>
        
        {/* Distribución por estrellas */}
        <div className="flex-1">
          <h4 className="text-sm font-medium text-gray-700 mb-3 md:text-center">Distribución de calificaciones</h4>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map(stars => (
              <div key={stars} className="flex items-center gap-2">
                <div className="flex-shrink-0 w-2">{stars}</div>
                <div className="flex-grow h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-yellow-400 rounded-full"
                    style={{ width: `${getPercentage(ratingCounts[stars - 1])}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 w-8 text-right">
                  {getPercentage(ratingCounts[stars - 1])}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewStats;