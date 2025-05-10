import React from 'react';
import { FaStar, FaMapMarkerAlt, FaPhone, FaEnvelope, FaCalendarAlt, FaEdit } from 'react-icons/fa';
import { Provider } from '../types';
import { getImageUrl, getInitials } from '../../../utils/imageUtils';

// Actualizamos la interfaz para incluir onContactClick
interface ProviderProfileDetailsProps {
  provider: Provider;
  onEditClick?: () => void; 
  onContactClick?: () => void; // Nueva prop para manejar el contacto externamente
}

const ProviderProfileDetails: React.FC<ProviderProfileDetailsProps> = ({ 
  provider, 
  onEditClick,
  onContactClick 
}) => {
  // Eliminamos el estado local del modal
  // const [showContactModal, setShowContactModal] = useState(false);

  const renderStars = (rating: number = 0) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            className={star <= Math.round(rating) ? "text-yellow-400" : "text-gray-300"}
            size={18}
          />
        ))}
        <span className="ml-2 font-medium text-sm">
          {rating.toFixed(1)} ({provider.reviewCount || provider.totalReviews || 0} reseñas)
        </span>
      </div>
    );
  };

  // Función para obtener el nombre de la categoría
  const getCategoryName = (category: any) => {
    if (typeof category === 'object' && category !== null && category.name) {
      return category.name;
    }
    return typeof category === 'string' ? category : 'Profesional';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex flex-col sm:flex-row items-center sm:items-start">
        <div className="relative mb-6 sm:mb-0 sm:mr-8">
          {/* Imagen de perfil actualizada con getImageUrl */}
          <div className="w-32 h-32 overflow-hidden rounded-full bg-gray-100 border-4 border-blue-100">
            {provider.profilePicture ? (
              <img
                src={getImageUrl(provider.profilePicture)}
                alt={`${provider.firstName} ${provider.lastName}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (target.parentElement) {
                    const initialsDiv = document.createElement('div');
                    initialsDiv.className = 'w-full h-full flex items-center justify-center bg-blue-100 text-blue-500 text-3xl font-bold';
                    initialsDiv.innerText = getInitials(provider.firstName, provider.lastName);
                    target.parentElement.replaceChild(initialsDiv, target);
                  } else {
                    target.src = "/assets/default-profile.jpg";
                  }
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-500 text-3xl font-bold">
                {getInitials(provider.firstName, provider.lastName)}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-2xl font-bold text-gray-800">
            {provider.firstName} {provider.lastName}
          </h1>
          
          {/* Categoría y Subcategoría */}
          <div className="mb-2">
            {/* Mostrar categoría principal */}
            {provider.categories && provider.categories.length > 0 && (
              <p className="text-lg text-blue-600 font-medium">
                {getCategoryName(provider.categories[0])}
              </p>
            )}
            
            {/* Mostrar subcategoría si existe */}
            {provider.subcategories && provider.subcategories.length > 0 && (
              <p className="text-md text-blue-500">
                Especialidad: {getCategoryName(provider.subcategories[0])}
              </p>
            )}
          </div>
          
          {/* Rating */}
          <div className="mb-3">
            {renderStars(provider.rating || provider.averageRating || 0)}
          </div>
          
          {/* Ubicación */}
          {(provider.city || provider.province) && (
            <div className="flex items-center text-gray-600 mb-2 justify-center sm:justify-start">
              <FaMapMarkerAlt className="mr-2 text-gray-500" />
              <span>{[provider.city, provider.province].filter(Boolean).join(', ')}</span>
            </div>
          )}
          
          {/* Teléfono */}
          {provider.phone && (
            <div className="flex items-center text-gray-600 mb-2 justify-center sm:justify-start">
              <FaPhone className="mr-2 text-gray-500" />
              <span>{provider.phone}</span>
            </div>
          )}
          
          {/* Email - Modificado para usar user.email en lugar de email directo */}
          {provider.user?.email && (
            <div className="flex items-center text-gray-600 mb-2 justify-center sm:justify-start">
              <FaEnvelope className="mr-2 text-gray-500" />
              <span>{provider.user.email}</span>
            </div>
          )}
          
          {/* Miembro desde */}
          {provider.createdAt && (
            <div className="flex items-center text-gray-500 text-sm mt-4 justify-center sm:justify-start">
              <FaCalendarAlt className="mr-2" />
              <span>Miembro desde {new Date(provider.createdAt).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Descripción */}
      {provider.description && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">Acerca de</h2>
          <p className="text-gray-700 whitespace-pre-line">{provider.description}</p>
        </div>
      )}
      
      {/* Botones de acción */}
      <div className="mt-8 flex flex-wrap gap-3">
        {/* Botón de edición (solo se muestra si se proporciona onEditClick) */}
        {onEditClick && (
          <button 
            onClick={onEditClick} 
            className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg flex items-center"
          >
            <FaEdit className="mr-2" />
            Editar Perfil
          </button>
        )}
        
        {/* Botón de contactar - AHORA CONDICIONADO a que exista onContactClick */}
        {onContactClick && (
          <button 
            onClick={onContactClick}
            className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg"
          >
            Contactar
          </button>
        )}
      </div>
      
      {/* Ya no renderizamos el modal aquí */}
    </div>
  );
};

export default ProviderProfileDetails;