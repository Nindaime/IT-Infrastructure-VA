/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // or media - Enable dark mode using a class
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        'brand-blue': '#1d4ed8',
        'brand-lightblue': '#3b82f6',
      },
    },
  },
  plugins: [],
}
