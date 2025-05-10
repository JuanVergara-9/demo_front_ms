// src/features/auth/components/BecomeProviderForm/FormSection.tsx
import React, { ReactNode } from 'react';

interface FormSectionProps {
  title: string;
  children: ReactNode;
  noMargin?: boolean;
}

const FormSection: React.FC<FormSectionProps> = ({ 
  title, 
  children,
  noMargin = false 
}) => (
  <div className={`border-b border-gray-200 pb-6 ${!noMargin ? 'mb-6' : ''}`}>
    <h4 className="text-lg font-medium text-gray-800 mb-4">{title}</h4>
    {children}
  </div>
);

export default FormSection;