/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        light: {
          "primary": '#A31D1D',      // Red
          "secondary": '#6D2323',    // Dark Red
          "accent": '#E5D0AC',       // Beige
          "neutral": '#171717',      // Dark Gray
          "base-100": '#FEF9E1',     // Light Beige Background
          "info": '#3ABFF8',         // Cyan
          "success": '#36D399',      // Green
          "warning": '#FBBD23',      // Yellow
          "error": '#fc3535',        // Red
          "--background": '#FEF9E1', // Light Beige Background
          "--foreground": '#2A2E37', // Dark Gray Text
        },
        dark: {
          "primary": "#3b82f6",      // Blue
          "secondary": "#fc3535",    // Pink
          "accent": "#000",       // Teal
          "neutral": "#fff",         // Light Gray
          "base-100": "#1A1A1A",     // Dark Background
          "info": "#3ABFF8",         // Cyan
          "success": "#36D399",      // Green
          "warning": "#FBBD23",      // Yellow
          "error": "#fc3535",        // Red
          "--background": "#1A1A1A", // Dark Background
          "--foreground": "#FAFAFA", // Light Text
        },
      },
    ],
  },
};