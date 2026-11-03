import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en/translation.json";
import ko from "./locales/ko/translation.json";
import ja from "./locales/ja/translation.json";
import zhTW from "./locales/zh-TW/translation.json";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ko: { translation: ko },
      ja: { translation: ja },
      "zh-TW": { translation: zhTW },
    },
    // 브라우저 언어를 이 중 하나로 맞춤. zh-HK·zh-CN도 zh-TW로, 그 밖의 언어는 영어로
    supportedLngs: ["ko", "ja", "en", "zh-TW"],
    fallbackLng: "en",
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

// 스크린리더 발음과 검색엔진 언어 판단을 위해 <html lang>을 지금 언어로
const syncHtmlLang = () => {
  document.documentElement.lang = i18n.resolvedLanguage || "ko";
};
syncHtmlLang();
i18n.on("languageChanged", syncHtmlLang);

export default i18n;
