// src/features/contact/components/ContactModal.tsx
import React from 'react';
import { FaPhone, FaWhatsapp, FaEnvelope, FaTimes } from 'react-icons/fa';
import { Provider } from '../../providers/types';

interface ContactModalProps {
  provider: Provider;
  onClose: () => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ provider, onClose }) => {
  const handlePhoneClick = () => {
    const phoneNumber = provider.phone?.replace(/\D/g, '');
    window.location.href = `tel:+${phoneNumber}`;
  };

  const handleWhatsAppClick = () => {
    const phoneNumber = provider.phone?.replace(/\D/g, '');
    const message = `Hola ${provider.firstName}, vi tu perfil en Mi Servicio y me interesa contactarte.`;
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleEmailClick = () => {
    const email = provider.user?.email;
    if (!email) return;
    
    const subject = `Consulta desde Mi Servicio`;
    const body = `Hola ${provider.firstName}, vi tu perfil en Mi Servicio y me interesa contactarte.`;
    
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b">
          <h3 className="text-xl font-semibold text-gray-800">
            Contactar a {provider.firstName} {provider.lastName}
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            title="Cerrar modal"
          >
            <FaTimes size={20} />
          </button>
        </div>
        
        {/* Body */}
        <div className="p-6">
          <p className="mb-4 text-gray-600">
            Elige cómo quieres contactar:
          </p>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            {/* Botón de Llamada */}
            <button
              onClick={handlePhoneClick}
              className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center mb-2">
                <FaPhone size={20} />
              </div>
              <span className="text-sm font-medium">Llamar</span>
            </button>
            
            {/* Botón de WhatsApp */}
            <button
              onClick={handleWhatsAppClick}
              className="flex flex-col items-center justify-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center mb-2">
                <FaWhatsapp size={20} />
              </div>
              <span className="text-sm font-medium">WhatsApp</span>
            </button>
            
            {/* Botón de Email */}
            <button
              onClick={handleEmailClick}
              className="flex flex-col items-center justify-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
              disabled={!provider.user?.email}
            >
              <div className="w-12 h-12 rounded-full bg-purple-500 text-white flex items-center justify-center mb-2">
                <FaEnvelope size={20} />
              </div>
              <span className="text-sm font-medium">Email</span>
            </button>
          </div>
          
          {/* Espacio reservado para el futuro formulario detallado */}
          <div className="flex items-center justify-center my-4">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="px-3 text-gray-500 text-sm">o</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          
          <button 
            className="w-full py-3 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 transition-colors"
            onClick={() => alert("Esta función estará disponible próximamente")}
          >
            Completar formulario detallado
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactModal;