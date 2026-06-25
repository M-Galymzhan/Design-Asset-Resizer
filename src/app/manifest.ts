import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Design Asset Resizer",
    short_name: "Asset Resizer",
    description: "Upload a single SVG or PNG logo and instantly generate a ZIP archive with 35+ perfectly sized assets for Web, iOS, Android, and Social Media.",
    start_url: "/",
    display: "standalone",
    background_color: "#0B0F19",
    theme_color: "#0B0F19",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
