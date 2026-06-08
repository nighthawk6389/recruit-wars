import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./config/**/*.{js,ts}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand palette — "college football energy" + premium sports-tech
        ink: {
          950: "#070a12",
          900: "#0b1020",
          850: "#0f1626",
          800: "#141c30",
          700: "#1c2640",
          600: "#2a3656",
        },
        brand: {
          50: "#fff1f0",
          100: "#ffe0dd",
          200: "#ffc1bb",
          300: "#ff958b",
          400: "#ff5c4d",
          500: "#ff2d17", // primary — fiery recruiting red/orange
          600: "#e51800",
          700: "#bd1300",
          800: "#9c1405",
          900: "#80160a",
        },
        gold: {
          400: "#ffd34d",
          500: "#ffbe0b",
          600: "#e0a200",
        },
        electric: {
          400: "#3bc9ff",
          500: "#00a8e8",
          600: "#0086c4",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-inter)", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 40px -10px rgba(255,45,23,0.55)",
        "glow-gold": "0 0 40px -10px rgba(255,190,11,0.5)",
        card: "0 8px 40px -12px rgba(0,0,0,0.6)",
      },
      backgroundImage: {
        "grid-faint":
          "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
        "brand-radial":
          "radial-gradient(60% 60% at 50% 0%, rgba(255,45,23,0.18) 0%, rgba(7,10,18,0) 100%)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.9)", opacity: "0.7" },
          "100%": { transform: "scale(1.6)", opacity: "0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out both",
        shimmer: "shimmer 2s infinite",
        "pulse-ring": "pulse-ring 1.8s ease-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
