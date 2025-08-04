import React, { createContext, useContext, useState, useEffect } from 'react';
import { SupportedLanguage, getTranslation } from '@/lib/translations';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: React.ReactNode;
  defaultLanguage?: SupportedLanguage;
}

export function LanguageProvider({ 
  children, 
  defaultLanguage = 'en' 
}: LanguageProviderProps) {
  const [language, setLanguage] = useState<SupportedLanguage>(() => {
    const stored = localStorage.getItem('career-compass-language') as SupportedLanguage;
    return stored || defaultLanguage;
  });

  useEffect(() => {
    localStorage.setItem('career-compass-language', language);
  }, [language]);

  const t = (key: string): string => {
    return getTranslation(language, key);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
