// src/features/reviews/pages/MyReviewsPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/context/AuthContext';
import { reviewService } from '../services/reviewService';
import ReviewCard from '../components/ReviewCard';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import { Review } from '../types';

const MyReviewsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchMyReviews = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        let reviewsData: Review[] = [];
        
        if (user.role === 'client') {
          // Para clientes: obtener reviews que han dejado
          reviewsData = await reviewService.getMyReviews();
        } else if (user.role === 'provider') {
          // Para proveedores: obtener reviews que han recibido
          reviewsData = await reviewService.getReviewsForMyProviderProfile();
        }
        
        setReviews(reviewsData);
      } catch (err) {
        console.error('Error al obtener mis reviews:', err);
        setError('No se pudieron cargar tus reseñas');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMyReviews();
  }, [user]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
          <p className="font-medium">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }
  
  // Título y contenido según el rol del usuario
  const title = user?.role === 'client' 
    ? 'Mis Opiniones' 
    : 'Opiniones Recibidas';
    
  const emptyMessage = user?.role === 'client'
    ? 'No has dejado ninguna opinión todavía'
    : 'Aún no has recibido opiniones';
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">{title}</h1>
      
      {reviews.length === 0 ? (
        <div className="bg-blue-50 border border-blue-100 text-blue-700 rounded-lg p-6 text-center">
          <p className="text-lg">{emptyMessage}</p>
          {user?.role === 'client' && (
            <p className="mt-2 text-sm">Contrata un servicio y comparte tu experiencia</p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map(review => (
            <div key={review.id} className="relative">
              <ReviewCard review={review} />
              
              {user?.role === 'client' && (
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button 
                    onClick={() => navigate(`/providers/${review.providerId}`)}
                    className="bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs py-1 px-2 rounded-md transition-colors"
                  >
                    Ver proveedor
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReviewsPage;