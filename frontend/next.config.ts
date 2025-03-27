import type { NextConfig } from "next";

const getGitHash = () => {
  // Prioritize platform-specific variables
  // Use the one relevant to your deployment platform
  const sha =
    process.env.SOURCE_COMMIT ||         // Coolify
    process.env.VERCEL_GIT_COMMIT_SHA || // Vercel
    process.env.GITHUB_SHA ||            // GitHub Actions
    process.env.CI_COMMIT_SHA ||         // GitLab CI
    process.env.RENDER_GIT_COMMIT;       // Render (Full SHA)

  if (sha) {
    // Return the short version
    return sha.substring(0, 7);
  }

  try {
    // Dynamically require only if needed, avoids error if child_process isn't available
    const { execSync } = require('child_process');
    return execSync('git rev-parse --short HEAD').toString().trim();
  } catch (e) {
    // --- Type Guard ---
    let errorMessage = "An unknown error occurred";
    if (e instanceof Error) {
      errorMessage = e.message;
    } else if (typeof e === 'string') {
      errorMessage = e;
    }
    console.warn("Could not determine Git hash via execSync:", errorMessage);
    // --- End Type Guard ---
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
