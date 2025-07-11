import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      // For WebContainer routes
      {
        source: "/login/(.*)",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups",
          },
        ],
      },
      {
        source: "/((?!login).*)",
        headers: [
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "require-corp",
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origdin",
          },
        ],
      },
      // For Google login and popup communication
    ];
  },
};

export default nextConfig;
