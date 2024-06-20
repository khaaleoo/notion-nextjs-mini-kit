import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        primaryBg: "var(--primary-bg-color)",
        secondaryBg: "var(--secondary-bg-color)",
        text: "var(--text-color)",
        border: "var(--border-color)",
      },
      boxShadow: {
        theme: "var(--box-shadow)",
      },
      aspectRatio: {
        "3/1": "3 / 1",
        "5/1": "5 / 1",
      },
    },
  },
  plugins: [],
  // darkMode: ["selector", '[data-theme="dark"]'],
};
export default config;
