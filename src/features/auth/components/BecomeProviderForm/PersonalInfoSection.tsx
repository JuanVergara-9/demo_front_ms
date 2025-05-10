// src/features/auth/components/BecomeProviderForm/PersonalInfoSection.tsx
import React from 'react';
import { User, Phone, Calendar, CreditCard, Mail, Eye, EyeOff } from 'lucide-react';
import FormSection from './FormSection';
import { ProviderProfileData } from '../../../providers/types';

// Interfaces locales solo con lo que necesitamos aquí
interface FormData extends ProviderProfileData {
  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
}

interface FormErrors {
  [key: string]: string;
}

interface PersonalInfoSectionProps {
  formData: FormData;
  errors: FormErrors;
  isNewUser: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (show: boolean) => void;
}

const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  formData,
  errors,
  isNewUser,
  handleChange,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword
}) => {
  return (
    <FormSection title="Datos personales">
      <div className="grid grid-cols-1 gap-5 mb-4">
        <div>
          <label htmlFor="firstName" className="block text-base font-medium mb-1">
            Nombre
          </label>
          <div className="relative">
            <input
              id="firstName"
              name="firstName"
              type="text"
              value={formData.firstName}
              onChange={handleChange}
              className={`block w-full px-4 py-2.5 text-base rounded border ${
                errors.firstName ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-1 focus:ring-blue-500`}
              placeholder="Tu nombre"
            />
            <User className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="lastName" className="block text-base font-medium mb-1">
            Apellido
          </label>
          <div className="relative">
            <input
              id="lastName"
              name="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleChange}
              className={`block w-full px-4 py-2.5 text-base rounded border ${
                errors.lastName ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-1 focus:ring-blue-500`}
              placeholder="Tu apellido"
            />
            <User className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
          )}
        </div>
        
        {isNewUser && (
          <div>
            <label htmlFor="email" className="block text-base font-medium mb-1">
              Email
            </label>
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`block w-full px-4 py-2.5 text-base rounded border ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                placeholder="tu.email@ejemplo.com"
              />
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>
        )}
        
        <div>
          <label htmlFor="phone" className="block text-base font-medium mb-1">
            Teléfono
          </label>
          <div className="relative">
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              className={`block w-full px-4 py-2.5 text-base rounded border ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-1 focus:ring-blue-500`}
              placeholder="+54 11 12345678"
            />
            <Phone className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="birthdate" className="block text-base font-medium mb-1">
            Fecha de nacimiento
          </label>
          <div className="relative">
            <input
              id="birthdate"
              name="birthdate"
              type="date"
              value={formData.birthdate}
              onChange={handleChange}
              className={`block w-full px-4 py-2.5 text-base rounded border ${
                errors.birthdate ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-1 focus:ring-blue-500`}
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          {errors.birthdate && (
            <p className="mt-1 text-sm text-red-600">{errors.birthdate}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="dniCuit" className="block text-base font-medium mb-1">
            DNI / CUIT
          </label>
          <div className="relative">
            <input
              id="dniCuit"
              name="dniCuit"
              type="text"
              value={formData.dniCuit}
              onChange={handleChange}
              className={`block w-full px-4 py-2.5 text-base rounded border ${
                errors.dniCuit ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-1 focus:ring-blue-500`}
              placeholder="12345678"
            />
            <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          {errors.dniCuit && (
            <p className="mt-1 text-sm text-red-600">{errors.dniCuit}</p>
          )}
        </div>
        
        {isNewUser && (
          <>
            <div>
              <label htmlFor="password" className="block text-base font-medium mb-1">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  className={`block w-full px-4 py-2.5 text-base pr-10 rounded border ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                  placeholder="********"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showPassword ? 
                    <EyeOff className="h-5 w-5" /> : 
                    <Eye className="h-5 w-5" />
                  }
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-base font-medium mb-1">
                Confirmar contraseña
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`block w-full px-4 py-2.5 text-base pr-10 rounded border ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                  placeholder="********"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? 
                    <EyeOff className="h-5 w-5" /> : 
                    <Eye className="h-5 w-5" />
                  }
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>
          </>
        )}
      </div>
    </FormSection>
  );
};

export default PersonalInfoSection;