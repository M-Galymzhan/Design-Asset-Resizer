Creates the Design Asset Resizer MVP.

Features included:

Single-page application using Next.js 15 App Router and Tailwind CSS.
Users can upload a single SVG or PNG (up to 10MB).
Backend API generates a ZIP archive on the fly containing 35+ design assets across various formats and sizes (Favicons, Android mipmap, iOS AppIcons, Social Media OG images, and PWA icons).
Handled non-square aspect ratios cleanly by applying a 'contain' strategy to avoid squishing the images.
A user can optionally select a background color used specifically for social/OG opaque images.
Built-in README.md and manifest.json included in generated ZIP.
No database or authentication setup needed; it operates as a free one-off tool.
