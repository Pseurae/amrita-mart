import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      'serif': ['var(--font-fraunces)'],
      'logo': ['var(--font-dmserif)']
    },
    fontSize: {
      'sm': '0.9rem',
      'base': '1.1rem',
      'lg': '1.225rem',
      'xl': '1.35rem',
      '2xl': '1.663rem',
      '3xl': '2.053rem',
      '4xl': '2.541rem',
      '5xl': '3.152rem',
    }
  },
  plugins: [],
};
export default config;
