// src/features/reviews/components/StarRating.tsx
import React from 'react';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  readOnly?: boolean;
  onChange?: (rating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ 
  rating, 
  maxRating = 5,
  size = 'md',
  readOnly = false,
  onChange
}) => {
  const stars = Array.from({ length: maxRating }, (_, i) => i + 1);
  
  // Determinar tamaño de las estrellas
  const starSize = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }[size];
  
  return (
    <div className="flex">
      {stars.map(star => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          className={`${readOnly ? 'cursor-default' : 'cursor-pointer'} focus:outline-none`}
          onClick={() => !readOnly && onChange?.(star)}
          aria-label={`${star} ${star === 1 ? 'estrella' : 'estrellas'}`}
        >
          <svg 
            className={`${starSize} ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            } ${!readOnly && 'hover:text-yellow-300'} transition-colors`}
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="0"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
          </svg>
        </button>
      ))}
    </div>
  );
};

export default StarRating;