import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["var(--font-serif)", "Newsreader", "Lora", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Plus Jakarta Sans", "Inter", "sans-serif"],
        poppins: ["var(--font-sans)", "Plus Jakarta Sans", "sans-serif"],
        roboto: ["var(--font-sans)", "Plus Jakarta Sans", "sans-serif"],
      },
      colors: {
        // Guwigo ID Brand System (with Editorial Warmth)
        guwigo: {
          blue: {
            DEFAULT: "#2563EB",
            50: "#EFF6FF",
            100: "#DBEAFE",
            200: "#BFDBFE",
            300: "#93C5FD",
            400: "#60A5FA",
            500: "#3B82F6",
            600: "#2563EB",
            700: "#1D4ED8",
            800: "#1E40AF",
            900: "#1E3A5F",
          },
          cyan: {
            DEFAULT: "#06B6D4",
            50: "#ECFEFF",
            100: "#CFFAFE",
            200: "#A5F3FC",
            300: "#67E8F9",
            400: "#22D3EE",
            500: "#06B6D4",
            600: "#0891B2",
            700: "#0E7490",
          },
          dark: {
            DEFAULT: "#0A0F1D",
            700: "#1E293B",
            800: "#131C31",
            850: "#0F172A",
            900: "#0A0F1D",
            950: "#050811",
          },
          bg: "#FAF9F6",
          surface: "#FFFFFF",
          subtle: "#F1F5F9",
          stone: "#E2E8F0",
          "stone-dark": "#CBD5E1",
          text: "#0F172A",
          muted: "#64748B",
          faint: "#94A3B8",
        },
        brand: {
          50: "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          300: "#93C5FD",
          400: "#60A5FA",
          500: "#3B82F6",
          600: "#2563EB",
          700: "#1D4ED8",
          800: "#1E40AF",
          900: "#1E3A5F",
        },
        accent: {
          50: "#ECFEFF",
          100: "#CFFAFE",
          200: "#A5F3FC",
          300: "#67E8F9",
          400: "#22D3EE",
          500: "#06B6D4",
          600: "#0891B2",
          700: "#0E7490",
        },
        claude: {
          bg: "#FAF9F6",
          surface: "#FFFFFF",
          subtle: "#F1F5F9",
          stone: "#E2E8F0",
          "stone-dark": "#CBD5E1",
          text: "#0F172A",
          muted: "#64748B",
          faint: "#94A3B8",
          terracotta: {
            DEFAULT: "#2563EB",
            50: "#EFF6FF",
            100: "#DBEAFE",
            200: "#BFDBFE",
            300: "#93C5FD",
            400: "#60A5FA",
            500: "#3B82F6",
            600: "#2563EB",
            700: "#1D4ED8",
            800: "#1E40AF",
            900: "#1E3A5F",
          },
          espresso: {
            DEFAULT: "#0A0F1D",
            800: "#131C31",
            850: "#0F172A",
            900: "#0A0F1D",
            950: "#050811",
          },
          amber: {
            DEFAULT: "#06B6D4",
            light: "#ECFEFF",
            dark: "#0891B2",
          },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "hero-gradient":
          "radial-gradient(ellipse at 50% -20%, rgba(37, 99, 235, 0.08), transparent 70%), linear-gradient(180deg, #FAF9F6 0%, #F1F5F9 100%)",
        "claude-warm":
          "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(37, 99, 235, 0.08), transparent 60%)",
      },
      keyframes: {
        loadingBar: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(200%)" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        loadingBar: "loadingBar 1.5s infinite ease-in-out",
        fadeInUp: "fadeInUp 0.5s ease-out forwards",
      },
    },
  },
  plugins: [],
};
export default config;
