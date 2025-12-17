import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['@prisma/client', 'prisma'],
  turbopack: {
    // Konfigurasi Turbopack untuk Prisma
    resolveAlias: {
      '@prisma/client': '@prisma/client',
    },
  },
  experimental: {
    // Fitur experimental lainnya bisa ditambah di sini
  },
};

export default nextConfig;
