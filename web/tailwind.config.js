/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        status: {
          green: "#22c55e",
          amber: "#fbbf24",
          red: "#ef4444",
        },
      },
    },
  },
  plugins: [],
}; 