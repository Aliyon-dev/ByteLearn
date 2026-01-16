/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Enable standalone output for Docker production builds
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,
  // Disable telemetry
  telemetry: {
    enabled: false,
  },
}

export default nextConfig
