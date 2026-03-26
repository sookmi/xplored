import type { Config } from "tailwindcss";
import { colors } from "./lib/tokens";

const config: Config = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./packages/ui/**/*.{js,ts,jsx,tsx,mdx}",
    "./stories/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        ...colors, // Spreads all primitives (red, slate, brand, etc.)
      },
      backgroundColor: { ...colors.bg },
      textColor: { ...colors.text },
      borderColor: { ...colors.border },
    },
  },
  plugins: [],
};

export default config;
