/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        flow: '#8b5cf6',
        focused: '#14b8a6',
        neutral: '#64748b',
        distracted: '#f59e0b',
      },
    },
  },
  plugins: [],
}
