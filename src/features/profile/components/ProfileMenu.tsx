import React from 'react';
import { Link } from 'react-router-dom';
import { Settings, Heart, FileText, MessageSquare, LogOut, Calendar } from 'lucide-react';

interface ProfileMenuProps {
  onLogout: () => void;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({ onLogout }) => {
  const menuItems = [
    { 
      icon: MessageSquare, 
      label: 'Mis mensajes', 
      path: '/messages',
      badge: 0 // Número opcional de mensajes nuevos
    },
    { 
      icon: Heart, 
      label: 'Servicios favoritos', 
      path: '/favorites' 
    },
    { 
      icon: Calendar, 
      label: 'Mis reservas', 
      path: '/bookings' 
    },
    { 
      icon: FileText, 
      label: 'Historial de servicios', 
      path: '/service-history' 
    },
    { 
      icon: Settings, 
      label: 'Configuración', 
      path: '/settings' 
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="divide-y divide-gray-100">
        {menuItems.map((item, index) => (
          <Link 
            key={index}
            to={item.path} 
            className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center">
              <item.icon className="w-5 h-5 text-gray-500 mr-3" />
              <span>{item.label}</span>
            </div>
            
            {item.badge !== undefined && item.badge > 0 && (
              <span className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {item.badge}
              </span>
            )}
          </Link>
        ))}
        
        <button 
          onClick={onLogout}
          className="w-full flex items-center p-4 text-left text-red-600 hover:bg-gray-50 transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </div>
  );
};

export default ProfileMenu;