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
          DEFAULT: "#000000",
          base: "#000000",
          card: "#14213D",
          border: "#1f2d4d",
          hover: "#1c2b4d",
        },
        lemon: {
          DEFAULT: "#FCA311",
          dim: "rgba(252, 163, 17, 0.15)",
          glow: "rgba(252, 163, 17, 0.25)",
        },
        gold: {
          DEFAULT: "#FCA311",
          hover: "#e5940f",
          dim: "rgba(252, 163, 17, 0.15)",
          glow: "rgba(252, 163, 17, 0.25)",
        },
        navy: {
          DEFAULT: "#14213D",
          dark: "#0b1220",
          card: "#14213D",
          border: "#1f2d4d",
        },
        platinum: "#E5E5E5",
        muted: "#E5E5E5",
        faint: "#8a96a8",
        // Keep swiss for backward compat on landing page
        swiss: {
          black: "#000000",
          white: "#FFFFFF",
          canvas: "#000000",
          muted: "#E5E5E5",
          subtle: "#14213D",
          border: "#1f2d4d",
          darkborder: "#1f2d4d",
          blue: "#14213D",
          vermillion: "#FCA311",
          emerald: "#FCA311",
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
        'lemon-sm': '0 0 12px rgba(252, 163, 17, 0.2)',
        'lemon-md': '0 0 24px rgba(252, 163, 17, 0.25)',
        'lemon-lg': '0 0 40px rgba(252, 163, 17, 0.35)',
        'lemon-glow': '0 0 30px rgba(252, 163, 17, 0.5)',
        'gold-sm': '0 0 12px rgba(252, 163, 17, 0.2)',
        'gold-md': '0 0 24px rgba(252, 163, 17, 0.25)',
        'gold-lg': '0 0 40px rgba(252, 163, 17, 0.35)',
        'gold-glow': '0 0 30px rgba(252, 163, 17, 0.5)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.6)',
        'card-hover': '0 8px 32px rgba(0, 0, 0, 0.7), 0 0 20px rgba(252, 163, 17, 0.18)',
      },
    },
  },
  plugins: [],
};

export default config;
