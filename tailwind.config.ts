import type { Config } from 'tailwindcss';

const config = {
    content: [
        './src/**/*.{js,ts,jsx,tsx}', // Good
        // This might be too broad
        // It will match `packages/**/node_modules` too
        // '../../packages/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {},
    },
    plugins: [],
} satisfies Config;

export default config;