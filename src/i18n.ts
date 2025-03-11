import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import ko from "./locales/ko.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ko: { translation: ko }
  },
  lng: "ko", // 기본 언어 (예: "en" 또는 "ko")
  fallbackLng: "en", // 지원되지 않는 언어일 경우 기본 언어로
  interpolation: { escapeValue: false }
});

export default i18n;