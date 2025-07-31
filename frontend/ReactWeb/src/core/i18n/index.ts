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
    debug: process.env.NODE_ENV === "development",
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
    react: {
      useSuspense: false, // Disable Suspense for better error handling
    },
  });

// Add language change listener
i18n.on("languageChanged", (lng) => {
  localStorage.setItem("language", lng);
  document.documentElement.lang = lng;
});

export default i18n; 