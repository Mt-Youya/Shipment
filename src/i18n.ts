import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";

i18n
  .use(Backend) // 加载语言文件
  .use(LanguageDetector) // 检测浏览器语言
  .use(initReactI18next) // 注入 React 集成
  .init({
    fallbackLng: "en", // 默认语言
    debug: false, // 生产环境关闭调试
    interpolation: {
      escapeValue: false // React 默认会转义，无需额外处理
    },
    backend: {
      loadPath: "/locales/{{lng}}.json" // 语言文件路径
    }
  });

export default i18n;
