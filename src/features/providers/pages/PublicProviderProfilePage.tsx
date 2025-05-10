// src/features/providers/pages/PublicProviderProfilePage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Provider } from '../types';
import ProviderProfileDetails from '../components/ProviderProfileDetails';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import { useCategoriesData } from '../../categories/hooks/useCategoriesData';
import ContactModal from '../../../features/contact/components/ContactModal';


const PublicProviderProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [provider, setProvider] = useState<Provider | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  
  // Usar el hook para cargar categorías y subcategorías
  const { categories, subcategories, isLoading: categoriesLoading } = useCategoriesData();

useEffect(() => {
  const fetchProvider = async () => {
    setIsLoading(true);
    try {
      // CORREGIDO: Asegurar que el ID es solo el número, sin caracteres extraños
      const providerIdClean = id ? id.toString().replace(/\D/g, '') : '';
      
      // CORREGIDO: URL de la API correcta
      const response = await axios.get(`http://localhost:3000/api/providers/${providerIdClean}`);
      
      console.log("Respuesta del servidor:", response.data);
      setProvider(response.data);
      setError(null);
    } catch (err) {
      console.error("Error al cargar datos del proveedor:", err);
      setError("No se pudo cargar el perfil del proveedor");
      setProvider(null);
    } finally {
      setIsLoading(false);
    }
  };

  if (id) {
    fetchProvider();
  }
}, [id]);

  // Manejar estados de carga y error
  if (isLoading || categoriesLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !provider) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-sm mb-6">
          <p className="font-medium">No se pudo cargar el perfil</p>
          <p>{error || "Proveedor no encontrado"}</p>
          <Link to="/" className="mt-2 inline-block text-blue-600 hover:underline">
            Volver a la página principal
          </Link>
        </div>
      </div>
    );
  }

  // Crear un objeto Provider completo con todas las propiedades requeridas
  const processedProvider: Provider = {
    // Propiedades básicas
    id: provider.id,
    userId: provider.userId || provider.user_id || 0,
    firstName: provider.firstName || provider.first_name || '',
    lastName: provider.lastName || provider.last_name || '',
    phone: provider.phone || '',
    birthdate: provider.birthdate || provider.birth_date || '',
    province: provider.province || '',
    city: provider.city || '',
    address: provider.address || '',
    description: provider.description || '',
    profilePicture: provider.profilePicture || provider.profile_picture || null,
    dniCuit: provider.dniCuit || provider.dni_cuit || '',
    certificate: provider.certificate || null,
    portfolio: provider.portfolio || null,
    createdAt: provider.createdAt || provider.created_at || new Date().toISOString(),
    updatedAt: provider.updatedAt || provider.updated_at || new Date().toISOString(),
    
    // Propiedades calculadas
    rating: provider.rating || provider.average_rating || 0,
    reviewCount: provider.reviewCount || provider.total_reviews || 0,
    averageRating: provider.averageRating || provider.average_rating || 0,
    totalReviews: provider.totalReviews || provider.total_reviews || 0,
    
    // Propiedades de usuario
    user: provider.user || { 
      name: `${provider.firstName || provider.first_name || ''} ${provider.lastName || provider.last_name || ''}`.trim(),
      email: ''
    },
    
    // Mapeo de categorías
    categories: Array.isArray(provider.categories) 
      ? provider.categories.map(cat => {
          if (typeof cat === 'object' && cat !== null) return cat;
          const foundCategory = categories.find(c => Number(c.id) === Number(cat));
          return foundCategory || { id: Number(cat), name: `Categoría ${cat}` };
        })
      : [],
      
    // Mapeo de subcategorías
    subcategories: Array.isArray(provider.subcategories) 
      ? provider.subcategories.map(sub => {
          if (typeof sub === 'object' && sub !== null) return sub;
          const foundSubcategory = subcategories.find(s => Number(s.id) === Number(sub));
          return foundSubcategory || { 
            id: Number(sub), 
            name: `Subcategoría ${sub}`, 
            categoryId: 0 
          };
        })
      : []
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link to="/" className="text-blue-600 hover:underline flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Volver
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Perfil (columna principal) */}
        <div className="lg:col-span-2">
          <ProviderProfileDetails 
            provider={processedProvider}
            onContactClick={() => setShowContactModal(true)}
          />
        </div>
        
        {/* Columna lateral - SOLO CON RESEÑAS */}
        <div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold mb-4">Reseñas</h3>
            <p className="mb-4 text-gray-700">
              Ver opiniones de clientes que han contratado a {processedProvider.firstName}.
            </p>
            <Link 
              to={`/providers/${id}/reviews`}
              className="block w-full py-3 text-center bg-blue-500 hover:bg-blue-600 text-white font-medium rounded transition-colors"
            >
              Ver todas las reseñas
            </Link>
          </div>
        </div>
      </div>
      
      {/* Modal de contacto centralizado */}
      {showContactModal && (
        <ContactModal 
          provider={processedProvider}
          onClose={() => setShowContactModal(false)}
        />
      )}
    </div>
  );
};

export default PublicProviderProfilePage;