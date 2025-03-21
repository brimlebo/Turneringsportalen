import type { NextConfig } from "next";
import { execSync } from 'child_process';

const getGitHash = () => {
    try {
        return execSync('git rev-parse --short HEAD').toString().trim();
    } catch (e) {
        return 'unknown';
    }
};

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Apply these headers to API routes or any other paths you need
        source: "/(.*?)",
        headers: [
          {
            key: "Access-Control-Allow-Credentials",
            value: "true",
          },
          {
            key: "Access-Control-Allow-Origin",
            value: "*", // or "*" to allow any
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,OPTIONS,POST,PUT,DELETE",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "*",
          },
        ],
      },
    ];
  },
  env: {
      NEXT_PUBLIC_GIT_SHA: getGitHash()
  }
};

export default nextConfig;
