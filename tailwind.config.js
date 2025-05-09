/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#253031',
        secondary: '#6F1D1B',
        light: '#558C8C',
      }
    },
  },
  plugins: [],
}

