import { useState, useEffect } from 'react';

export type Language = 'en' | 'fa';

export const useLanguage = () => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('preferred-language') as Language;
    if (savedLang && (savedLang === 'en' || savedLang === 'fa')) {
      setLanguage(savedLang);
    }
  }, []);

  const toggleLanguage = () => {
    const newLang: Language = language === 'en' ? 'fa' : 'en';
    setLanguage(newLang);
    localStorage.setItem('preferred-language', newLang);
    
    // Update document direction for RTL/LTR
    document.documentElement.dir = newLang === 'fa' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };

  // Set initial direction
  useEffect(() => {
    document.documentElement.dir = language === 'fa' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  return { language, toggleLanguage };
};