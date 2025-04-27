import {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
 
const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'randomuser.me',
          },
          {
            protocol: 'https',
            hostname: 'www.pokemon.com',
          },
        ],
      },
      reactStrictMode: false,
      env: {
        GEMINI_API_KEY: process.env.GEMINI_API_KEY,
      }
};
 
const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);