// src/features/auth/pages/BecomeProviderPage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BecomeProviderForm from '../components/BecomeProviderForm/index';

const BecomeProviderPage: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'cliente' | 'proveedor'>('proveedor');
  
  // Redireccionamiento si es necesario
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login?redirect=become-provider');
    }
    
    if (user?.role === 'provider') {
      navigate('/provider/profile');
    }
  }, [isAuthenticated, isLoading, user, navigate]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Cabecera */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900">
            Únete a miservicio
          </h2>
          <p className="mt-2 text-base text-gray-600">
            Crea tu cuenta y conecta con los mejores servicios profesionales
          </p>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b mb-6">
          <button
            onClick={() => navigate('/register')}
            className={`flex-1 py-2 text-center ${
              activeTab === 'cliente' 
                ? 'text-blue-600 border-b-2 border-blue-600 font-semibold' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Cliente
          </button>
          <button
            onClick={() => setActiveTab('proveedor')}
            className={`flex-1 py-2 text-center ${
              activeTab === 'proveedor' 
                ? 'text-blue-600 border-b-2 border-blue-600 font-semibold' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Proveedor de servicios
          </button>
        </div>
        
        {/* Formulario - Sin contenedor adicional */}
        <BecomeProviderForm isNewUser={false} />
        
        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          © {new Date().getFullYear()} Mi Servicio. Todos los derechos reservados.
        </div>
      </div>
    </div>
  );
};

export default BecomeProviderPage;