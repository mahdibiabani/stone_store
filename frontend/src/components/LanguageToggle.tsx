import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

const LanguageToggle: React.FC = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center space-x-2 px-3 py-2 bg-warm-200 text-stone-800 rounded-lg hover:bg-warm-300 transition-all duration-300 transform hover:scale-105"
      aria-label={`Switch to ${language === 'en' ? 'Persian' : 'English'}`}
    >
      <Globe className="w-4 h-4" />
      <span className="text-sm font-medium font-persian">
        {language === 'en' ? 'فارسی' : 'English'}
      </span>
    </button>
  );
};

export default LanguageToggle;