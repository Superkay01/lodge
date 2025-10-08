/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./index.html", "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        "custom-white": "var(--color-white)", // Map --color-white to a Tailwind class
      },
    },
  },
  plugins: [],
};