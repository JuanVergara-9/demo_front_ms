import React from 'react';
import { Link } from 'react-router-dom';
// Importamos User desde el mismo lugar que useAuth
import { User } from '../../../features/auth/types';

interface ProfileHeaderProps {
  user: User | null;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user }) => {
  // Obtener inicial del avatar de manera segura sin depender de name
  const getAvatarInitial = () => {
    if (user?.email) return user.email[0].toUpperCase();
    return 'U';
  };

  // Obtener un nombre de visualización desde el email
  const getDisplayName = () => {
    if (user?.email) {
      // Extraer la parte antes del @ para usarla como nombre
      return user.email.split('@')[0];
    }
    return 'Usuario';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex items-center">
        {/* Avatar del usuario */}
        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl mr-4">
          {getAvatarInitial()}
        </div>
        
        <div>
          <h1 className="text-xl font-bold">{getDisplayName()}</h1>
          <p className="text-gray-500">{user?.email}</p>
          
          {/* Botón para convertirse en proveedor si no lo es */}
          {user?.role !== 'provider' && (
            <Link 
              to="/become-provider" 
              className="inline-block mt-2 text-sm bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors"
            >
              Ofrecer mis servicios
            </Link>
          )}
          
          {/* Botón para ver dashboard si es proveedor */}
          {user?.role === 'provider' && (
            <Link 
              to="/provider/dashboard" 
              className="inline-block mt-2 text-sm bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors"
            >
              Ver panel de proveedor
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;