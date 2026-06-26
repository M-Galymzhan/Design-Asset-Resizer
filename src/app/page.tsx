"use client";

import { useState, useCallback, useEffect } from "react";
import { UploadCloud, CheckCircle, FileImage, Download, Loader2, Info, Moon, Sun, Languages, Coffee, ChevronDown } from "lucide-react";
import { useTheme } from "next-themes";
import { useI18n } from "@/lib/i18n";
import { generateAllAssets } from "@/lib/imageProcessor";

export default function Home() {
  const { setTheme, resolvedTheme } = useTheme();
  const { lang, setLang, t } = useI18n();
  const [mounted, setMounted] = useState(false);

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [bgColor, setBgColor] = useState<string>("#ffffff");
  const [isTransparentBg, setIsTransparentBg] = useState<boolean>(false);
  const [status, setStatus] = useState<"idle" | "generating" | "done" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [progressMsg, setProgressMsg] = useState<string>("");
  const [customWidth, setCustomWidth] = useState<number>(512);
  const [customHeight, setCustomHeight] = useState<number>(512);
  const [isCustomSize, setIsCustomSize] = useState<boolean>(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js")
        .then((reg) => console.log("SW registered:", reg))
        .catch((err) => console.error("SW registration failed:", err));
    }
  }, []);

  const handleFileChange = useCallback((selectedFile: File) => {
    if (selectedFile.size > 10 * 1024 * 1024) {
      setStatus("error");
      setErrorMessage(t("errorFileLimit"));
      return;
    }
    if (!["image/svg+xml", "image/png"].includes(selectedFile.type)) {
      setStatus("error");
      setErrorMessage(t("errorFileFormat"));
      return;
    }
    setFile(selectedFile);
    setStatus("idle");
    setErrorMessage("");

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);
  }, [t]);

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFileChange(e.dataTransfer.files[0]);
      }
    },
    [handleFileChange]
  );

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleGenerate = async () => {
    if (!file) return;

    setStatus("generating");
    setErrorMessage("");
    setProgressMsg("Starting...");

    try {
      // Simulate slight delay to allow UI to update to "generating" state
      await new Promise((resolve) => setTimeout(resolve, 100));

      const blob = await generateAllAssets(
        file,
        isTransparentBg ? "transparent" : bgColor,
        (msg) => {
          setProgressMsg(msg);
        },
        { width: customWidth, height: customHeight, enabled: isCustomSize }
      );

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "design-assets.zip";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      setStatus("done");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "An unexpected error occurred.");
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen relative overflow-hidden transition-colors duration-200">
      
      {/* Ambient Animated Blobs for Glassmorphism depth */}
      <div className="fixed top-0 -left-4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob dark:mix-blend-screen pointer-events-none"></div>
      <div className="fixed top-0 -right-4 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000 dark:mix-blend-screen pointer-events-none"></div>
      <div className="fixed -bottom-8 left-20 w-96 h-96 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000 dark:mix-blend-screen pointer-events-none"></div>

      <div className="relative z-10">
        {/* Header / Nav */}
        <header className="flex justify-end p-4 space-x-4 max-w-6xl mx-auto">
        <button
          onClick={() => setLang(lang === "en" ? "ru" : "en")}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition flex items-center gap-2 text-sm font-medium"
          title={t("themeToggle")}
        >
          <Languages className="w-5 h-5" />
          {lang.toUpperCase()}
        </button>
        <button
          onClick={() => {
            setTheme(resolvedTheme === "dark" ? "light" : "dark");
            document.body.classList.remove("glitch-active");
            void document.body.offsetWidth; // Force reflow to restart animation
            document.body.classList.add("glitch-active");
            setTimeout(() => {
              document.body.classList.remove("glitch-active");
            }, 500);
          }}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition"
          title={t("themeToggle")}
        >
          {resolvedTheme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-4">
            {t("title")}
          </h1>
          <p className="text-lg text-slate-700 dark:text-slate-300 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        {/* Upload Box */}
        <div className="glass-panel rounded-2xl overflow-hidden p-8 mb-12 transition-all duration-300">
          <div
            onDrop={onDrop}
            onDragOver={onDragOver}
            className={`border-2 border-dashed rounded-xl p-10 text-center transition-all duration-300 ${
              previewUrl 
                ? "border-blue-500 bg-blue-50/50 dark:bg-blue-500/10" 
                : "border-gray-300/50 dark:border-white/15 hover:border-blue-400 hover:bg-white/5 dark:hover:bg-white/10"
            }`}
          >
            {!previewUrl ? (
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="p-4 bg-blue-100 dark:bg-blue-500/20 rounded-full">
                  <UploadCloud className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-lg font-medium text-slate-800 dark:text-slate-100">
                    {t("dragDropText")}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{t("fileLimitText")}</p>
                </div>
                <label className="mt-4 cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  {t("browseFilesBtn")}
                  <input
                    type="file"
                    className="hidden"
                    accept=".svg, image/svg+xml, .png, image/png"
                    onChange={(e) => e.target.files && handleFileChange(e.target.files[0])}
                  />
                </label>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-6">
                <div className="relative w-48 h-48 bg-white dark:bg-slate-50 border border-gray-200 dark:border-slate-200 rounded-lg shadow-sm p-4 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewUrl}
                    alt="Logo Preview"
                    className="max-w-full max-h-full object-contain"
                  />
                  <button
                    onClick={() => {
                      setFile(null);
                      setPreviewUrl(null);
                      setStatus("idle");
                    }}
                    className="absolute -top-3 -right-3 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 rounded-full p-1 hover:bg-red-200 dark:hover:bg-red-800 transition-colors shadow-sm"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                 <div className="flex flex-col sm:flex-row items-center gap-6 w-full max-w-md">
                   <div className="flex-1 flex flex-col gap-4 w-full">
                      <div className="flex flex-wrap items-center gap-4">
                         <div className="flex items-center gap-2">
                           <label htmlFor="bgColor" className={`text-sm font-medium whitespace-nowrap transition-opacity ${isTransparentBg ? "opacity-40" : "text-slate-800 dark:text-slate-200"}`}>{t("socialBgLabel")}</label>
                           <input
                             type="color"
                             id="bgColor"
                             value={bgColor}
                             disabled={isTransparentBg}
                             onChange={(e) => setBgColor(e.target.value)}
                             className={`h-8 w-14 rounded cursor-pointer border border-slate-300 dark:border-slate-700 p-0.5 bg-white dark:bg-slate-900 transition-opacity ${isTransparentBg ? "opacity-40 cursor-not-allowed" : ""}`}
                           />
                         </div>
                         <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-800 dark:text-slate-200">
                           <input
                             type="checkbox"
                             checked={isTransparentBg}
                             onChange={(e) => setIsTransparentBg(e.target.checked)}
                             className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 h-4 w-4"
                           />
                           {t("transparentBgLabel")}
                         </label>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-slate-200/50 dark:border-white/10 w-full">
                        <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-800 dark:text-slate-200">
                          <input
                            type="checkbox"
                            checked={isCustomSize}
                            onChange={(e) => setIsCustomSize(e.target.checked)}
                            className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 h-4 w-4"
                          />
                          {t("customSizeLabel")}
                        </label>
                        {isCustomSize && (
                          <div className="flex items-center gap-2 transition-all duration-300">
                            <input
                              type="number"
                              min="1"
                              max="4000"
                              placeholder={t("widthPlaceholder")}
                              value={customWidth || ""}
                              onChange={(e) => setCustomWidth(Math.max(1, parseInt(e.target.value) || 0))}
                              className="w-16 px-2 py-0.5 text-sm border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
                            />
                            <span className="text-slate-400">×</span>
                            <input
                              type="number"
                              min="1"
                              max="4000"
                              placeholder={t("heightPlaceholder")}
                              value={customHeight || ""}
                              onChange={(e) => setCustomHeight(Math.max(1, parseInt(e.target.value) || 0))}
                              className="w-16 px-2 py-0.5 text-sm border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
                            />
                            <span className="text-xs text-slate-500">px</span>
                          </div>
                        )}
                      </div>
                   </div>
                   <div className="flex flex-col w-full sm:w-auto">
                      <button
                        onClick={handleGenerate}
                        disabled={status === "generating"}
                        className={`inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-lg text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 hover:scale-105 active:scale-95 ${
                          status === "generating" ? "bg-blue-400 shadow-blue-400/30 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 shadow-blue-500/40"
                        }`}
                      >
                        {status === "generating" ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            {t("generatingBtn")}
                          </>
                        ) : status === "done" ? (
                          <>
                            <CheckCircle className="w-5 h-5 mr-2" />
                            {t("regenerateBtn")}
                          </>
                        ) : (
                          <>
                            <Download className="w-5 h-5 mr-2" />
                            {t("generateDownloadBtn")}
                          </>
                        )}
                      </button>
                      
                      {status === "generating" && (
                        <p className="text-xs text-blue-600 dark:text-blue-400 text-center mt-2 animate-pulse">
                          {progressMsg}
                        </p>
                      )}
                   </div>
                </div>
              </div>
            )}
          </div>

          {status === "error" && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md">
              <p className="text-sm text-red-600 dark:text-red-400">{errorMessage}</p>
            </div>
          )}

          {status === "done" && (
             <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-md flex items-start">
               <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
               <p className="text-sm text-green-700 dark:text-green-300">{t("successMessage")}</p>
             </div>
          )}
        </div>

        {/* What's Inside Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8 flex items-center justify-center gap-2">
            <Info className="w-6 h-6 text-blue-500" /> {t("whatsInsideTitle")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             <div className="glass-panel p-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 border-b dark:border-white/10 pb-2"><FileImage className="w-5 h-5 text-gray-500"/> Favicons (Web)</h3>
                <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-2">
                  <li><code>favicon.ico</code> (16, 32, 48px)</li>
                  <li><code>favicon-16x16.png</code></li>
                  <li><code>favicon-32x32.png</code></li>
                  <li><code>favicon-96x96.png</code></li>
                  <li><code>apple-touch-icon.png</code></li>
                  <li><code>safari-pinned-tab.svg</code></li>
                </ul>
             </div>

             <div className="glass-panel p-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 border-b dark:border-white/10 pb-2"><FileImage className="w-5 h-5 text-blue-500"/> Social & OG</h3>
                <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-2">
                  <li><code>og-image.png</code> (1200x630)</li>
                  <li><code>twitter-card.png</code> (1200x600)</li>
                  <li><code>vk-share.png</code> (510x228)</li>
                </ul>
             </div>

             <div className="glass-panel p-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 border-b dark:border-white/10 pb-2"><FileImage className="w-5 h-5 text-green-500"/> Android</h3>
                <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-2">
                  <li><code>mipmap-.../ic_launcher</code> (48-192)</li>
                  <li><code>playstore-icon.png</code> (512)</li>
                </ul>
             </div>

             <div className="glass-panel p-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 border-b dark:border-white/10 pb-2"><FileImage className="w-5 h-5 text-gray-800 dark:text-gray-300"/> iOS</h3>
                <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-2">
                  <li><code>icon-...@2x.png</code> & <code>@3x</code></li>
                  <li><code>appstore-icon.png</code> (1024)</li>
                </ul>
             </div>

             <div className="glass-panel p-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 border-b dark:border-white/10 pb-2"><FileImage className="w-5 h-5 text-purple-500"/> PWA (Manifest)</h3>
                <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-2">
                  <li><code>icon-192.png</code></li>
                  <li><code>icon-512.png</code></li>
                  <li><code>maskable-icon-512.png</code></li>
                  <li><code>manifest.json</code></li>
                </ul>
             </div>

             <div className="glass-panel p-6 rounded-xl flex flex-col justify-center items-center text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1 relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-500/5 dark:bg-blue-500/10 pointer-events-none"></div>
                <h3 className="font-semibold text-lg mb-2 text-blue-900 dark:text-blue-200 relative z-10">{t("readyToUseTitle")}</h3>
                <p className="text-sm text-blue-700 dark:text-blue-300 relative z-10">{t("readyToUseDesc")}</p>
             </div>
          </div>
        </div>

        {/* Dynamic JSON-LD Schema Markup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "SoftwareApplication",
                  "@id": "https://design-asset-resizer.vercel.app/#website",
                  "url": "https://design-asset-resizer.vercel.app/",
                  "name": t("title"),
                  "applicationCategory": "DeveloperApplication",
                  "operatingSystem": "All",
                  "browserRequirements": "requires HTML5 Canvas API",
                  "offers": {
                    "@type": "Offer",
                    "price": "0",
                    "priceCurrency": "USD"
                  },
                  "description": t("subtitle")
                },
                {
                  "@type": "FAQPage",
                  "@id": "https://design-asset-resizer.vercel.app/#faq",
                  "mainEntity": [
                    {
                      "@type": "Question",
                      "name": t("faqQ1"),
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": t("faqA1")
                      }
                    },
                    {
                      "@type": "Question",
                      "name": t("faqQ2"),
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": t("faqA2")
                      }
                    },
                    {
                      "@type": "Question",
                      "name": t("faqQ3"),
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": t("faqA3")
                      }
                    },
                    {
                      "@type": "Question",
                      "name": t("faqQ4"),
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": t("faqA4")
                      }
                    }
                  ]
                }
              ]
            })
          }}
        />

        {/* SEO Text Block */}
        <section className="mt-20 glass-panel p-8 rounded-2xl">
          <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">
            {t("seoHeading")}
          </h2>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm md:text-base">
            {t("seoIntro")}
          </p>
        </section>

        {/* FAQ Accordion Section */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-center mb-8 text-slate-900 dark:text-slate-100">
            {t("faqTitle")}
          </h2>
          <div className="space-y-4 max-w-3xl mx-auto">
            {[
              { q: t("faqQ1"), a: t("faqA1") },
              { q: t("faqQ2"), a: t("faqA2") },
              { q: t("faqQ3"), a: t("faqA3") },
              { q: t("faqQ4"), a: t("faqA4") },
            ].map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={idx} 
                  className="glass-panel rounded-xl overflow-hidden transition-all duration-300 border border-slate-200/50 dark:border-white/10"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex justify-between items-center p-5 text-left font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors duration-200"
                    aria-expanded={isOpen}
                  >
                    <span className="pr-4">{faq.q}</span>
                    <ChevronDown 
                      className={`w-5 h-5 text-slate-500 flex-shrink-0 transition-transform duration-300 ${
                        isOpen ? "transform rotate-180" : ""
                      }`} 
                    />
                  </button>
                  <div 
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      isOpen ? "max-h-96 border-t border-slate-200/30 dark:border-white/5" : "max-h-0"
                    }`}
                  >
                    <p className="p-5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Donation / Support Section */}
         <div className="mt-20 pt-10 border-t border-slate-200 dark:border-white/10 text-center">
           <h2 className="text-2xl font-bold mb-4">{t("supportTitle")}</h2>
           <p className="text-slate-700 dark:text-slate-300 mb-8 max-w-xl mx-auto">
              {t("supportDesc")}
           </p>
           
            <div className="flex items-center justify-center">
              {/* Ko-fi Button */}
              <a 
                href="https://ko-fi.com/glmm1" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF5E5B] hover:bg-[#ff4542] text-white font-bold rounded-lg shadow-lg shadow-[#FF5E5B]/40 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <Coffee className="w-5 h-5" />
                {t("kofiBtn")}
              </a>
            </div>
        </div>
        
      </main>
      </div>
    </div>
  );
}
