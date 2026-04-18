/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
        },
        'primary-accent': '#4338ca',
        accent: '#2563eb',
        approved: '#10b981',
        'approved-bg': '#ecfdf5',
        rejected: '#ef4444',
        'rejected-bg': '#fef2f2',
        warning: '#f59e0b',
        'warning-bg': '#fffbeb',
        corporate: {
          light: '#f8fafc',
          card: '#ffffff',
          text: '#0f172a',
          muted: '#64748b',
        }
      },
      boxShadow: {
        'premium': '0 20px 50px -12px rgba(0, 0, 0, 0.08), 0 10px 30px -10px rgba(0, 0, 0, 0.04)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
