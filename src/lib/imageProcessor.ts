import JSZip from "jszip";

// Helper to convert File/Blob to HTMLImageElement
const loadImage = (file: File): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      resolve(img);
    };
    img.onerror = (err) => {
      reject(err);
    };
    img.src = url;
  });
};

// Converts Canvas to Blob
const canvasToBlob = (canvas: HTMLCanvasElement, type = "image/png"): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Canvas to Blob failed"));
    }, type);
  });
};

// Generates an asset by drawing the image centered and contained
const createAsset = async (img: HTMLImageElement, width: number, height: number, bgColor: string | null = null, paddingRatio = 0, mimeType = "image/png"): Promise<Blob> => {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get 2d context");

  // Fill background if specified
  if (bgColor && bgColor !== "transparent") {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);
  }

  // Calculate "contain" dimensions
  const padX = width * paddingRatio;
  const padY = height * paddingRatio;
  const availWidth = width - padX * 2;
  const availHeight = height - padY * 2;

  const scale = Math.min(availWidth / img.width, availHeight / img.height);
  const drawWidth = img.width * scale;
  const drawHeight = img.height * scale;
  
  const x = (width - drawWidth) / 2;
  const y = (height - drawHeight) / 2;

  ctx.drawImage(img, x, y, drawWidth, drawHeight);

  return canvasToBlob(canvas, mimeType);
};

// Generates an ICO file containing multiple PNGs
const createIcoFromPngs = async (pngBlobs: Blob[]): Promise<Blob> => {
  const buffers = await Promise.all(pngBlobs.map(b => b.arrayBuffer()));
  
  // Calculate total size
  const headerSize = 6;
  const directorySize = 16 * buffers.length;
  const imageSize = buffers.reduce((acc, buf) => acc + buf.byteLength, 0);
  const totalSize = headerSize + directorySize + imageSize;

  const icoBuffer = new ArrayBuffer(totalSize);
  const view = new DataView(icoBuffer);
  const uint8View = new Uint8Array(icoBuffer);

  // Header
  view.setUint16(0, 0, true); // Reserved
  view.setUint16(2, 1, true); // Type ICO
  view.setUint16(4, buffers.length, true); // Image count

  let offset = headerSize + directorySize;
  
  buffers.forEach((buf, i) => {
    // Read dimensions from PNG header (bytes 16-23)
    const pngView = new DataView(buf);
    const w = pngView.getUint32(16, false);
    const h = pngView.getUint32(20, false);
    
    const dirOffset = headerSize + i * 16;
    view.setUint8(dirOffset, w >= 256 ? 0 : w); // width
    view.setUint8(dirOffset + 1, h >= 256 ? 0 : h); // height
    view.setUint8(dirOffset + 2, 0); // palette count
    view.setUint8(dirOffset + 3, 0); // reserved
    view.setUint16(dirOffset + 4, 1, true); // color planes
    view.setUint16(dirOffset + 6, 32, true); // bpp
    view.setUint32(dirOffset + 8, buf.byteLength, true); // size
    view.setUint32(dirOffset + 12, offset, true); // offset

    // Copy image data
    uint8View.set(new Uint8Array(buf), offset);
    offset += buf.byteLength;
  });

  return new Blob([icoBuffer], { type: "image/x-icon" });
};

