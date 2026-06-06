"use client";

import { useState, useCallback } from "react";
import { UploadCloud, CheckCircle, FileImage, Download, Loader2, Info } from "lucide-react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [bgColor, setBgColor] = useState<string>("#ffffff");
  const [status, setStatus] = useState<"idle" | "generating" | "done" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleFileChange = useCallback((selectedFile: File) => {
    if (selectedFile.size > 10 * 1024 * 1024) {
      setStatus("error");
      setErrorMessage("File exceeds the 10MB limit.");
      return;
    }
    if (!["image/svg+xml", "image/png"].includes(selectedFile.type)) {
      setStatus("error");
      setErrorMessage("Only SVG and PNG formats are supported.");
      return;
    }
    setFile(selectedFile);
    setStatus("idle");
    setErrorMessage("");

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);
  }, []);

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

    const formData = new FormData();
    formData.append("file", file);
    formData.append("bgColor", bgColor);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate assets.");
      }

      const blob = await response.blob();
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

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <main className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-4">
            Design Asset Resizer
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload a single SVG or PNG logo and get a ZIP archive with 35+ perfectly sized assets for Web, iOS, Android, and Social Media.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 p-8 mb-12">
          <div
            onDrop={onDrop}
            onDragOver={onDragOver}
            className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors ${
              previewUrl ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
            }`}
          >
            {!previewUrl ? (
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="p-4 bg-blue-100 rounded-full">
                  <UploadCloud className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-700">
                    Drag & drop your logo here
                  </p>
                  <p className="text-sm text-gray-500 mt-1">SVG or PNG up to 10MB</p>
                </div>
                <label className="mt-4 cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Browse Files
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
                <div className="relative w-48 h-48 bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex items-center justify-center">
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
                    className="absolute -top-3 -right-3 bg-red-100 text-red-600 rounded-full p-1 hover:bg-red-200 transition-colors shadow-sm"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-md">
                   <div className="flex items-center gap-2">
                      <label htmlFor="bgColor" className="text-sm font-medium text-gray-700 whitespace-nowrap">Social assets bg:</label>
                      <input
                        type="color"
                        id="bgColor"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="h-8 w-14 rounded cursor-pointer border border-gray-300 p-0.5"
                      />
                   </div>
                   <div className="flex-1"></div>
                   <button
                      onClick={handleGenerate}
                      disabled={status === "generating"}
                      className={`inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                        status === "generating" ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                      }`}
                    >
                      {status === "generating" ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Generating Assets...
                        </>
                      ) : status === "done" ? (
                         <>
                           <CheckCircle className="w-5 h-5 mr-2" />
                           Regenerate
                         </>
                      ) : (
                        <>
                          <Download className="w-5 h-5 mr-2" />
                          Generate & Download
                        </>
                      )}
                    </button>
                </div>
              </div>
            )}
          </div>

          {status === "error" && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{errorMessage}</p>
            </div>
          )}

          {status === "done" && (
             <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md flex items-start">
               <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
               <p className="text-sm text-green-700">Success! Your ZIP file has been downloaded. Extract it to see all your generated assets.</p>
             </div>
          )}
        </div>

        {/* What's Inside Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8 flex items-center justify-center gap-2">
            <Info className="w-6 h-6 text-blue-500" /> What&apos;s inside the ZIP?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 border-b pb-2"><FileImage className="w-5 h-5 text-gray-500"/> Favicons (Web)</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li><code>favicon.ico</code> (16, 32, 48px)</li>
                  <li><code>favicon-16x16.png</code></li>
                  <li><code>favicon-32x32.png</code></li>
                  <li><code>favicon-96x96.png</code></li>
                  <li><code>apple-touch-icon.png</code></li>
                  <li><code>safari-pinned-tab.svg</code> (if SVG)</li>
                </ul>
             </div>

             <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 border-b pb-2"><FileImage className="w-5 h-5 text-blue-500"/> Social & OG</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li><code>og-image.png</code> (1200x630)</li>
                  <li><code>twitter-card.png</code> (1200x600)</li>
                  <li><code>vk-share.png</code> (510x228)</li>
                </ul>
             </div>

             <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 border-b pb-2"><FileImage className="w-5 h-5 text-green-500"/> Android</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li><code>mipmap-mdpi/...</code> (48x48)</li>
                  <li><code>mipmap-hdpi/...</code> (72x72)</li>
                  <li><code>mipmap-xhdpi/...</code> (96x96)</li>
                  <li><code>mipmap-xxhdpi/...</code> (144x144)</li>
                  <li><code>mipmap-xxxhdpi/...</code> (192x192)</li>
                  <li><code>playstore-icon.png</code> (512)</li>
                </ul>
             </div>

             <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 border-b pb-2"><FileImage className="w-5 h-5 text-gray-800"/> iOS</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li><code>icon-20@2x.png</code> & <code>@3x</code></li>
                  <li><code>icon-29@2x.png</code> & <code>@3x</code></li>
                  <li><code>icon-40@2x.png</code> & <code>@3x</code></li>
                  <li><code>icon-60@2x.png</code> & <code>@3x</code></li>
                  <li><code>icon-76@2x.png</code></li>
                  <li><code>icon-83.5@2x.png</code></li>
                  <li><code>appstore-icon.png</code> (1024)</li>
                </ul>
             </div>

             <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 border-b pb-2"><FileImage className="w-5 h-5 text-purple-500"/> PWA (Manifest)</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li><code>icon-192.png</code></li>
                  <li><code>icon-512.png</code></li>
                  <li><code>maskable-icon-512.png</code></li>
                  <li><code>manifest.json</code></li>
                </ul>
             </div>

             <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-center items-center text-center">
                <h3 className="font-semibold text-lg mb-2">Ready to use</h3>
                <p className="text-sm text-gray-500 mb-4">Includes a <code>README.md</code> file with instructions on where to place each asset in your project.</p>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
