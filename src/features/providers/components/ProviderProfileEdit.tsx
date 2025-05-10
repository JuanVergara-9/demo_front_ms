// src/features/providers/components/ProviderProfileEdit.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Provider } from '../types';
import { providerService } from '../services/providerService';
import { toast } from 'react-hot-toast';

interface ProviderProfileEditProps {
  provider: Provider;
  onSave: () => void;
  onCancel: () => void;
}

const schema = yup.object({
  firstName: yup.string().required('El nombre es obligatorio'),
  lastName: yup.string().required('El apellido es obligatorio'),
  phone: yup.string()
    .required('El teléfono es obligatorio')
    .matches(/^[0-9+\s()-]{8,15}$/, 'Ingrese un número de teléfono válido'),
  province: yup.string().required('La provincia es obligatoria'),
  city: yup.string().required('La ciudad es obligatoria'),
  address: yup.string().required('La dirección es obligatoria'),
  description: yup.string()
    .required('La descripción es obligatoria')
    .min(20, 'La descripción debe tener al menos 20 caracteres'),
}).required();

const ProviderProfileEdit: React.FC<ProviderProfileEditProps> = ({ 
  provider, 
  onSave, 
  onCancel 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(provider.profilePicture);
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: provider.firstName,
      lastName: provider.lastName,
      phone: provider.phone,
      province: provider.province,
      city: provider.city,
      address: provider.address,
      description: provider.description
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePicture(file);
      
      // Crear vista previa
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      
      // Añadir todos los campos
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value as string);
      });
      
      // Añadir foto si se cambió
      if (profilePicture) {
        formData.append('profilePicture', profilePicture);
      }
      
      await providerService.updateProfile(formData);
      toast.success('Perfil actualizado correctamente');
      onSave();
    } catch (error) {
      toast.error('Error al actualizar el perfil');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Editar Perfil</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            {/* Foto de perfil */}
            <div className="w-full md:w-1/3 flex flex-col items-center">
              <div className="w-40 h-40 relative mb-4">
                {profilePreview ? (
                  <img 
                    src={profilePreview} 
                    alt="Vista previa" 
                    className="w-full h-full object-cover rounded-full border-4 border-blue-100"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-500 border-4 border-blue-100">
                    {provider.firstName.charAt(0)}{provider.lastName.charAt(0)}
                  </div>
                )}

                {/* Botón para cambiar foto sobrepuesto */}
                <label 
                  htmlFor="profilePictureInput" 
                  className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-blue-500 hover:bg-blue-600 text-white text-xs py-1 px-3 rounded-full cursor-pointer transition-colors"
                >
                  EDITAR
                </label>
              </div>

              <input
                type="file"
                id="profilePictureInput"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <p className="text-xs text-gray-500 text-center mt-2">
                Formatos: JPG, PNG o GIF (máximo 5MB)
              </p>
            </div>

            {/* Formulario principal */}
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Nombre */}
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    {...register('firstName')}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                      errors.firstName 
                        ? 'border-red-300 focus:ring-red-200' 
                        : 'border-gray-300 focus:ring-blue-200'
                    }`}
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                  )}
                </div>

                {/* Apellido */}
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Apellido
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    {...register('lastName')}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                      errors.lastName 
                        ? 'border-red-300 focus:ring-red-200' 
                        : 'border-gray-300 focus:ring-blue-200'
                    }`}
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              {/* Teléfono */}
              <div className="mb-4">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono
                </label>
                <input
                  id="phone"
                  type="text"
                  {...register('phone')}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    errors.phone 
                      ? 'border-red-300 focus:ring-red-200' 
                      : 'border-gray-300 focus:ring-blue-200'
                  }`}
                  placeholder="Ej: 1122334455"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Ubicación */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label htmlFor="province" className="block text-sm font-medium text-gray-700 mb-1">
                Provincia
              </label>
              <input
                id="province"
                type="text"
                {...register('province')}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.province 
                    ? 'border-red-300 focus:ring-red-200' 
                    : 'border-gray-300 focus:ring-blue-200'
                }`}
              />
              {errors.province && (
                <p className="mt-1 text-sm text-red-600">{errors.province.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                Ciudad
              </label>
              <input
                id="city"
                type="text"
                {...register('city')}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.city 
                    ? 'border-red-300 focus:ring-red-200' 
                    : 'border-gray-300 focus:ring-blue-200'
                }`}
              />
              {errors.city && (
                <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Dirección
              </label>
              <input
                id="address"
                type="text"
                {...register('address')}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.address 
                    ? 'border-red-300 focus:ring-red-200' 
                    : 'border-gray-300 focus:ring-blue-200'
                }`}
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
              )}
            </div>
          </div>
          
          {/* Descripción */}
          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Descripción de servicios
            </label>
            <textarea
              id="description"
              rows={5}
              {...register('description')}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.description 
                  ? 'border-red-300 focus:ring-red-200' 
                  : 'border-gray-300 focus:ring-blue-200'
              }`}
              placeholder="Describe los servicios que ofreces con detalle..."
            ></textarea>
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>
          
          {/* Botones */}
          <div className="flex justify-end space-x-3">
            <button 
              type="button" 
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? 
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Guardando...
                </span> : 
                'Guardar cambios'
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProviderProfileEdit;