import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import translation files
import enTranslations from "./translations/en.json";
import koTranslations from "./translations/ko.json";

const resources = {
  en: {
    translation: enTranslations
  },
  ko: {
    translation: koTranslations
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "ko", // default language (Korean)
    fallbackLng: "en",
    debug: process.env.NODE_ENV === "development",
    interpolation: {
      escapeValue: false // React already escapes values
    },
    react: {
      useSuspense: false // This is important for SSR compatibility
    },
    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"]
    },
    // Better error handling
    saveMissing: process.env.NODE_ENV === "development",
    missingKeyHandler: (lng: string, ns: string, key: string, fallbackValue: string) => {
      if (process.env.NODE_ENV === "development") {
        console.warn(`Missing translation key: ${key} for language: ${lng}`);
      }
    },
    // Key separator for nested translations
    keySeparator: ".",
    // Namespace separator
    nsSeparator: ":",
    // Plural separator
    pluralSeparator: "_",
    // Context separator
    contextSeparator: "_"
  });

export { i18n };
export default i18n; 