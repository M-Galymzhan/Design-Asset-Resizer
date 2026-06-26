# Handoff: SEO Keywords & FAQ Implementation

## 🎯 Current Focus
Implement On-Page SEO optimization by adding keyword-rich text blocks and a structured FAQ section to the landing page to rank first on Google and Yandex search lists for key phrases:
- *English*: `resize design assets`, `social media banner resizer`, `bulk image resize`, `app icon generator`, `favicon generator`.
- *Russian*: `генератор иконок приложений`, `сделать favicon для сайта`, `пакетный ресайз картинок`, `генератор баннеров для соцсетей`.

## 📋 Next Action Items
1. **Extend i18n Translations**:
   Update [i18n.tsx](file:///f:/Downloads/TEST_PROJECT/src/lib/i18n.tsx) with FAQ questions and answers, and promotional SEO text blocks in both `en` and `ru` locales.
2. **Build Accordion FAQ Component**:
   Implement a smooth, animated, glassmorphic dropdown accordion FAQ block at the bottom of [page.tsx](file:///f:/Downloads/TEST_PROJECT/src/app/page.tsx).
3. **Embed JSON-LD Schema**:
   Add structured microdata to the HTML head:
   - `SoftwareApplication` (identifies a free utility app)
   - `FAQPage` (maps the FAQ questions/answers for Google/Yandex search result rich snippets).
4. **Deploy & Push**:
   Test compilation, commit, and push to GitHub (`origin main`) to update the live Vercel site.
