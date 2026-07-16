/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-primary': '#0D0D0D',
        'dark-secondary': '#1A1A1A',
        'dark-tertiary': '#2d2d2d',
        'accent': '#C9A227',
      },
      fontFamily: {
        'bebas': ['Bebas Neue', 'sans-serif'],
        'poppins': ['Poppins', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
