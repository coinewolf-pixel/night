/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nexo: {
          dark: '#0a0a1a',
          darker: '#050510',
          purple: '#7c3aed',
          pink: '#ec4899',
          blue: '#3b82f6',
          cyan: '#06b6d4',
          gold: '#fbbf24',
          glass: 'rgba(255,255,255,0.05)',
          glassBorder: 'rgba(255,255,255,0.1)',
        }
      },
      fontFamily: {
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #ec4899, 0 0 10px #ec4899' },
          '100%': { boxShadow: '0 0 20px #ec4899, 0 0 40px #7c3aed' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}