// src/features/auth/components/BecomeProviderForm/ProfessionalSection.tsx
import React from 'react';
import { FileText } from 'lucide-react';
import FormSection from './FormSection';
import CategorySelector from '../../../providers/components/CategorySelector';
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

interface ProfessionalSectionProps {
  formData: FormData;
  errors: FormErrors;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleCategoriesChange: (categories: number[]) => void;
  handleSubcategoriesChange: (subcategories: number[]) => void;
}

const ProfessionalSection: React.FC<ProfessionalSectionProps> = ({
  formData,
  errors,
  handleChange,
  handleCategoriesChange,
  handleSubcategoriesChange,
}) => {
  return (
    <FormSection title="Información profesional">
      <div className="space-y-6">
        <div>
          <label htmlFor="categories" className="block text-base font-medium mb-1">
            Categorías y servicios
          </label>
          <CategorySelector
            selectedCategories={Array.isArray(formData.categories) ? formData.categories.map(category => typeof category === 'object' ? category.id : category) : []}
            selectedSubcategories={Array.isArray(formData.subcategories) ? formData.subcategories.map(subcategory => typeof subcategory === 'object' ? subcategory.id : subcategory) : []}
            onCategoriesChange={handleCategoriesChange}
            onSubcategoriesChange={handleSubcategoriesChange}
          />
          {errors.categories && (
            <p className="mt-1 text-sm text-red-600">{errors.categories}</p>
          )}
          <p className="mt-2 text-sm text-gray-500">
            Selecciona las categorías que mejor describen tus servicios.
          </p>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="description" className="block text-base font-medium">
              Descripción de tus servicios
            </label>
            <span className={`text-sm ${formData.description.length > 950 ? 'text-amber-600 font-medium' : 'text-gray-500'}`}>
              {formData.description.length} / 1000
            </span>
          </div>
          <div className="relative">
            <textarea
              id="description"
              name="description"
              rows={6}
              value={formData.description}
              onChange={handleChange}
              className={`block w-full px-4 py-3 text-base rounded border ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-1 focus:ring-blue-500`}
              placeholder="Describe detalladamente los servicios que ofreces, tu experiencia y cualquier otra información relevante..."
            />
            <FileText className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
          </div>
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
          <p className="mt-2 text-sm text-gray-500">
            Mínimo 20 caracteres. Una buena descripción aumenta tus posibilidades de conseguir clientes.
          </p>
        </div>
      </div>
    </FormSection>
  );
};

export default ProfessionalSection;