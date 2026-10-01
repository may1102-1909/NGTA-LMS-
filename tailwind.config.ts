import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        night: {
          DEFAULT: "#08070D",
          base: "#08070D",
          card: "#120F1D",
          border: "#26213B",
          hover: "#1C172E",
        },
        realm: {
          void: "#08070D",
          surface: "#0E0C17",
          card: "#120F1D",
          elevated: "#161326",
          border: "#26213B",
          borderHover: "#3A2E59",
        },
        rune: {
          purple: "#8B5CF6",
          violet: "#A855F7",
          magenta: "#D946EF",
          cyan: "#06B6D4",
          teal: "#00F2FE",
          gold: "#F59E0B",
          amber: "#FBBF24",
          emerald: "#10B981",
        },
        lemon: {
          DEFAULT: "#8B5CF6",
          dim: "rgba(139, 92, 246, 0.15)",
          glow: "rgba(139, 92, 246, 0.35)",
        },
        muted: "#94A3B8",
        faint: "#585175",
        // Keep swiss for backward compat on landing page
        swiss: {
          black: "#08070D",
          white: "#FFFFFF",
          canvas: "#0E0C17",
          muted: "#94A3B8",
          subtle: "#161326",
          border: "#26213B",
          darkborder: "#3A2E59",
          blue: "#8B5CF6",
          vermillion: "#D946EF",
          emerald: "#06B6D4",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Helvetica Neue", "Arial", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "SFMono-Regular", "Menlo", "monospace"],
      },
      letterSpacing: {
        tighter: "-0.04em",
        tight: "-0.02em",
        wide: "0.08em",
        widest: "0.15em",
      },
      borderRadius: {
        none: "0px",
        sm: "2px",
        DEFAULT: "4px",
        md: "6px",
        lg: "8px",
        xl: "12px",
        "2xl": "16px",
      },
      boxShadow: {
        'lemon-sm': '0 0 14px rgba(139, 92, 246, 0.28)',
        'lemon-md': '0 0 25px rgba(139, 92, 246, 0.38)',
        'lemon-lg': '0 0 45px rgba(139, 92, 246, 0.48)',
        'lemon-glow': '0 0 35px rgba(139, 92, 246, 0.55)',
        'rune-purple': '0 0 25px rgba(139, 92, 246, 0.4)',
        'rune-cyan': '0 0 25px rgba(6, 182, 212, 0.4)',
        'rune-gold': '0 0 22px rgba(245, 158, 11, 0.45)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.6), 0 0 1px rgba(139, 92, 246, 0.2)',
        'card-hover': '0 8px 32px rgba(0, 0, 0, 0.8), 0 0 25px rgba(139, 92, 246, 0.25)',
      },
    },
  },
  plugins: [],
};

export default config;