export const generateAllAssets = async (
  file: File,
  bgColor: string,
  onProgress: (msg: string) => void,
  customSize: { width: number; height: number; enabled: boolean } | null = null
): Promise<Blob> => {
  onProgress("Loading image...");
  const img = await loadImage(file);
  
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

  const readmeContent = `# Design Asset Resizer\n\nHere are your generated assets!\n\n## Structure\n- **favicons/**: Standard website favicons. Include \`favicon.ico\` in your root directory, and link the PNGs in your HTML \`<head>\`.\n- **social/**: Open Graph and Twitter card images (in PNG and WebP formats). Use these in \`<meta property="og:image">\` and \`<meta name="twitter:image">\`.\n- **android/**: Android app icons (mipmap folders).\n- **ios/**: iOS App Store and home screen icons.\n- **pwa/**: Icons for Web App Manifest (PWA).\n- **custom/**: Custom resized assets if requested.\n\nEnjoy!`;
  zip.file("README.md", readmeContent);

  // Favicons
  onProgress("Generating Favicons...");
  const fav16 = await createAsset(img, 16, 16);
  const fav32 = await createAsset(img, 32, 32);
  const fav48 = await createAsset(img, 48, 48);
  const fav96 = await createAsset(img, 96, 96);
  const appleTouch = await createAsset(img, 180, 180);
  const icoBlob = await createIcoFromPngs([fav16, fav32, fav48]);

  const favicons = zip.folder("favicons");
  favicons?.file("favicon.ico", icoBlob);
  favicons?.file("favicon-16x16.png", fav16);
  favicons?.file("favicon-32x32.png", fav32);
  favicons?.file("favicon-96x96.png", fav96);
  favicons?.file("apple-touch-icon.png", appleTouch);
  if (file.type.includes("svg")) {
      favicons?.file("safari-pinned-tab.svg", file);
  }

  // Social
  onProgress("Generating Social Assets...");
  socialGenerate: {
    const social = zip.folder("social");
    social?.file("og-image.png", await createAsset(img, 1200, 630, bgColor));
    social?.file("og-image.webp", await createAsset(img, 1200, 630, bgColor, 0, "image/webp"));
    social?.file("twitter-card.png", await createAsset(img, 1200, 600, bgColor));
    social?.file("twitter-card.webp", await createAsset(img, 1200, 600, bgColor, 0, "image/webp"));
    social?.file("vk-share.png", await createAsset(img, 510, 228, bgColor));
    social?.file("vk-share.webp", await createAsset(img, 510, 228, bgColor, 0, "image/webp"));
  }

  // Android
  onProgress("Generating Android Assets...");
  androidGenerate: {
    const android = zip.folder("android");
    android?.folder("mipmap-mdpi")?.file("ic_launcher.png", await createAsset(img, 48, 48));
    android?.folder("mipmap-hdpi")?.file("ic_launcher.png", await createAsset(img, 72, 72));
    android?.folder("mipmap-xhdpi")?.file("ic_launcher.png", await createAsset(img, 96, 96));
    android?.folder("mipmap-xxhdpi")?.file("ic_launcher.png", await createAsset(img, 144, 144));
    android?.folder("mipmap-xxxhdpi")?.file("ic_launcher.png", await createAsset(img, 192, 192));
    android?.file("playstore-icon.png", await createAsset(img, 512, 512));
  }

  // iOS
  onProgress("Generating iOS Assets...");
  iosGenerate: {
    const ios = zip.folder("ios");
    ios?.file("icon-20@2x.png", await createAsset(img, 40, 40));
    ios?.file("icon-20@3x.png", await createAsset(img, 60, 60));
    ios?.file("icon-29@2x.png", await createAsset(img, 58, 58));
    ios?.file("icon-29@3x.png", await createAsset(img, 87, 87));
    ios?.file("icon-40@2x.png", await createAsset(img, 80, 80));
    ios?.file("icon-40@3x.png", await createAsset(img, 120, 120));
    ios?.file("icon-60@2x.png", await createAsset(img, 120, 120));
    ios?.file("icon-60@3x.png", await createAsset(img, 180, 180));
    ios?.file("icon-76@2x.png", await createAsset(img, 152, 152));
    ios?.file("icon-83.5@2x.png", await createAsset(img, 167, 167));
    ios?.file("appstore-icon.png", await createAsset(img, 1024, 1024));
  }

  // PWA
  onProgress("Generating PWA Assets...");
  pwaGenerate: {
    const pwa = zip.folder("pwa");
    pwa?.file("icon-192.png", await createAsset(img, 192, 192));
    pwa?.file("icon-512.png", await createAsset(img, 512, 512));
    pwa?.file("maskable-icon-512.png", await createAsset(img, 512, 512, null, 0.1)); // 10% padding
  }

  // Custom Size
  if (customSize && customSize.enabled && customSize.width > 0 && customSize.height > 0) {
    onProgress(`Generating custom asset (${customSize.width}x${customSize.height})...`);
    const customFolder = zip.folder("custom");
    const customPng = await createAsset(img, customSize.width, customSize.height, bgColor);
    const customWebp = await createAsset(img, customSize.width, customSize.height, bgColor, 0, "image/webp");
    customFolder?.file(`logo-${customSize.width}x${customSize.height}.png`, customPng);
    customFolder?.file(`logo-${customSize.width}x${customSize.height}.webp`, customWebp);
  }

  onProgress("Zipping files...");
  const zipBlob = await zip.generateAsync({ type: "blob", compression: "STORE" });
  
  return zipBlob;
};
