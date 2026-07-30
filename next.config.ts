import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // Enable class-based dark mode
  darkMode: 'class', 
  theme: {
    extend: {
      colors: {
        // Semantic Brand Colors
        brand: {
          50: '#eff6ff', // Light backgrounds
          500: '#3b82f6', // Primary Brand (Light Mode)
          600: '#2563eb', // Hover States
          400: '#60a5fa', // Primary Brand (Dark Mode - Desaturated)
        },
        accent: {
          500: '#f59e0b', // Amber for urgent CTAs/Discounts
        },
        surface: {
          light: '#f8fafc', // Gray-50
          dark: '#0f172a',  // Gray-950 (Anti-halation dark mode)
        }
      },
      fontFamily: {
        // Ensuring Geist is our primary font for modern typography
        sans: ['var(--font-geist-sans)'],
        mono: ['var(--font-geist-mono)'],
      },
    },
  },
  plugins: [],
};
export default config;