import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Aliff Services Brand Colors - Updated from Aliff Capital
        // Primary - Professional Authority (Darker for premium feel)
        navy: {
          DEFAULT: "#080d1a",
          50: "#F8F9FA",
          100: "#E9ECEF",
          200: "#DEE2E6",
          300: "#CED4DA",
          400: "#6C757D",
          500: "#495057",
          600: "#343A40",
          700: "#1a2744",
          800: "#0f1829",
          900: "#080d1a",
          950: "#040609",
        },
        // Brand Gold - Premium & Excellence (Brighter for impact)
        gold: {
          DEFAULT: "#E5C17F",
          50: "#FDF9F0",
          100: "#FBF3E0",
          200: "#F8E8C2",
          300: "#F3C96B",
          400: "#E5C17F",
          500: "#D4AF37",
          600: "#C89D5C",
          700: "#B8894A",
          800: "#9A7240",
          900: "#7C5C36",
        },
        // Accent - Innovation Signal
        teal: {
          DEFAULT: "#0891B2",
          50: "#ECFEFF",
          100: "#CFFAFE",
          200: "#A5F3FC",
          300: "#67E8F9",
          400: "#22D3EE",
          500: "#06B6D4",
          600: "#0891B2",
          700: "#0E7490",
          800: "#155E75",
          900: "#164E63",
        },
        // Success - Metrics/Wins (also "victory" alias)
        success: {
          DEFAULT: "#10B981",
          50: "#ECFDF5",
          100: "#D1FAE5",
          200: "#A7F3D0",
          300: "#6EE7B7",
          400: "#34D399",
          500: "#10B981",
          600: "#059669",
          700: "#047857",
          800: "#065F46",
          900: "#064E3B",
        },
        victory: {
          DEFAULT: "#10B981",
          50: "#ECFDF5",
          100: "#D1FAE5",
          200: "#A7F3D0",
          300: "#6EE7B7",
          400: "#34D399",
          500: "#10B981",
          600: "#059669",
          700: "#047857",
          800: "#065F46",
          900: "#064E3B",
        },
        // Win alias (for semantic clarity in WIN messaging)
        win: {
          DEFAULT: "#10B981",
          300: "#6EE7B7",
          400: "#22C55E",
          500: "#10B981",
          600: "#059669",
        },
        // Service Category Accents
        govcon: {
          DEFAULT: "#3B82F6",
          600: "#2563EB",
        },
        it: {
          DEFAULT: "#8B5CF6",
          600: "#7C3AED",
        },
        writing: {
          DEFAULT: "#EC4899",
          600: "#DB2777",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ["JetBrains Mono", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      fontSize: {
        // Custom type scale
        "display-lg": ["3.5rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }], // 56px
        "display-md": ["2.5rem", { lineHeight: "1.2", letterSpacing: "-0.01em" }], // 40px
        "display-sm": ["2rem", { lineHeight: "1.25", letterSpacing: "-0.01em" }], // 32px
        "hero-mobile": ["2.5rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }], // 40px mobile
      },
      spacing: {
        // Custom spacing scale (4px base)
        "18": "4.5rem", // 72px
        "22": "5.5rem", // 88px
        "26": "6.5rem", // 104px
        "30": "7.5rem", // 120px
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out",
        "fade-out": "fadeOut 0.6s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "slide-down": "slideDown 0.5s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
        "hero-rotate": "heroRotate 0.6s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeOut: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        heroRotate: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
