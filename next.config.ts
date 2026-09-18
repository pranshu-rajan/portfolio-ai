import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use standalone output for Docker containerization; Vercel handles native output automatically
  output: process.env.VERCEL ? undefined : "standalone",
};



export default nextConfig;
