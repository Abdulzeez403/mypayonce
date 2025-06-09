import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      borderColor: {
        DEFAULT: "hsl(var(--border))",
        border: "hsl(var(--border))",
      },
    },

    keyframes: {
      scaleUpDown: {
        "0%, 100%": { transform: "scale(1)" },
        "50%": { transform: "scale(1.1)" },
      },
    },
    animation: {
      scaleInOut: "scaleInOut 1s ease-in-out infinite",
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
