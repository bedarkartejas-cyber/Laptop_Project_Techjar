/** @type {import('next').NextConfig} */
const nextConfig = {
  // This is crucial for running API routes inside Electron
  output: "standalone",
  // Optional: Disable powered by header for security
  poweredByHeader: false,
};

export default nextConfig;