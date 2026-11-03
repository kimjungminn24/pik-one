import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en/translation.json";
import ko from "./locales/ko/translation.json";
import ja from "./locales/ja/translation.json";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ko: { translation: ko },
      ja: { translation: ja },
    },
    fallbackLng: "en",
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

// 스크린리더 발음과 검색엔진 언어 판단을 위해 <html lang>을 지금 언어로
const syncHtmlLang = (lng) => {
  document.documentElement.lang = (lng || "ko").slice(0, 2);
};
syncHtmlLang(i18n.resolvedLanguage || i18n.language);
i18n.on("languageChanged", syncHtmlLang);

export default i18n;
