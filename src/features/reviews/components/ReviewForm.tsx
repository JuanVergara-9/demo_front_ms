// src/features/reviews/components/ReviewForm.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-hot-toast';
import StarRating from './StarRating';
import { reviewService } from '../services/reviewService';

interface ReviewFormProps {
  providerId: number;
  onSuccess: () => void;
  onCancel?: () => void;
}

const schema = yup.object({
  comment: yup
    .string()
    .required('Por favor escribe tu opinión')
    .min(10, 'La opinión debe tener al menos 10 caracteres'),
}).required();

const ReviewForm: React.FC<ReviewFormProps> = ({ 
  providerId,
  onSuccess,
  onCancel
}) => {
  const [rating, setRating] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });
  
  const onSubmit = async (data: { comment: string }) => {
    if (rating === 0) {
      toast.error('Por favor selecciona una calificación');
      return;
    }
    
    setSubmitting(true);
    try {
      await reviewService.createReview({
        providerId,
        rating,
        comment: data.comment
      });
      
      toast.success('¡Gracias por tu opinión!');
      onSuccess();
    } catch (error) {
      console.error('Error al enviar la opinión:', error);
      toast.error('No se pudo enviar tu opinión. Inténtalo nuevamente.');
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Tu opinión</h3>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Calificación
          </label>
          <div className="mb-1">
            <StarRating 
              rating={rating} 
              onChange={setRating} 
              size="lg" 
            />
          </div>
          {rating === 0 && (
            <p className="text-xs text-gray-500">Selecciona una calificación</p>
          )}
        </div>
        
        <div className="mb-5">
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
            Opinión
          </label>
          <textarea
            id="comment"
            rows={4}
            {...register('comment')}
            placeholder="Comparte tu experiencia con este proveedor..."
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.comment 
                ? 'border-red-300 focus:ring-red-200' 
                : 'border-gray-300 focus:ring-blue-200'
            }`}
          ></textarea>
          {errors.comment && (
            <p className="mt-1 text-sm text-red-600">{errors.comment.message}</p>
          )}
        </div>
        
        <div className="flex justify-end space-x-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={submitting}
            >
              Cancelar
            </button>
          )}
          
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors disabled:opacity-50"
          >
            {submitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Enviando...
              </span>
            ) : 'Enviar opinión'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;