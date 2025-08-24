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
    try {
      const stored = localStorage.getItem('career-compass-language') as SupportedLanguage;
      return stored || defaultLanguage;
    } catch {
      return defaultLanguage;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('career-compass-language', language);
    } catch {
      // Silently handle localStorage errors
    }
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
    // Provide a fallback instead of throwing an error during development
    console.warn('useLanguage hook called outside of LanguageProvider. Using fallback.');
    return {
      language: 'en' as SupportedLanguage,
      setLanguage: () => {},
      t: (key: string) => key, // Return the key as fallback
    };
  }
  return context;
}
