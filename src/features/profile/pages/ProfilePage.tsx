import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../features/auth/context/AuthContext';
import ProfileHeader from '../components/ProfileHeader';
import ProfileMenu from '../components/ProfileMenu';

const ProfilePage: React.FC = () => {
  // Corrige el uso de useAuth según lo que realmente proporciona
  const { user, logout } = useAuth();  // Removed logout as it does not exist
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();  // Ahora usamos la función del AuthContext
    navigate('/');
  };

  return (
    <div className="pb-20">
      <h1 className="sr-only">Perfil de usuario</h1>
      
      {/* Necesitamos actualizar ProfileHeader para aceptar el tipo correcto de User */}
      <ProfileHeader user={user} />
      
      <ProfileMenu onLogout={handleLogout} />
    </div>
  );
};

export default ProfilePage;