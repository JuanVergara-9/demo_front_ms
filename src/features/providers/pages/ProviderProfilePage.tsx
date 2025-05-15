// src/features/providers/pages/ProviderProfilePage.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProviderProfile } from '../hooks/useProviderProfile';
import { useAuth } from '../../auth/context/AuthContext';
import ProviderProfileDetails from '../components/ProviderProfileDetails';
import ProviderProfileEdit from '../components/ProviderProfileEdit';
import ProviderRecentReviews from '../components/ProviderRecentReviews';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import { Provider } from '../types';
// Importamos el nuevo hook
import { useCategoriesData } from '../../categories/hooks/useCategoriesData';

const ProviderProfilePage: React.FC = () => {
  const { logout } = useAuth();
  const [isEditMode, setIsEditMode] = useState(false);
  const { provider: rawProvider, isLoading, error, refreshProfile } = useProviderProfile();
  
  // Usar el hook para cargar categorías y subcategorías
  const { categories, subcategories, isLoading: categoriesLoading } = useCategoriesData();

  // Manejar estados de carga y error (igual que antes)
  if (isLoading || categoriesLoading) {
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
        <button 
          className="mt-2 bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded text-sm transition-colors"
          onClick={refreshProfile}
        >
          Reintentar
        </button>
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

  // Adaptación de datos MEJORADA con nombres reales de categorías
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

    // Añadido: email y profession
    email: rawProvider.email || (rawProvider.user && rawProvider.user.email) || '',
    profession: rawProvider.profession || '',

    // Mapeo mejorado de categorías
    categories: Array.isArray(rawProvider.categories) 
      ? rawProvider.categories.map(cat => {
          if (typeof cat === 'object') return cat;
          // Convertir ambos a número para comparación
          const foundCategory = categories.find(c => Number(c.id) === Number(cat));
          return foundCategory || { id: cat, name: `Categoría ${cat}` };
        })
      : [],

    // Mapeo mejorado de subcategorías
    subcategories: Array.isArray(rawProvider.subcategories) 
      ? rawProvider.subcategories.map(sub => {
          if (typeof sub === 'object') return { ...sub, categoryId: sub.categoryId || 0 };
          // Convertir ambos a número para comparación
          const foundSubcategory = subcategories.find(s => Number(s.id) === Number(sub));
          return foundSubcategory || { id: sub, name: `Subcategoría ${sub}`, categoryId: 0 };
        }) 
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
      {/* Encabezado con navegación al dashboard y botón de cerrar sesión */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Mi Perfil Profesional</h1>
        
        <div className="flex flex-wrap gap-3">
          <Link 
            to="/provider/dashboard" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Ver Panel de Control
          </Link>
          
          <button 
            onClick={() => {
              if (window.confirm('¿Estás seguro que deseas cerrar sesión?')) {
                logout();
              }
            }}
            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" />
            </svg>
            Cerrar sesión
          </button>
        </div>
      </div>
      
      {/* Contenido principal */}
      {isEditMode ? (
        <ProviderProfileEdit 
          provider={provider} 
          onCancel={() => setIsEditMode(false)} 
          onSave={() => {
            setIsEditMode(false);
            refreshProfile();
          }} 
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Perfil (columna principal) */}
          <div className="lg:col-span-2">
            <ProviderProfileDetails 
              provider={provider} 
              onEditClick={() => setIsEditMode(true)}
            />
          </div>
          
          {/* Reseñas (columna lateral) */}
          <div>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="bg-blue-50 px-4 py-3 border-b border-blue-100 rounded-t-lg">
                <h3 className="text-lg font-semibold text-blue-800">Últimas Reseñas</h3>
              </div>
              <div className="p-5">
                <ProviderRecentReviews providerId={provider.id} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderProfilePage;