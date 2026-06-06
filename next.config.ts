import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['@resvg/resvg-js', 'sharp', 'to-ico']
};

export default nextConfig;
