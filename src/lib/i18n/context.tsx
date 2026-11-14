"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import type { Locale, Dictionary, LanguageContextType } from "./types";
import { enDictionary } from "./dictionaries/en";
import { bmDictionary } from "./dictionaries/bm";

const STORAGE_KEY = "fighterx_locale";
const COOKIE_NAME = "NEXT_LOCALE";

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Always initialize with 'en' on the server and initial client mount to guarantee 100% hydration match
  const [locale, setLocaleState] = useState<Locale>("en");

  // Post-mount hydration to retrieve stored user preference safely
  useEffect(() => {
    try {
      const savedLocale = localStorage.getItem(STORAGE_KEY) as Locale | null;
      if (savedLocale === "en" || savedLocale === "bm") {
        setLocaleState(savedLocale);
        document.documentElement.lang = savedLocale;
      } else {
        document.documentElement.lang = "en";
      }
    } catch {
      // Handle private browsing or localStorage restriction
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem(STORAGE_KEY, newLocale);
      document.cookie = `${COOKIE_NAME}=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
      document.documentElement.lang = newLocale;
    } catch {
      // Fallback
    }
  };

  const toggleLocale = () => {
    setLocale(locale === "en" ? "bm" : "en");
  };

  const d: Dictionary = useMemo(() => {
    return locale === "bm" ? bmDictionary : enDictionary;
  }, [locale]);

  return (
    <LanguageContext.Provider value={{ locale, setLocale, toggleLocale, d, dict: d }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      locale: "en",
      setLocale: () => {},
      toggleLocale: () => {},
      d: enDictionary,
      dict: enDictionary,
    };
  }
  return context;
}
