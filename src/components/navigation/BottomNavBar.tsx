import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Search, Star, User } from 'lucide-react';
import { useAuth } from '../../features/auth/context/AuthContext';
import { toast } from 'react-toastify';

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  onClick?: () => void;
  requiresAuth?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ 
  to, 
  icon: Icon, 
  label, 
  isActive, 
  onClick,
  requiresAuth = false 
}) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const handleClick = (e: React.MouseEvent) => {
    if (requiresAuth && !isAuthenticated) {
      e.preventDefault();
      toast.info("Inicia sesión para acceder a esta función");
      navigate("/login", { state: { from: to } });
      return;
    }
    
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };
  
  return (
    <Link 
      to={to} 
      onClick={handleClick}
      className={`flex flex-col items-center justify-center p-2 ${
        isActive 
          ? 'text-blue-600' 
          : 'text-gray-500 hover:text-gray-700'
      }`}
    >
      <Icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : ''}`} />
      <span className="text-xs mt-1">{label}</span>
    </Link>
  );
};

const BottomNavBar: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  
  // Determinar la ruta de perfil según el tipo de usuario
  const getProfilePath = () => {
    if (!isAuthenticated) {
      return '/login';
    }
    
    // Si el usuario es un proveedor y está en una ruta de proveedor, mantenerlo en dashboard
    if (user?.role === 'provider' && location.pathname.startsWith('/provider')) {
      return '/provider/dashboard';
    }
    
    // Si el usuario es un proveedor pero está en una ruta normal, llevarlo al perfil de usuario
    if (user?.role === 'provider') {
      return '/provider/profile';
    }
    
    // Usuario normal
    return '/profile';
  };
  
  const profilePath = getProfilePath();
  
  // Verificar la página activa
  const isHomeActive = location.pathname === '/';
  const isCategoriesActive = location.pathname.includes('/categories');
  const isReviewsActive = location.pathname.includes('/reviews') || 
                         (location.pathname.includes('/providers') && location.pathname.includes('/reviews'));
                         
  // Considerar activas todas las páginas relacionadas con el perfil
  const isProfileActive = location.pathname === '/login' || 
                        location.pathname === '/register' || 
                        location.pathname === '/profile' || 
                        location.pathname.startsWith('/provider') || 
                        location.pathname === '/settings' ||
                        location.pathname === '/favorites' ||
                        location.pathname === '/bookings';

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-2 shadow-lg z-50">
      <div className="grid grid-cols-4 gap-1 max-w-md mx-auto">
        <NavItem 
          to="/" 
          icon={Home} 
          label="Inicio" 
          isActive={isHomeActive}
        />
        <NavItem 
          to="/categories" 
          icon={Search} 
          label="Servicios" 
          isActive={isCategoriesActive}
        />
        <NavItem 
          to={isAuthenticated ? '/reviews/my-reviews' : '/login'} // Actualizar cuando tengas la página de reseñas
          icon={Star} 
          label="Reseñas" 
          isActive={isReviewsActive}
          requiresAuth={true}
        />
        <NavItem 
          to={profilePath} 
          icon={User} 
          label="Perfil" 
          isActive={isProfileActive}
        />
      </div>
    </div>
  );
};

export default BottomNavBar;