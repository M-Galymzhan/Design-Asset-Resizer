# Project Memory: Design Asset Resizer

## 📝 Overview
**Design Asset Resizer** is a free, fast, completely client-side Web Application that resizes a single SVG/PNG logo into 40+ app icons and social banners (favicons, Android, iOS, Social OG, and PWAs) and packages them into a ZIP file. It operates locally using HTML5 Canvas and JSZip.

## 🛠️ Tech Stack
- **Framework**: Next.js 15.5.19 (App Router)
- **Library**: React 19.0.0 (Stable)
- **Styling**: Tailwind CSS 3.4.1 (with custom Glassmorphic variables)
- **Client Processing**: JSZip 3.10.1 (archiving), native Canvas (resizing)
- **Hosting**: Deployed on Vercel: [design-asset-resizer.vercel.app](https://design-asset-resizer.vercel.app/)

## 🚀 Accomplishments & Decisions
1. **Premium UI/UX (Glassmorphism)**: Overhauled the flat layout to a modern frosted glass UI with smooth micro-interactions, scale transitions, and animated background gradient blobs (blue, emerald, indigo).
2. **Theme Toggling Fixed**: Switched from system media queries (`@media (prefers-color-scheme: dark)`) to class-based toggling (`.dark`), resolving the issue where the light theme setting resulted in a dark theme.
3. **Optimized Dark Mode**: Kept the popular light frosted glass card styling (12% white opacity, 18% white borders) on the deep dark background (`#0B0F19`) in dark mode to ensure high readability and contrast.
4. **PWA & Offline Support**: Added dynamic Web App Manifest ([manifest.ts](file:///f:/Downloads/TEST_PROJECT/src/app/manifest.ts)) and a custom Service Worker ([sw.js](file:///f:/Downloads/TEST_PROJECT/public/sw.js)) allowing one-click installation on PC/mobile and full offline usage.
5. **WebP Social Assets**: In addition to PNG, social media assets (OG, Twitter cards, VK share) are now generated in WebP format for optimal compression.
6. **Custom Resizing**: Added checkboxes and numeric inputs to the UI allowing users to resize their logo to any custom size (e.g. `500x500.png` and `.webp`).
7. **SEO Site Verifications**: Added verification keys for Google and Yandex in [layout.tsx](file:///f:/Downloads/TEST_PROJECT/src/app/layout.tsx), successfully indexing the live website on Vercel.
8. **Git Author Cleaned**: Configured global git settings to sign commits as `M-Galymzhan <galymzhan.manarbekuly@gmail.com>` and force-pushed the history to GitHub, linking commits to the user's profile.

## 📌 Backlog / Future Steps
1. **On-Page SEO Keywords**: Add content text blocks containing target key phrases (`resize design assets`, `social media banner resizer`, `bulk image resize`, `генератор иконок приложений`, `пакетный ресайз картинок`) in Russian and English.
2. **FAQ Section**: Build a beautiful dropdown accordion FAQ section at the bottom of the page containing these keywords naturally.
3. **JSON-LD Schema Markup**: Embed structured microdata (`SoftwareApplication` and `FAQPage` schemas) in the HTML head to display rich snippets and FAQ accordions in Google and Yandex search results.
