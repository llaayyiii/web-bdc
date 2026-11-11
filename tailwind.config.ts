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
        bdc: {
          surface: "#EFF0F0",
          yellow: "#EEDD55",
          gold: "#E9AD17",
          blue: "#095BAF",
          navy: "#062A78",
          midnight: "#000741",
          green: "#34A853",
          red: "#EA4335",
          line: "#D9DFD7",
          paper: "#FAF9F2",
          muted: "#596775",
        },
      },
      fontFamily: {
        sans: ["var(--font-plus-jakarta)", "-apple-system", "sans-serif"],
        space: ["var(--font-space)", "sans-serif"],
        pixel: ["var(--font-pixel)", "monospace"],
        mono: ["var(--font-mono)", "monospace"],
        heading: ["var(--font-space)", "sans-serif"],
      },
      boxShadow: {
        retro: "3px 3px 0px #000741",
        "retro-lg": "5px 5px 0px #000741",
        "retro-sm": "2px 2px 0px #000741",
        "retro-blue": "3px 3px 0px #095BAF",
        "retro-yellow": "3px 3px 0px #E9AD17",
      },
      animation: {
        marquee: "marquee 28s linear infinite",
        "marquee-slow": "marquee 45s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
