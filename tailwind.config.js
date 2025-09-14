/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1e3a8a', // A deep blue
        secondary: '#3b82f6', // A lighter, vibrant blue
        accent: '#fbbf24', // Amber for accents
        background: '#f8fafc', // A very light gray
        surface: '#ffffff', // White
        textPrimary: '#1f2937', // Dark gray for text
        textSecondary: '#6b7280', // Lighter gray for secondary text
      },
    },
  },
  plugins: [],
}
