import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { Resvg } from "@resvg/resvg-js";
import JSZip from "jszip";
import toIco from "to-ico";

export const maxDuration = 60; // Set max duration for Vercel, if Pro tier it uses 60s, Hobby ignores and uses 10s.

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// Basic in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record) {
    rateLimitMap.set(ip, { count: 1, timestamp: now });
    return true;
  }

  if (now - record.timestamp > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, timestamp: now });
    return true;
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  record.count += 1;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    if (ip !== "unknown" && !checkRateLimit(ip)) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const bgColor = (formData.get("bgColor") as string) || "#ffffff";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File size exceeds 10MB limit" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let baseImageBuffer: Buffer;
    let isSvg = false;
    let originalSvgBuffer: Buffer | null = null;

    // Check Magic Bytes or MIME type
    if (file.type === "image/svg+xml" || file.name.toLowerCase().endsWith(".svg")) {
      isSvg = true;
      originalSvgBuffer = buffer;
      try {
        const resvg = new Resvg(buffer, {
          fitTo: { mode: "width", value: 1024 },
        });
        const pngData = resvg.render();
        baseImageBuffer = pngData.asPng();
      } catch (e) {
        console.error("SVG Parse Error:", e);
        return NextResponse.json({ error: "Invalid SVG file" }, { status: 400 });
      }
    } else if (file.type === "image/png" || file.name.toLowerCase().endsWith(".png")) {
      // Basic PNG magic bytes check (89 50 4E 47 0D 0A 1A 0A)
      if (buffer.length < 8 || buffer[0] !== 0x89 || buffer[1] !== 0x50 || buffer[2] !== 0x4e || buffer[3] !== 0x47) {
         return NextResponse.json({ error: "Invalid PNG file format" }, { status: 400 });
      }
      baseImageBuffer = buffer;
    } else {
      return NextResponse.json({ error: "Unsupported file format. Please upload SVG or PNG." }, { status: 400 });
    }

    // Normalize base image (to 1024x1024 with transparent padding if not square)
    const normalizedBuffer = await sharp(baseImageBuffer)
      .resize(1024, 1024, {
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .toBuffer();

    const zip = new JSZip();

    // Manifest and README
    const manifestJson = {
      name: "App Name",
      short_name: "App",
      icons: [
        { src: "/pwa/icon-192.png", sizes: "192x192", type: "image/png" },
        { src: "/pwa/icon-512.png", sizes: "512x512", type: "image/png" },
        { src: "/pwa/maskable-icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" }
      ],
      theme_color: "#ffffff",
      background_color: "#ffffff",
      display: "standalone"
    };
    zip.file("manifest.json", JSON.stringify(manifestJson, null, 2));

    const readmeContent = `# Design Asset Resizer

Here are your generated assets!

## Structure
- **favicons/**: Standard website favicons. Include \`favicon.ico\` in your root directory, and link the PNGs in your HTML \`<head>\`.
- **social/**: Open Graph and Twitter card images. Use these in \`<meta property="og:image">\` and \`<meta name="twitter:image">\`.
- **android/**: Android app icons (mipmap folders).
- **ios/**: iOS App Store and home screen icons.
- **pwa/**: Icons for Web App Manifest (PWA).

Enjoy!`;
    zip.file("README.md", readmeContent);


    // Helper function for transparent assets
    const createAsset = (size: number, width?: number, height?: number) => {
        return sharp(normalizedBuffer).resize(width || size, height || size, { fit: 'contain', background: { r:0, g:0, b:0, alpha:0 } }).png().toBuffer();
    }

    // Helper function for social/opaque assets
    const createOpaqueAsset = (width: number, height: number, bg: string) => {
        // Parse hex color
        let r=255, g=255, b=255;
        if (bg.startsWith('#') && bg.length === 7) {
            r = parseInt(bg.slice(1,3), 16);
            g = parseInt(bg.slice(3,5), 16);
            b = parseInt(bg.slice(5,7), 16);
        }
        return sharp(normalizedBuffer)
            .resize(width, height, { fit: 'contain', background: { r:0, g:0, b:0, alpha:0 } })
            .flatten({ background: { r, g, b, alpha: 1 } })
            .png()
            .toBuffer();
    }


    // Generate all assets in parallel
    const [
      fav16, fav32, fav48, fav96, appleTouch,
      ogImage, twitterCard, vkShare,
      and48, and72, and96, and144, and192, and512,
      ios20x2, ios20x3, ios29x2, ios29x3, ios40x2, ios40x3, ios60x2, ios60x3, ios76x2, ios83_5x2, ios1024,
      pwa192, pwa512,
    ] = await Promise.all([
      // Favicons
      createAsset(16), createAsset(32), createAsset(48), createAsset(96), createAsset(180),
      // Social
      createOpaqueAsset(1200, 630, bgColor), createOpaqueAsset(1200, 600, bgColor), createOpaqueAsset(510, 228, bgColor),
      // Android
      createAsset(48), createAsset(72), createAsset(96), createAsset(144), createAsset(192), createAsset(512),
      // iOS
      createAsset(40), createAsset(60), createAsset(58), createAsset(87), createAsset(80), createAsset(120), createAsset(120), createAsset(180), createAsset(152), createAsset(167), createAsset(1024),
      // PWA
      createAsset(192), createAsset(512),
    ]);

    // Favicon ICO (multi-resolution: 16, 32, 48)
    const icoBuffer = await toIco([fav16, fav32, fav48]);

    // Add files to ZIP
    const favicons = zip.folder("favicons");
    favicons?.file("favicon.ico", icoBuffer);
    favicons?.file("favicon-16x16.png", fav16);
    favicons?.file("favicon-32x32.png", fav32);
    favicons?.file("favicon-96x96.png", fav96);
    favicons?.file("apple-touch-icon.png", appleTouch);
    if (isSvg && originalSvgBuffer) {
        favicons?.file("safari-pinned-tab.svg", originalSvgBuffer);
    }

    const social = zip.folder("social");
    social?.file("og-image.png", ogImage);
    social?.file("twitter-card.png", twitterCard);
    social?.file("vk-share.png", vkShare);

    const android = zip.folder("android");
    android?.folder("mipmap-mdpi")?.file("ic_launcher.png", and48);
    android?.folder("mipmap-hdpi")?.file("ic_launcher.png", and72);
    android?.folder("mipmap-xhdpi")?.file("ic_launcher.png", and96);
    android?.folder("mipmap-xxhdpi")?.file("ic_launcher.png", and144);
    android?.folder("mipmap-xxxhdpi")?.file("ic_launcher.png", and192);
    android?.file("playstore-icon.png", and512);

    const ios = zip.folder("ios");
    ios?.file("icon-20@2x.png", ios20x2);
    ios?.file("icon-20@3x.png", ios20x3);
    ios?.file("icon-29@2x.png", ios29x2);
    ios?.file("icon-29@3x.png", ios29x3);
    ios?.file("icon-40@2x.png", ios40x2);
    ios?.file("icon-40@3x.png", ios40x3);
    ios?.file("icon-60@2x.png", ios60x2);
    ios?.file("icon-60@3x.png", ios60x3);
    ios?.file("icon-76@2x.png", ios76x2);
    ios?.file("icon-83.5@2x.png", ios83_5x2);
    ios?.file("appstore-icon.png", ios1024);

    const pwa = zip.folder("pwa");
    pwa?.file("icon-192.png", pwa192);
    pwa?.file("icon-512.png", pwa512);

    // Maskable icon (PWA) - Needs a safe zone, we simulate by adding padding
    const pwaMaskable = await sharp(normalizedBuffer)
      .resize(512, 512, { fit: 'contain', background: { r:0, g:0, b:0, alpha:0 } })
      .extend({
        top: 51, bottom: 51, left: 51, right: 51, // approx 10% padding
        background: { r:0, g:0, b:0, alpha:0 }
      })
      .resize(512, 512) // Resize back to 512x512 after extending
      .png()
      .toBuffer();
    pwa?.file("maskable-icon-512.png", pwaMaskable);


    // Generate final zip buffer
    const zipBuffer = await zip.generateAsync({ type: "nodebuffer", compression: "STORE" }); // STORE is faster, zip doesn't compress PNGs well anyway

    return new NextResponse(new Uint8Array(zipBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": 'attachment; filename="design-assets.zip"',
      },
    });

  } catch (error) {
    console.error("Error generating assets:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
