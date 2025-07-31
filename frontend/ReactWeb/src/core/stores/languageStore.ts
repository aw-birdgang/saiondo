import { create } from "zustand";
import { persist } from "zustand/middleware";
import { STORAGE_KEYS } from "../../constants";

export interface Language {
  locale: string;
  code: string;
  name: string;
}

export interface LanguageState {
  // State
  locale: string;
  supportedLanguages: Language[];

  // Actions
  setLanguage: (locale: string) => void;
  getCurrentLanguage: () => Language;
}

const supportedLanguages: Language[] = [
  { locale: "ko", code: "KR", name: "한국어" },
  { locale: "en", code: "US", name: "English" },
];

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      // Initial state
      locale: localStorage.getItem(STORAGE_KEYS.LANGUAGE) || "ko",
      supportedLanguages,

      // Actions
      setLanguage: (locale: string) => {
        localStorage.setItem(STORAGE_KEYS.LANGUAGE, locale);
        set({ locale });
        
        // Update i18n language
        if (typeof window !== "undefined") {
          const { i18n } = require("react-i18next");
          i18n.changeLanguage(locale);
        }
      },

      getCurrentLanguage: () => {
        const state = get();
        return (
          state.supportedLanguages.find((lang) => lang.locale === state.locale) ||
          state.supportedLanguages[0]
        );
      },
    }),
    {
      name: "language-storage",
      partialize: (state) => ({
        locale: state.locale,
      }),
    },
  ),
); 