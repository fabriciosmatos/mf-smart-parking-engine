/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./App.tsx",
    "./index.tsx",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./hooks/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  safelist: [
    {
      pattern: /bg-(emerald|blue|indigo|rose)-(100|500|600)/,
    },
    {
      pattern: /text-(emerald|blue|indigo|rose)-(600|700)/,
    },
  ],
}
