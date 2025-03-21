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
    env: {
        NEXT_PUBLIC_GIT_SHA: getGitHash()
    }
};

export default nextConfig;
