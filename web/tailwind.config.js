/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        status: {
          green: "#16a34a",
          amber: "#f59e0b",
          red: "#dc2626",
        },
        card: {
          bg: "#f9fafb",
          ring: "#e2e8f0",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
      },
    },
  },
  plugins: [],
}; 