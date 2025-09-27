/** @type {import('next').NextConfig} */
const nextConfig = {
  // Production-ready configuration
  poweredByHeader: false,
  compress: true,
  
  // Enable strict CSP for exam security
  async headers() {
    return [
      {
        source: '/exam/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      {
        source: '/quiz/:path*/take',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
  
  // Image optimization for production
  images: {
    domains: ['supabase.co'], // Add your Supabase domain
    formats: ['image/webp', 'image/avif'],
  },
  
  // Bundle analyzer in development only
  ...(process.env.ANALYZE === 'true' && {
    webpack: (config) => {
      config.plugins.push(new (require('@next/bundle-analyzer')())());
      return config;
    },
  }),
};

export default nextConfig;
