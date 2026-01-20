/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        notion: {
          bg: '#FFFFFF',
          'bg-secondary': '#F7F6F3',
          text: '#37352F',
          'text-secondary': '#787774',
          'text-tertiary': '#9B9A97',
          border: '#E9E9E7',
          accent: '#2383E2',
          'accent-hover': '#1F7BD7',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Helvetica',
          'Apple Color Emoji',
          'Arial',
          'sans-serif',
        ],
      },
      boxShadow: {
        'notion': '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.08)',
        'notion-lg': '0 10px 25px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.08)',
      },
      borderRadius: {
        'notion': '4px',
      },
    },
  },
  plugins: [],
}
