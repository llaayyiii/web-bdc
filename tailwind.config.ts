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
        },
      },
      fontFamily: {
        sans: ["var(--font-plus-jakarta)", "var(--font-inter)", "sans-serif"],
        heading: ["var(--font-plus-jakarta)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
