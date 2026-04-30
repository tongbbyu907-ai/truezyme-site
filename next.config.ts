import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // 사진을 Serverless Function 번들에서 제외 (public/은 그대로 정적 서빙됨)
  outputFileTracingExcludes: {
    "*": [
      path.join(process.cwd(), "public/photos/**/*"),
      "node_modules/@swc/core-linux-x64-gnu",
      "node_modules/@swc/core-linux-x64-musl",
    ],
  },
  outputFileTracingRoot: process.cwd(),
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
