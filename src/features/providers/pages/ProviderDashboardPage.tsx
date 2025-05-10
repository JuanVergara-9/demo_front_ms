// src/features/providers/pages/ProviderDashboardPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useProviderProfile } from '../hooks/useProviderProfile';
import ProviderStatsSummary from '../components/ProviderStatsSummary';
import ProviderRecentReviews from '../components/ProviderRecentReviews';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import { Provider } from '../types';
import { getImageUrl, getInitials } from '../../../utils/imageUtils';

const ProviderDashboardPage: React.FC = () => {
  const { provider: rawProvider, isLoading, error } = useProviderProfile();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-sm mb-6">
        <p className="font-medium">Ha ocurrido un error</p>
        <p>{error}</p>
      </div>
    );
  }

  if (!rawProvider) {
    return (
      <div className="bg-amber-100 border-l-4 border-amber-500 text-amber-700 p-4 rounded shadow-sm">
        <p className="font-medium">No se encontró información de proveedor</p>
        <p>Completa tu perfil para activar tu cuenta de proveedor.</p>
      </div>
    );
  }

  // Adaptar los datos del backend al formato del frontend
  const provider: Provider = {
    id: rawProvider.id,
    userId: rawProvider.userId || rawProvider.user_id || 0,
    firstName: rawProvider.firstName || rawProvider.first_name || '',
    lastName: rawProvider.lastName || rawProvider.last_name || '',
    phone: rawProvider.phone || '',
    birthdate: rawProvider.birthdate || rawProvider.birth_date || '',
    province: rawProvider.province || '',
    city: rawProvider.city || '',
    address: rawProvider.address || '',
    description: rawProvider.description || '',
    dniCuit: rawProvider.dniCuit || rawProvider.dni_cuit || '',
    categories: Array.isArray(rawProvider.categories) 
      ? rawProvider.categories.map(cat => typeof cat === 'object' ? cat : { id: cat, name: `Categoría ${cat}` })
      : [],
    subcategories: Array.isArray(rawProvider.subcategories) 
      ? rawProvider.subcategories.map(sub => 
          typeof sub === 'object' 
            ? sub 
            : { id: sub, name: `Subcategoría ${sub}`, categoryId: 0 }
        ) 
      : [],
    profilePicture: rawProvider.profilePicture || rawProvider.profile_picture || '',
    certificate: rawProvider.certificate || null,
    portfolio: rawProvider.portfolio || null,
    createdAt: rawProvider.createdAt || rawProvider.created_at || '',
    updatedAt: rawProvider.updatedAt || rawProvider.updated_at || '',
    averageRating: rawProvider.averageRating || rawProvider.average_rating || 0,
    totalReviews: rawProvider.totalReviews || rawProvider.total_reviews || 0,
    user: rawProvider.user || undefined
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      {/* Encabezado con navegación al perfil */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <div className="mr-4">
            {provider.profilePicture ? (
              <img 
                src={getImageUrl(provider.profilePicture)} 
                alt={`${provider.firstName} ${provider.lastName}`} 
                className="h-16 w-16 rounded-full object-cover border-2 border-blue-500"
                onError={(e) => {
                  // Si la imagen falla, mostrar iniciales
                  const target = e.target as HTMLImageElement;
                  if (target.parentElement) {
                    // Crear un div para las iniciales
                    const initialsDiv = document.createElement('div');
                    initialsDiv.className = 'h-16 w-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-semibold';
                    initialsDiv.innerText = getInitials(provider.firstName, provider.lastName);
                    
                    // Reemplazar la imagen con el div
                    target.parentElement.replaceChild(initialsDiv, target);
                  } else {
                    // Fallback a imagen predeterminada
                    target.src = "/assets/default-profile.jpg";
                  }
                }}
              />
            ) : (
              <div className="h-16 w-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-semibold">
                {getInitials(provider.firstName, provider.lastName)}
              </div>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Panel de Control</h1>
            <p className="text-gray-600">Bienvenido, {provider.firstName} {provider.lastName}</p>
          </div>
        </div>
        
        <Link 
          to="/provider/profile" 
          className="inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
          Ver Mi Perfil
        </Link>
      </div>

      {/* Resumen de Actividad */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="bg-blue-50 px-4 py-3 border-b border-blue-100 rounded-t-lg">
          <h2 className="text-lg font-semibold text-blue-800">Resumen de Actividad</h2>
        </div>
        <div className="p-5">
          <ProviderStatsSummary providerId={provider.id} />
        </div>
      </div>
      
      {/* Secciones operativas - Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Solicitudes Pendientes */}
        <div className="bg-white rounded-lg shadow lg:col-span-2">
          <div className="bg-blue-50 px-4 py-3 border-b border-blue-100 rounded-t-lg flex justify-between items-center">
            <h2 className="text-lg font-semibold text-blue-800">Solicitudes Pendientes</h2>
            <span className="bg-blue-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full">0 nuevas</span>
          </div>
          <div className="p-5">
            <div className="text-center py-8 text-gray-500 italic">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>No tienes solicitudes pendientes por atender.</p>
              <p className="mt-2 text-sm">Las solicitudes de clientes aparecerán aquí cuando alguien requiera tus servicios.</p>
            </div>
          </div>
        </div>

        {/* Notificaciones */}
        <div className="bg-white rounded-lg shadow">
          <div className="bg-blue-50 px-4 py-3 border-b border-blue-100 rounded-t-lg flex justify-between items-center">
            <h2 className="text-lg font-semibold text-blue-800">Notificaciones</h2>
            <span className="bg-blue-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full">2 nuevas</span>
          </div>
          <div className="p-5">
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 bg-blue-50 p-3 rounded">
                <p className="text-sm text-blue-800 font-medium">¡Perfil completado con éxito!</p>
                <p className="text-xs text-blue-600 mt-1">Hace 2 días</p>
              </div>
              <div className="border-l-4 border-green-500 bg-green-50 p-3 rounded">
                <p className="text-sm text-green-800 font-medium">Bienvenido a miservicio</p>
                <p className="text-xs text-green-600 mt-1">Hace 3 días</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Últimas Reseñas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="bg-blue-50 px-4 py-3 border-b border-blue-100 rounded-t-lg">
            <h2 className="text-lg font-semibold text-blue-800">Últimas Reseñas</h2>
          </div>
          <div className="p-5">
            <ProviderRecentReviews providerId={provider.id} />
          </div>
        </div>
        
        {/* Consejos para mejorar tu perfil */}
        <div className="bg-white rounded-lg shadow">
          <div className="bg-blue-50 px-4 py-3 border-b border-blue-100 rounded-t-lg">
            <h2 className="text-lg font-semibold text-blue-800">Consejos para mejorar</h2>
          </div>
          <div className="p-5">
            <ul className="space-y-3">
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">Comparte tu perfil en redes sociales para ganar visibilidad</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">Mantén tu información de contacto actualizada</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">Agrega fotos de tus trabajos para generar confianza</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">Responde rápidamente a las solicitudes de clientes</span>
              </li>
            </ul>
            
            <div className="mt-4 border-t border-gray-100 pt-4">
              <a href="#" className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center transition-colors">
                Ver guía completa
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboardPage;