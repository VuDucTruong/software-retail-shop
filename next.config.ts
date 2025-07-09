import {withSentryConfig} from "@sentry/nextjs";
import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
const nextConfig: NextConfig = {
  reactStrictMode: false,
  // webpack(config, { isServer }) {
  //   if (!isServer) {
  //     config.externals = config.externals || [];
  //     config.externals.push('zod');
  //   }
  //   return config;
  // },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "encrypted-tbn0.gstatic.com"
      },
      {
        protocol: "https",
        hostname: "randomuser.me",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "vdt64.duckdns.org" ,
      }
    ],
  },
  productionBrowserSourceMaps: true,
  env: {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  },
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
};

const withNextIntl = createNextIntlPlugin();
export default withSentryConfig(
  withNextIntl(nextConfig), // <- first arg is the full Next config
  {
    // Sentry Webpack Plugin Options
    org: "uit-eb",
    project: "software-retail-ecommerce",
    silent: !process.env.CI,
    widenClientFileUpload: true,
    disableLogger: true,
    automaticVercelMonitors: true,
  }
);