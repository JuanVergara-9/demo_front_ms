// src/features/auth/components/BecomeProviderForm/LocationSection.tsx
import React from 'react';
import { MapPin } from 'lucide-react';
import FormSection from './FormSection';
import { ProviderProfileData } from '../../../providers/types';

interface FormData extends ProviderProfileData {
  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
}

interface FormErrors {
  [key: string]: string;
}

interface LocationSectionProps {
  formData: FormData;
  errors: FormErrors;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

const LocationSection: React.FC<LocationSectionProps> = ({
  formData,
  errors,
  handleChange,
}) => {
  // Lista de provincias de Argentina (simplificada)
  const provinces = [
    "Buenos Aires",
    "Ciudad Autónoma de Buenos Aires",
    "Catamarca",
    "Chaco",
    "Chubut",
    "Córdoba",
    "Corrientes",
    "Entre Ríos",
    "Formosa",
    "Jujuy",
    "La Pampa",
    "La Rioja",
    "Mendoza",
    "Misiones",
    "Neuquén",
    "Río Negro",
    "Salta",
    "San Juan",
    "San Luis",
    "Santa Cruz",
    "Santa Fe",
    "Santiago del Estero",
    "Tierra del Fuego",
    "Tucumán"
  ];

  return (
    <FormSection title="Ubicación">
      <div className="grid grid-cols-1 gap-5 mb-4">
        <div>
          <label htmlFor="province" className="block text-base font-medium mb-1">
            Provincia
          </label>
          <div className="relative">
            <select
              id="province"
              name="province"
              value={formData.province}
              onChange={handleChange}
              className={`block w-full px-4 py-2.5 text-base rounded border ${
                errors.province ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-1 focus:ring-blue-500`}
            >
              <option value="">Seleccionar provincia</option>
              {provinces.map(province => (
                <option key={province} value={province}>
                  {province}
                </option>
              ))}
            </select>
            <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>
          {errors.province && (
            <p className="mt-1 text-sm text-red-600">{errors.province}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="city" className="block text-base font-medium mb-1">
            Ciudad
          </label>
          <div className="relative">
            <input
              id="city"
              name="city"
              type="text"
              value={formData.city}
              onChange={handleChange}
              className={`block w-full px-4 py-2.5 text-base rounded border ${
                errors.city ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-1 focus:ring-blue-500`}
              placeholder="Tu ciudad"
            />
            <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>
          {errors.city && (
            <p className="mt-1 text-sm text-red-600">{errors.city}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="address" className="block text-base font-medium mb-1">
            Dirección
          </label>
          <div className="relative">
            <input
              id="address"
              name="address"
              type="text"
              value={formData.address}
              onChange={handleChange}
              className={`block w-full px-4 py-2.5 text-base rounded border ${
                errors.address ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-1 focus:ring-blue-500`}
              placeholder="Tu dirección completa"
            />
            <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>
          {errors.address && (
            <p className="mt-1 text-sm text-red-600">{errors.address}</p>
          )}
          <p className="mt-2 text-sm text-gray-500">
            Tu dirección exacta no será visible para los clientes, solo se mostrará tu ciudad y provincia.
          </p>
        </div>
      </div>
    </FormSection>
  );
};

export default LocationSection;