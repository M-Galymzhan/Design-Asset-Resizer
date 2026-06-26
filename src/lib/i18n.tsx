"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

type Language = "en" | "ru";

const translations = {
  en: {
    title: "Design Asset Resizer",
    subtitle: "Upload a single SVG or PNG logo and get a ZIP archive with 35+ perfectly sized assets for Web, iOS, Android, and Social Media.",
    dragDropText: "Drag & drop your logo here",
    fileLimitText: "SVG or PNG up to 10MB",
    browseFilesBtn: "Browse Files",
    socialBgLabel: "Social assets bg:",
    transparentBgLabel: "Transparent background",
    generatingBtn: "Generating Assets...",
    regenerateBtn: "Regenerate",
    generateDownloadBtn: "Generate & Download",
    errorFileLimit: "File exceeds the 10MB limit.",
    errorFileFormat: "Only SVG and PNG formats are supported.",
    successMessage: "Success! Your ZIP file has been downloaded. Extract it to see all your generated assets.",
    whatsInsideTitle: "What's inside the ZIP?",
    readyToUseTitle: "Ready to use",
    readyToUseDesc: "Includes a README.md file with instructions on where to place each asset in your project.",
    supportTitle: "Support the Project",
    supportDesc: "If this tool saved you time, consider buying me a coffee! It helps keep the servers running.",
    kofiBtn: "Support on Ko-fi",
    themeToggle: "Toggle Theme",
    customSizeLabel: "Custom size:",
    widthPlaceholder: "Width",
    heightPlaceholder: "Height",
    seoHeading: "Free Bulk Image Resizer & App Icon Generator",
    seoIntro: "Design Asset Resizer is a powerful, client-side web application designed to optimize your development and design workflows. Easily resize design assets for a wide range of platforms at once. Whether you need a favicon generator, an Android app launcher icon package, iOS App Store assets, or social media share banners (Open Graph images) in PNG or WebP formats, our tool handles it in seconds with complete privacy.",
    faqTitle: "Frequently Asked Questions",
    faqQ1: "How does the bulk image resize work?",
    faqA1: "Our resizer uses the native HTML5 Canvas API inside your web browser. When you upload a PNG or SVG logo, the image processing happens entirely on your local machine. No data or files are sent to any server, guaranteeing 100% privacy and security.",
    faqQ2: "What files are generated in the ZIP package?",
    faqA2: "The package contains 35+ ready-to-use assets, including ICO/PNG favicons for Web, iOS launcher icons (up to 1024x1024), Android mipmap icons, social media preview images (Open Graph, Twitter Cards, VK share) in PNG and optimized WebP formats, PWA icons, and any custom size you specify.",
    faqQ3: "Is there any charge or limit for using the app icon generator?",
    faqA3: "No! This tool is completely free, open-source, and does not require registration. There are no usage limits. You can process images up to 10MB in PNG or SVG formats as many times as you need.",
    faqQ4: "How do I install the generated favicons on my website?",
    faqA4: "The generated ZIP archive includes a comprehensive README.md file. It provides the exact HTML code snippet and instructions on where to copy the assets in your project directory to set them up easily.",
  },
  ru: {
    title: "Генератор Ассетов",
    subtitle: "Загрузите один SVG или PNG логотип и получите ZIP-архив с 35+ готовыми иконками для Web, iOS, Android и соцсетей.",
    dragDropText: "Перетащите логотип сюда",
    fileLimitText: "SVG или PNG до 10 МБ",
    browseFilesBtn: "Выбрать файл",
    socialBgLabel: "Фон для соцсетей:",
    transparentBgLabel: "Прозрачный фон",
    generatingBtn: "Генерация ассетов...",
    regenerateBtn: "Сгенерировать заново",
    generateDownloadBtn: "Сгенерировать и Скачать",
    errorFileLimit: "Файл превышает лимит в 10 МБ.",
    errorFileFormat: "Поддерживаются только форматы SVG и PNG.",
    successMessage: "Успех! Ваш ZIP-архив скачан. Распакуйте его, чтобы увидеть все сгенерированные ресурсы.",
    whatsInsideTitle: "Что внутри ZIP-архива?",
    readyToUseTitle: "Всё готово к работе",
    readyToUseDesc: "Включает файл README.md с инструкциями, куда поместить каждый ресурс в вашем проекте.",
    supportTitle: "Поддержать проект",
    supportDesc: "Если этот инструмент сэкономил вам время, вы можете угостить меня кофе! Это помогает поддерживать работу сервиса.",
    kofiBtn: "Поддержать на Ko-fi",
    themeToggle: "Переключить тему",
    customSizeLabel: "Свой размер:",
    widthPlaceholder: "Ширина",
    heightPlaceholder: "Высота",
    seoHeading: "Бесплатный генератор иконок приложений и пакетный ресайз картинок",
    seoIntro: "Design Asset Resizer — это современный и быстрый веб-инструмент для нарезки и оптимизации дизайн-ассетов. Вы можете сделать favicon для сайта, подготовить пакет иконок для Android и iOS, а также задействовать генератор баннеров для соцсетей (VK, Twitter, FB) в форматах PNG и WebP. Все операции проходят на вашем устройстве, гарантируя полную конфиденциальность данных.",
    faqTitle: "Часто задаваемые вопросы (FAQ)",
    faqQ1: "Как работает пакетный ресайз картинок?",
    faqA1: "Наш сервис использует стандартный HTML5 Canvas API непосредственно в вашем браузере. Когда вы загружаете PNG или SVG файл, вся обработка происходит на вашем компьютере. Исходные файлы и сгенерированные иконки не отправляются на сервера.",
    faqQ2: "Какие иконки и баннеры входят в архив?",
    faqA2: "Вы получите более 35 готовых файлов: favicon.ico и PNG-иконки для сайта, ассеты для App Store (iOS) и Google Play (Android), обложки и превью для социальных сетей (Open Graph, Twitter, VK) в форматах PNG и сжатом WebP, манифест для PWA, а также изображения с вашими кастомными размерами.",
    faqQ3: "Есть ли лимиты у генератора иконок приложений?",
    faqA3: "Инструмент абсолютно бесплатен и доступен без регистрации. Вы можете загружать файлы размером до 10 МБ (поддерживаются SVG и PNG) неограниченное число раз.",
    faqQ4: "Как установить сгенерированные favicon на сайт?",
    faqA4: "В скачанном ZIP-архиве вы найдете файл README.md с подробным описанием и готовым HTML-кодом. Скопируйте файлы в корень вашего сайта и добавьте предоставленный код в секцию <head> ваших страниц.",
  }
};

type I18nContextType = {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: keyof typeof translations["en"]) => string;
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Language>("en");

  // Load language preference from localStorage or auto-detect from system language
  useEffect(() => {
    const sysLang = navigator.language || (navigator.languages && navigator.languages[0]) || "";
    const detectedLang = sysLang.toLowerCase().includes("ru") ? "ru" : "en";
    
    const savedLang = localStorage.getItem("app_lang") as Language;
    if (savedLang && (savedLang === "en" || savedLang === "ru")) {
      setLang(savedLang);
    } else {
      setLang(detectedLang);
    }
  }, []);

  const handleSetLang = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem("app_lang", newLang);
  };

  const t = (key: keyof typeof translations["en"]): string => {
    return translations[lang][key] || translations["en"][key];
  };

  return (
    <I18nContext.Provider value={{ lang, setLang: handleSetLang, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
};
