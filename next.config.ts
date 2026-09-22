import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Local /public/demo/*.svg placeholders need SVG support enabled.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      // Supabase Storage public URLs, once NEXT_PUBLIC_SUPABASE_URL is set.
      // Broaden/replace this if you use a custom Supabase domain.
      { protocol: "https", hostname: "**.supabase.co", pathname: "/storage/v1/object/public/**" },
    ],
  },
};

export default nextConfig;
