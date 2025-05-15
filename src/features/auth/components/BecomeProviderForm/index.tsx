import React, { useEffect } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useProviderForm } from './useProviderForm';
import StepProgress from './StepProgress';
import PersonalInfoSection from './PersonalInfoSection';
import LocationSection from './LocationSection';
import ProfessionalSection from './ProfessionalSection';
import DocumentsSection from './DocumentsSection';
import AccessDataSection from './AccessDataSection'; 

// Títulos de los pasos
const stepTitles = [
  'Datos de Acceso',
  'Datos Personales',
  'Ubicación',
  'Información Profesional',
  'Documentación'
];

const BecomeProviderForm: React.FC<{ isNewUser: boolean }> = ({ isNewUser }) => {
  const {
    formData,
    errors,
    isLoading,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    profilePreview,
    certificateFileName,
    portfolioFileName,
    handleChange,
    handleFileChange,
    handleCategoriesChange,
    handleSubcategoriesChange,
    handleSubmit,
    currentStep,
    totalSteps,
    nextStep,
    prevStep,
    goToStep
  } = useProviderForm(isNewUser);

  // Depuración: mostrar el paso actual cuando cambia
  useEffect(() => {
    console.log(`Paso actual: ${currentStep} de ${totalSteps}`);
    console.log('Datos del formulario:', formData);
  }, [currentStep, formData, totalSteps]);

  // Renderizar el paso actual
  const renderStep = () => {
    console.log(`Renderizando paso ${currentStep}`);
    
    switch (currentStep) {
      case 1: // Datos de Acceso
        return (
          <AccessDataSection
            formData={formData}
            errors={errors}
            isNewUser={isNewUser}
            handleChange={handleChange}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            showConfirmPassword={showConfirmPassword}
            setShowConfirmPassword={setShowConfirmPassword}
          />
        );
      case 2: // Datos Personales
        return (
          <PersonalInfoSection
            formData={formData}
            errors={errors}
            isNewUser={isNewUser} // CORREGIDO: Usar el valor real de isNewUser
            handleChange={handleChange}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            showConfirmPassword={showConfirmPassword}
            setShowConfirmPassword={setShowConfirmPassword}
          />
        );
      case 3: // Ubicación
        return (
          <LocationSection
            formData={formData}
            errors={errors}
            handleChange={handleChange}
          />
        );
      case 4: // Info Profesional
        return (
          <ProfessionalSection
            formData={formData}
            errors={errors}
            handleChange={handleChange}
            handleCategoriesChange={handleCategoriesChange}
            handleSubcategoriesChange={handleSubcategoriesChange}
          />
        );
      case 5: // Documentación
        return (
          <DocumentsSection
            formData={formData}
            errors={errors} // AÑADIDO: Pasar errores al componente
            handleFileChange={handleFileChange}
            profilePreview={profilePreview}
            certificateFileName={certificateFileName}
            portfolioFileName={portfolioFileName}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-6 md:p-8">
      {!isNewUser && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Conviértete en proveedor</h2>
          <p className="text-gray-600">Completa este formulario para ofrecer tus servicios en nuestra plataforma.</p>
        </div>
      )}
      
      {/* Indicador de progreso */}
      <StepProgress 
        currentStep={currentStep} 
        totalSteps={totalSteps}
        stepTitles={stepTitles}
        onStepClick={goToStep}
      />
      
      {/* AÑADIDO: Visualización mejorada de errores */}
      {Object.keys(errors).length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700 font-medium">Por favor corrige los siguientes errores:</p>
          <ul className="list-disc pl-5 mt-2">
            {Object.values(errors).map((error, index) => (
              <li key={index} className="text-red-600 text-sm">{error}</li>
            ))}
          </ul>
        </div>
      )}
      
      <form onSubmit={(e) => {
        e.preventDefault();
        console.log(`Formulario enviado. Paso actual: ${currentStep}, Total: ${totalSteps}`);
        if (currentStep === totalSteps) {
          console.log('Enviando formulario completo');
          handleSubmit(e);
        } else {
          console.log('Avanzando al siguiente paso');
          nextStep();
        }
      }} className="space-y-8">
        {/* Renderizar el paso actual */}
        {renderStep()}
        
        {/* Navegación entre pasos */}
        <div className="flex justify-between pt-4 border-t border-gray-200">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => {
                console.log('Retrocediendo al paso anterior');
                prevStep();
              }}
              className="py-2 px-4 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 flex items-center"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Anterior
            </button>
          ) : (
            <div></div>
          )}
          
          <button
            type="submit"
            disabled={isLoading}
            className={`py-2 px-6 rounded text-white focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center
              ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'}`}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            ) : currentStep === totalSteps ? (
              <div className="flex items-center">
                {isNewUser ? (
                  <span>Registrarme como proveedor</span>
                ) : (
                  <span>Completar registro</span>
                )}
              </div>
            ) : (
              <div className="flex items-center">
                <span>Siguiente</span>
                <ArrowRight className="ml-2 h-5 w-5" />
              </div>
            )}
          </button>
        </div>

        {/* AÑADIDO: Botones de depuración (eliminar en producción) */}
        <div className="mt-4 flex space-x-2 text-xs bg-gray-50 p-2 rounded">
          <span className="text-gray-500">Navegar directo:</span>
          {[...Array(totalSteps)].map((_, idx) => (
            <button 
              key={idx}
              type="button" 
              onClick={() => goToStep(idx + 1)}
              className={`${currentStep === idx + 1 ? 'bg-blue-200' : 'bg-gray-200'} px-2 py-1 rounded`}
            >
              Paso {idx + 1}
            </button>
          ))}
        </div>
      </form>
    </div>
  );
};

export default BecomeProviderForm;