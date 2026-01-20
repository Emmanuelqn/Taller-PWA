import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ============================================================================
  // OPTIMIZACIÓN DE IMÁGENES
  // ============================================================================
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.in',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },

  // ============================================================================
  // HEADERS DE SEGURIDAD
  // ============================================================================
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
        ],
      },
    ];
  },

  // ============================================================================
  // CONFIGURACIÓN DE PWA (Experimental)
  // ============================================================================
  experimental: {
    // Habilitar optimizaciones modernas
  },

  // ============================================================================
  // OPTIMIZACIONES DE RENDIMIENTO
  // ============================================================================
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,

  // ============================================================================
  // CONFIGURACIÓN DE WEBPACK (para paquetes problemáticos)
  // ============================================================================
  webpack: (config, { isServer }) => {
    // Configuración para manejar módulos nativos en el servidor
    if (isServer) {
      config.externals = config.externals || [];
      // Excluir paquetes que tienen problemas con el bundling
    }
    return config;
  },

  // ============================================================================
  // REDIRECCIONES Y REWRITES
  // ============================================================================
  async redirects() {
    return [];
  },
};

export default nextConfig;
