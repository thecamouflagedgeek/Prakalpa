import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en.json";
import kn from "./locales/kn.json";

i18n
  .use(LanguageDetector) // Persists language setting in localStorage
  .use(initReactI18next)
  .init({
    resources: {
      en,
      kn,
    },
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // React already escapes values to prevent XSS
    },
  });

export default i18n;