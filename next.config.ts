import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "randomuser.me",
      },
      {
        protocol: "https",
        hostname: "www.pokemon.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  productionBrowserSourceMaps: true,
  env: {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
