// src/features/auth/components/BecomeProviderForm/FileUploadField.tsx
import React from 'react';
import { ArrowUp, X } from 'lucide-react';

interface FileUploadFieldProps {
  id: string;
  name: string;
  label: string;
  accept: string;
  description: string;
  fileName: string | null;
  preview?: string | null;
  isImage?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear?: () => void;
}

const FileUploadField: React.FC<FileUploadFieldProps> = ({
  id,
  name,
  label,
  accept,
  description,
  fileName,
  preview,
  isImage = false,
  onChange,
  onClear
}) => {
  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (onClear) {
      onClear();
    } else {
      const input = document.getElementById(id) as HTMLInputElement;
      if (input) input.value = '';
    }
  };

  return (
    <div className="space-y-3">
      <label htmlFor={id} className="block text-base font-medium">
        {label}
      </label>
      
      {isImage && (
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center bg-gray-100 border border-gray-200">
            {preview ? (
              <img src={preview} alt="Vista previa" className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-400 text-lg">Foto</span>
            )}
          </div>
        </div>
      )}
      
      <div className="w-full">
        <label 
          htmlFor={id} 
          className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded text-base font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer relative"
        >
          <ArrowUp className="h-5 w-5 mr-2" />
          {fileName || `Subir ${isImage ? 'foto' : 'archivo'}`}
          <input
            id={id}
            name={name}
            type="file"
            className="sr-only"
            accept={accept}
            onChange={onChange}
          />
          
          {fileName && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
              aria-label={`Eliminar ${isImage ? 'imagen' : 'archivo'}`}
            >
              <X size={16} />
            </button>
          )}
        </label>
        
        <p className="mt-1.5 text-sm text-gray-500">{description}</p>
      </div>
    </div>
  );
};

export default FileUploadField;