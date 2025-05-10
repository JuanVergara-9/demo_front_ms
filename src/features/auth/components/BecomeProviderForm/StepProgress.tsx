import React from 'react';

interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
  stepTitles: string[]; // Mantenemos para referencia interna
  onStepClick?: (step: number) => void;
}

const StepProgress: React.FC<StepProgressProps> = ({
  currentStep,
  totalSteps,
  stepTitles,
  onStepClick
}) => {
  return (
    <div className="mb-8">
      {/* Indicadores numerados sin títulos */}
      <div className="flex justify-center space-x-8 sm:space-x-12">
        {stepTitles.map((_, index) => {
          const stepNum = index + 1;
          const isActive = stepNum === currentStep;
          const isCompleted = stepNum < currentStep;
          
          return (
            <div 
              key={stepNum}
              className={`flex flex-col items-center ${onStepClick ? 'cursor-pointer' : ''}`}
              onClick={() => onStepClick && onStepClick(stepNum)}
              title={stepTitles[index]} // Mantenemos el título como tooltip
            >
              <div 
                className={`
                  flex items-center justify-center w-10 h-10 rounded-full
                  ${isActive ? 'bg-blue-600 text-white' : 
                    isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}
                  transition-all duration-200
                `}
              >
                {isCompleted ? '✓' : stepNum}
              </div>
              
              {/* Eliminamos la etiqueta de texto que mostraba el título */}
            </div>
          );
        })}
      </div>
      
      {/* Líneas de conexión */}
      <div className="hidden sm:flex justify-center items-center mt-4">
        {[...Array(totalSteps - 1)].map((_, index) => (
          <div 
            key={index}
            className={`h-1 w-16 sm:w-28 mx-1 ${
              currentStep > index + 1 ? 'bg-green-500' : 'bg-gray-200'
            }`}
          ></div>
        ))}
      </div>
      
      {/* Título del paso actual - Centrado y separado de los números */}
      <div className="text-center mt-4">
        <h3 className="text-lg font-medium text-gray-900">
          {stepTitles[currentStep - 1]}
        </h3>
      </div>
    </div>
  );
};

export default StepProgress;