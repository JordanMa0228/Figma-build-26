/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#f8fafc',
        panel: '#ffffff',
        panelAlt: '#f8fafc',
        line: '#e2e8f0',
        muted: '#64748b',
        success: '#22c55e',
        flow: '#3b82f6',
        focused: '#0ea5e9',
        neutral: '#94a3b8',
        distracted: '#f59e0b',
      },
      boxShadow: {
        panel: '0 1px 3px rgba(15, 23, 42, 0.04), 0 6px 16px rgba(15, 23, 42, 0.06)',
        glow: '0 8px 24px rgba(59, 130, 246, 0.1)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
}
