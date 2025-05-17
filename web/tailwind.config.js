/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        bg:      '#fafafa',        // pale background
        line:    '#e0e0e0',        // gridlines / borders
        text:    '#111111',        // main text
      },
      keyframes: {
        pulseFade: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%':      { transform: 'scale(1.15)', opacity: '0.6' },
        },
      },
      animation: {
        pulseFade: 'pulseFade 0.7s ease-in-out infinite',
      },
      fontFamily: {
        sans: ['Inter', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}; 