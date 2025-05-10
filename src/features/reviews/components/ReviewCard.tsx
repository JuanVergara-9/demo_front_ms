// src/features/reviews/components/ReviewCard.tsx
import React from 'react';
import { Review } from '../types';
import StarRating from './StarRating';

interface ReviewCardProps {
  review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  // Usar la API nativa de JavaScript para formatear la fecha
  const formattedDate = new Date(review.createdAt).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5 mb-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold mr-3">
            {review.userName ? review.userName.charAt(0) : 'U'}
          </div>
          <div>
            <h4 className="font-medium text-gray-800">{review.userName || 'Usuario'}</h4>
            <p className="text-xs text-gray-500">{formattedDate}</p>
          </div>
        </div>
        <StarRating rating={review.rating} size="sm" readOnly />
      </div>
      
      <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>
    </div>
  );
};

export default ReviewCard;