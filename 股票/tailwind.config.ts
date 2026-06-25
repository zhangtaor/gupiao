import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        terminal: {
          bg: "#070B12",
          panel: "#0B111C",
          panel2: "#101826",
          border: "#223047",
          muted: "#8A97AA",
          green: "#36D399",
          red: "#FB7185",
          amber: "#FBBF24",
          cyan: "#22D3EE"
        }
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(34, 211, 238, 0.22), 0 18px 60px rgba(34, 211, 238, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
