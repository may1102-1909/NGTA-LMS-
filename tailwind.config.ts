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
          DEFAULT: "#10131A",
          base: "#10131A",
          card: "#181C26",
          border: "#252A36",
          hover: "#2A3040",
        },
        lemon: {
          DEFAULT: "#EFFF4F",
          dim: "rgba(239, 255, 79, 0.15)",
          glow: "rgba(239, 255, 79, 0.25)",
        },
        muted: "#A0A5B5",
        faint: "#5A5F70",
        // Keep swiss for backward compat on landing page
        swiss: {
          black: "#09090B",
          white: "#FFFFFF",
          canvas: "#FBFBFB",
          muted: "#71717A",
          subtle: "#F4F4F5",
          border: "#E4E4E7",
          darkborder: "#27272A",
          blue: "#0038FF",
          vermillion: "#FF3300",
          emerald: "#059669",
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
        DEFAULT: "3px",
        md: "4px",
        lg: "6px",
      },
      boxShadow: {
        'lemon-sm': '0 0 12px rgba(239, 255, 79, 0.12)',
        'lemon-md': '0 0 24px rgba(239, 255, 79, 0.15)',
        'lemon-lg': '0 0 40px rgba(239, 255, 79, 0.2)',
        'lemon-glow': '0 0 30px rgba(239, 255, 79, 0.35)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.4)',
        'card-hover': '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 20px rgba(239, 255, 79, 0.08)',
      },
    },
  },
  plugins: [],
};

export default config;
