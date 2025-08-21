import React from 'react';
import { GlobeIcon } from 'lucide-react';

interface LanguageSelectorProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
}

const languages = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'ar', name: 'العربية', flag: '🇲🇦' },
  { code: 'en', name: 'English', flag: '🇺🇸' }
];

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ currentLanguage, onLanguageChange }) => {
  return (
    <div className="fixed top-4 left-4 z-50">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50 border-b border-gray-200">
          <GlobeIcon className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Language</span>
        </div>
        
        <div className="p-2">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => onLanguageChange(language.code)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-all ${
                currentLanguage === language.code
                  ? 'bg-blue-100 text-blue-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              dir={language.code === 'ar' ? 'rtl' : 'ltr'}
            >
              <span className="text-lg">{language.flag}</span>
              <span>{language.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguageSelector;