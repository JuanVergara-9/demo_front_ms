// src/features/reviews/pages/ReviewsPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../auth/context/AuthContext';
import { reviewService } from '../services/reviewService';
import { providerService } from '../../providers/services/providerService';
import { Review } from '../types';
import { Provider } from '../../providers/types';

// Componentes
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import ReviewList from '../components/ReviewList';
import ReviewForm from '../components/ReviewForm';
import StarRating from '../components/StarRating';

const ReviewsPage: React.FC = () => {
  const { providerId } = useParams<{ providerId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [provider, setProvider] = useState<Provider | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  
  // Determinar si el usuario puede dejar una review
  const canAddReview = !!user && user.role === 'client' && !reviews.some(r => r.userId === user.id);
  
  // Cargar datos del proveedor y sus reviews
  useEffect(() => {
    const fetchData = async () => {
      if (!providerId) {
        setError("ID de proveedor no especificado");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // Cargar en paralelo el proveedor y sus reviews
        const [providerData, reviewsData] = await Promise.all([
          providerService.getProviderById(Number(providerId)),
          reviewService.getReviewsByProvider(Number(providerId))
        ]);
        
        setProvider(providerData);
        setReviews(reviewsData);
      } catch (err) {
        console.error("Error cargando datos:", err);
        setError("No se pudieron cargar los datos. Por favor, intenta nuevamente.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [providerId]);
  
  // Manejar la adición de una nueva review
  const handleReviewSuccess = async () => {
    try {
      setShowReviewForm(false);
      toast.success("¡Gracias por tu opinión!");
      
      // Recargar las reviews
      const updatedReviews = await reviewService.getReviewsByProvider(Number(providerId));
      setReviews(updatedReviews);
    } catch (err) {
      console.error("Error actualizando reviews:", err);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !provider) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold mb-2">Error</h2>
          <p>{error || "No se pudo encontrar el proveedor solicitado"}</p>
          <button 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={() => navigate(-1)}
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header con info del proveedor */}
      <div className="mb-8">
        <button 
          onClick={() => navigate(`/providers/${providerId}`)} 
          className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver al perfil
        </button>
        
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xl font-bold">
            {provider.firstName?.charAt(0)}{provider.lastName?.charAt(0)}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Opiniones sobre {provider.firstName} {provider.lastName}
            </h1>
            <div className="flex items-center mt-1">
              <div className="flex items-center">
                <StarRating 
                  rating={reviews.length ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length : 0} 
                  readOnly 
                  size="sm"
                />
                <span className="ml-2 text-sm text-gray-600">
                  ({reviews.length} {reviews.length === 1 ? 'opinión' : 'opiniones'})
                </span>
              </div>
            </div>
          </div>
          
          {canAddReview && !showReviewForm && (
            <button
              onClick={() => setShowReviewForm(true)}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              Escribir opinión
            </button>
          )}
        </div>
      </div>
      
      {/* Formulario de Review (condicional) */}
      {showReviewForm && (
        <div className="mb-10">
          <ReviewForm 
            providerId={Number(providerId)} 
            onSuccess={handleReviewSuccess}
            onCancel={() => setShowReviewForm(false)}
          />
        </div>
      )}
      
      {/* Lista de Reviews */}
      <ReviewList 
        reviews={reviews} 
        providerId={Number(providerId)}
        canAddReview={canAddReview && !showReviewForm} 
      />
      
      {reviews.length === 0 && !showReviewForm && (
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-8 text-center">
          <h3 className="text-lg font-medium text-blue-800 mb-2">Sin opiniones aún</h3>
          <p className="text-blue-700 mb-4">Este proveedor todavía no tiene opiniones.</p>
          
          {canAddReview && (
            <button
              onClick={() => setShowReviewForm(true)}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              Sé el primero en opinar
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewsPage;