// src/features/auth/components/BecomeProviderForm/DocumentsSection.tsx
import React from 'react';
import { ArrowUp } from 'lucide-react';
import FormSection from './FormSection';
import { ProviderProfileData } from '../../../providers/types';

interface FormData extends ProviderProfileData {
  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
}

interface DocumentsSectionProps {
  formData: FormData;
  
  profilePreview: string | null;
  certificateFileName: string | null;
  portfolioFileName: string | null;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const DocumentsSection: React.FC<DocumentsSectionProps> = ({
  profilePreview,
  certificateFileName,
  portfolioFileName,
  handleFileChange,
}) => {
  return (
    <FormSection title="Documentación y archivos">
      <div className="space-y-8">
        {/* Foto de perfil */}
        <div className="space-y-2">
          <label htmlFor="profilePicture" className="block text-base font-medium">
            Foto de perfil
          </label>
          <div className="flex flex-col items-center space-y-4">
            <div className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center bg-gray-100 border border-gray-200">
              {profilePreview ? (
                <img src={profilePreview} alt="Vista previa" className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-400 text-lg">Foto</span>
              )}
            </div>
            <div className="w-full">
              <label 
                htmlFor="profilePicture" 
                className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded text-base font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
              >
                <ArrowUp className="h-5 w-5 mr-2" />
                Subir foto
                <input
                  id="profilePicture"
                  name="profilePicture"
                  type="file"
                  className="sr-only"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
              <p className="mt-1.5 text-sm text-gray-500">
                JPG o PNG. Máximo 2MB. Tu cara debe ser claramente visible.
              </p>
            </div>
          </div>
        </div>
        
        {/* Certificados */}
        <div className="space-y-2">
          <label htmlFor="certificate" className="block text-base font-medium">
            Certificados profesionales (opcional)
          </label>
          <div className="w-full">
            <label 
              htmlFor="certificate" 
              className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded text-base font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
            >
              <ArrowUp className="h-5 w-5 mr-2" />
              {certificateFileName ? certificateFileName : 'Subir certificado'}
              <input
                id="certificate"
                name="certificate"
                type="file"
                className="sr-only"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
              />
            </label>
            <p className="mt-1.5 text-sm text-gray-500">
              PDF, JPG o PNG. Máximo 5MB. Sube certificados que avalen tu formación.
            </p>
          </div>
        </div>
        
        {/* Portfolio */}
        <div className="space-y-2">
          <label htmlFor="portfolio" className="block text-base font-medium">
            Portfolio o trabajos previos (opcional)
          </label>
          <div className="w-full">
            <label 
              htmlFor="portfolio" 
              className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded text-base font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
            >
              <ArrowUp className="h-5 w-5 mr-2" />
              {portfolioFileName ? portfolioFileName : 'Subir portfolio'}
              <input
                id="portfolio"
                name="portfolio"
                type="file"
                className="sr-only"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
              />
            </label>
            <p className="mt-1.5 text-sm text-gray-500">
              PDF, JPG o PNG. Máximo 10MB. Muestra tus mejores trabajos para destacar.
            </p>
          </div>
        </div>
      </div>
    </FormSection>
  );
};

export default DocumentsSection;