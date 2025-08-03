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
    lng: "en", // default language
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
    }
  });

export { i18n };
export default i18n; 