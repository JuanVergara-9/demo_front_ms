import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaStar, FaMapMarkerAlt, FaPhone, FaEnvelope, FaCalendarAlt } from 'react-icons/fa';
import apiClient from '../../../api/apiClient';
import { Provider } from '../types';
import ContactModal from '../../../features/contact/components/ContactModal';

const PublicProviderProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [provider, setProvider] = useState<Provider | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  useEffect(() => {
    const fetchProvider = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get(`/providers/${id}`);
        setProvider(response.data);
        setError(null);
      } catch (err) {
        console.error("Error al cargar datos del proveedor:", err);
        setError("No se pudo cargar la información del proveedor");
        setProvider(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProvider();
  }, [id]);

  // Renderizar estrellas basadas en rating
  const renderStars = (rating: number = 0) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar 
            key={star}
            className={star <= Math.round(rating) ? "text-yellow-400" : "text-gray-300"} 
            size={18}
          />
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !provider) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <p>{error || "No se encontró el perfil del proveedor"}</p>
          <Link to="/" className="text-blue-500 hover:underline mt-2 inline-block">
            Volver a la página principal
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          {/* Header - Info básica del proveedor */}
          <div className="flex flex-col md:flex-row items-start md:items-center mb-6">
            <div className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden mr-6 flex-shrink-0">
              {provider.profilePicture ? (
                <img 
                  src={provider.profilePicture} 
                  alt={`${provider.firstName} ${provider.lastName}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600 text-2xl font-bold">
                  {provider.firstName.charAt(0)}{provider.lastName.charAt(0)}
                </div>
              )}
            </div>
            <div className="mt-4 md:mt-0">
              <h1 className="text-2xl font-bold">{provider.firstName} {provider.lastName}</h1>
              <p className="text-gray-600 text-lg">{provider.profession || "Profesional de servicios"}</p>
              
              <div className="flex items-center mt-2">
                {renderStars(provider.averageRating)}
                <span className="text-gray-600 ml-2">
                  ({provider.averageRating?.toFixed(1) || "0.0"}) · {provider.totalReviews || 0} reseñas
                </span>
              </div>
              
              <div className="flex items-center mt-2 text-gray-600">
                <FaMapMarkerAlt className="mr-2" />
                <span>{provider.city}, {provider.province}</span>
              </div>
              
              <button
                onClick={() => setIsContactModalOpen(true)}
                className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center justify-center transition-colors"
              >
                <FaPhone className="mr-2" /> Contactar
              </button>
            </div>
          </div>
          
          <hr className="my-6" />
          
          {/* Descripción y detalles */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Acerca de</h2>
            <p className="text-gray-700 mb-4">{provider.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="flex items-center text-gray-600">
                <FaPhone className="mr-3 text-blue-500" />
                <span>{provider.phone}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <FaEnvelope className="mr-3 text-blue-500" />
                <span>{provider.email}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <FaCalendarAlt className="mr-3 text-blue-500" />
                <span>Miembro desde {new Date(provider.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          
          <hr className="my-6" />
          
          {/* Reseñas */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Reseñas</h2>
              <Link 
                to={`/providers/${provider.id}/reviews`}
                className="text-blue-500 hover:underline"
              >
                Ver todas
              </Link>
            </div>
            
            {provider.totalReviews ? (
              <p className="text-gray-600">Este proveedor tiene {provider.totalReviews} reseñas</p>
            ) : (
              <p className="text-gray-600">Este proveedor aún no tiene reseñas</p>
            )}
            
            {/* Botón para escribir reseña */}
            <Link
              to={`/providers/${provider.id}/reviews/new`}
              className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Escribir reseña
            </Link>
          </div>
          
          {/* Botón de volver */}
          <div className="mt-8">
            <Link
              to="/"
              className="text-blue-500 hover:underline flex items-center"
            >
              &larr; Volver a la página principal
            </Link>
          </div>
          
          {/* Modal de Contacto */}
          {isContactModalOpen && provider && (
            <ContactModal 
              provider={provider}
              onClose={() => setIsContactModalOpen(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicProviderProfilePage;