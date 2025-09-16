import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

export type Language = 'en' | 'fa';

interface LanguageContextType {
    language: Language;
    toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
    children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
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

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
