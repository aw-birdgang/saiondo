import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import language resources
import ko from "./locales/ko.json";
import en from "./locales/en.json";

const resources = {
  ko: {
    translation: ko,
  },
  en: {
    translation: en,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem("language") || "ko", // default language
    fallbackLng: "ko",
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

export default i18n; 