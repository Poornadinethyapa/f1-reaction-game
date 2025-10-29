/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-bg': '#1a1a2e',
        'secondary-bg': '#16213e',
        'accent': '#667eea',
        'accent-hover': '#764ba2',
      }
    },
  },
  plugins: [],
}
