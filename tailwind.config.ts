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
        // Aliff Services Brand Colors - Official Color Schema
        // Reference: Planning/Website/HOMEPAGE_SPECIFICATION.md

        // Primary Brand - Professional Authority & Trust
        navy: {
          DEFAULT: "#0A0F1E", // Primary navy from spec
          50: "#F8F9FA",
          100: "#E9ECEF",
          200: "#DEE2E6",
          300: "#CED4DA",
          400: "#6C757D",
          500: "#495057",
          600: "#343A40",
          700: "#212529",
          800: "#1a1f2e",
          900: "#0A0F1E",
        },

        // Brand Gold - Premium Excellence & Value
        gold: {
          DEFAULT: "#C89D5C", // Primary gold from spec
          50: "#FDF8F0",
          100: "#F9EDDC",
          200: "#F3DCB9",
          300: "#EDCB96",
          400: "#D4A962", // Gradient light from spec
          500: "#C89D5C",
          600: "#B8894A",
          700: "#9A7240",
          800: "#7C5C36",
          900: "#5E462A",
        },

        // Victory Green - Success & Achievement
        victory: {
          DEFAULT: "#10B981", // Victory green from spec
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

        // Functional Colors
        success: {
          DEFAULT: "#10B981", // Matches victory green
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
        error: {
          DEFAULT: "#EF4444", // Error red from spec
          50: "#FEF2F2",
          100: "#FEE2E2",
          200: "#FECACA",
          300: "#FCA5A5",
          400: "#F87171",
          500: "#EF4444",
          600: "#DC2626",
          700: "#B91C1C",
          800: "#991B1B",
          900: "#7F1D1D",
        },
        warning: {
          DEFAULT: "#F59E0B", // Warning amber from spec
          50: "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#FBBF24",
          500: "#F59E0B",
          600: "#D97706",
          700: "#B45309",
          800: "#92400E",
          900: "#78350F",
        },

        // Neutral Palette - Supporting Cast
        gray: {
          50: "#F9FAFB", // Gray-50 from spec
          100: "#F3F4F6", // Gray-100 from spec
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563", // Gray-600 from spec
          700: "#374151",
          800: "#1F2937",
          900: "#111827", // Gray-900 from spec
        },

        // Service Category Visual Identifiers
        // (Used for badges, icons, accents)
        govcon: {
          DEFAULT: "#0A0F1E", // Navy + Gold combo
          light: "#C89D5C",
        },
        it: {
          DEFAULT: "#C89D5C", // Gold primary
          light: "#D4A962",
        },
        writing: {
          DEFAULT: "#10B981", // Victory green
          light: "#34D399",
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
