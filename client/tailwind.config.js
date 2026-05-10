/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",  // ← tells tailwind to scan these files
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}