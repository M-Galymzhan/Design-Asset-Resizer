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
