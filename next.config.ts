import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "files.cdn.printful.com" },
      { protocol: "https", hostname: "*.printful.com" },
      { protocol: "https", hostname: "printful-upload.s3-accelerate.amazonaws.com" },
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
  async redirects() {
    return [
      // El recorrido saudí del Dakar 2027 se canceló el 30/10/2026: la noticia vieja apunta a la buena.
      { source: "/noticias/dakar-2027-recorrido-etapas-fechas", destination: "/noticias/dakar-2027-portugal-marruecos", permanent: true },
    ];
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
