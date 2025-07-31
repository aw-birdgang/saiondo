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
  changeLanguage: (value: string) => void;
  getCurrentLanguage: () => Language;
  getCode: () => string;
  getLanguage: () => string | null;
  init: () => void;
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

      changeLanguage: (value: string) => {
        set({ locale: value });
        // TODO: Save to repository/settings
      },

      getCode: () => {
        const state = get();
        if (state.locale === 'en') {
          return "US";
        } else if (state.locale === 'ko') {
          return "KO";
        }
        return "US";
      },

      getLanguage: () => {
        const state = get();
        const language = state.supportedLanguages.find(
          (lang) => lang.locale === state.locale
        );
        return language?.name || null;
      },

      init: () => {
        // TODO: Load from repository/settings
        const savedLocale = localStorage.getItem("language");
        if (savedLocale) {
          set({ locale: savedLocale });
        }
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