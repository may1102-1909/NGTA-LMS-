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
        swiss: {
          black: "#09090B",
          white: "#FFFFFF",
          canvas: "#FBFBFB",
          muted: "#71717A",
          subtle: "#F4F4F5",
          border: "#E4E4E7",
          darkborder: "#27272A",
          blue: "#0038FF",      // International Klein / Swiss Blue
          vermillion: "#FF3300", // Classic Swiss Vermillion
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
    },
  },
  plugins: [],
};

export default config;
