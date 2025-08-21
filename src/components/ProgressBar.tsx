import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  steps: Array<{
    name: string;
    icon: React.ComponentType<any>;
  }>;
  language?: string;
}

const translations = {
  fr: {
    step: "Étape",
    of: "sur",
    completed: "complété"
  },
  ar: {
    step: "الخطوة",
    of: "من",
    completed: "مكتمل"
  }
};

const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  totalSteps,
  steps,
  language = 'fr'
}) => {
  const progress = (currentStep / (totalSteps - 1)) * 100;
  const t = translations[language as 'fr' | 'ar'] || translations.fr;

  return (
    <div className={`w-full ${language === 'ar' ? 'rtl' : 'ltr'}`}>
      <div className={`flex justify-between items-center mb-2 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
        <span className={`text-sm font-medium text-gray-700 ${language === 'ar' ? 'text-right' : ''}`}>
          {t.step} {currentStep} {t.of} {totalSteps - 1}
        </span>
        <span className={`text-sm text-gray-500 ${language === 'ar' ? 'text-left' : ''}`}>
          {Math.round(progress)}% {t.completed}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500 ease-out ${language === 'ar' ? 'origin-right' : 'origin-left'
            }`}
          style={{
            width: `${progress}%`,
            transformOrigin: language === 'ar' ? 'right' : 'left'
          }}
        />
      </div>

      {/* Current Step Name */}
      <div className="mt-2 text-center">
        <span className="text-sm text-gray-600">
          {currentStep > 0 ? steps[currentStep]?.name : ''}
        </span>
      </div>
    </div>
  );
};

export default ProgressBar;