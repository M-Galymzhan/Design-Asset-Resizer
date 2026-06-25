<div align="center">

# Design Asset Resizer

*Free Logo to App Assets Generator*

<p align="center">
  <a href="README.md"><strong>English</strong></a> • <a href="README_ru.md">Русский</a>
</p>

[![Next.js](https://img.shields.io/badge/Next.js-15.5.19-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue?style=flat-square&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

</div>

---

## 🎨 Overview

**Design Asset Resizer** is a fast, free, and completely local MVP tool designed to generate all the necessary design assets for your application from a single logo. 

Whether you need favicons, Android mipmap icons, iOS AppIcons, or social media Open Graph images, this tool handles it all on the fly without requiring a database or authentication.

---

## 📸 Screenshots

<details>
  <summary>Click to view screenshots</summary>
  <br>

  ### 1. Initial State
  ![Initial State](docs/images/screenshot_1_empty.png)
  
  ### 2. File Uploaded & Settings
  ![Loaded State](docs/images/screenshot_2_loaded.png)
  
  ### 3. Generation Success
  ![Success State](docs/images/screenshot_3_success.png)
</details>

---

## ✨ Features

- **Single-Page Application**: Built with Next.js 15 App Router and styled with Tailwind CSS.
- **Easy Uploads**: Support for a single SVG or PNG upload (up to 10MB).
- **PWA & Offline-First**: Fully offline-capable using Service Workers. Installable as a standalone app on desktops and mobile devices (includes a dynamic manifest).
- **Comprehensive Output**: Generates a ZIP archive on the fly containing 40+ design assets:
  - Favicons
  - Android mipmap
  - iOS AppIcons
  - Social Media OG images (in both PNG and WebP formats)
  - PWA icons
- **Custom Resizing**: Enter any custom width & height to output tailored PNG and WebP assets dynamically.
- **Smart Resizing**: Handles non-square aspect ratios cleanly by applying a 'contain' strategy to prevent image squishing.
- **Custom Backgrounds**: Select an optional background color used specifically for opaque images (like Social/OG banners).
- **Ready-to-Use Archive**: The generated ZIP includes a built-in `README.md` and `manifest.json`.
- **Zero Dependencies**: No database or authentication setup needed. It operates as a free, one-off utility.

---

## 🚀 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/M-Galymzhan/Design-Asset-Resizer.git
   cd Design-Asset-Resizer
   ```

2. **Install dependencies:**
   *(Note: Use `--legacy-peer-deps` due to React 19 RC and Lucide React peer dependency constraints)*
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open the app:**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser to see the application in action.

---

## 🛠️ Built With

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Sharp](https://sharp.pixelplumbing.com/) & [@resvg/resvg-js](https://github.com/yisibl/resvg-js) for image processing
- [JSZip](https://stuk.github.io/jszip/) for archive generation
