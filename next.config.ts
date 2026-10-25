import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Serve images at the highest quality — no compression artifacts
    qualities: [100],
    // Include the actual image width (1240px) so Next.js won't upscale
    deviceSizes: [640, 750, 828, 1080, 1240, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 620, 1240],
  },
};

export default nextConfig;
