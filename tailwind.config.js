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
        cineDark: {
          900: '#07090E',
          800: '#0C1017',
          700: '#141A24',
          600: '#1E2636',
          500: '#2A3448',
        },
        cineRed: {
          DEFAULT: '#E50914',
          hover: '#FF1E27',
          glow: 'rgba(229, 9, 20, 0.4)',
        },
        cineViolet: {
          DEFAULT: '#8B5CF6',
          glow: 'rgba(139, 92, 246, 0.4)',
        },
        cineBlue: {
          DEFAULT: '#3B82F6',
          glow: 'rgba(59, 130, 246, 0.4)',
        },
        cineAmber: {
          DEFAULT: '#F59E0B',
          light: '#FBBF24',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        display: ['Outfit', 'Cabinet Grotesk', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'pulse-glow': 'pulseGlow 2s infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%': { boxShadow: '0 0 15px rgba(229, 9, 20, 0.2)' },
          '100%': { boxShadow: '0 0 35px rgba(229, 9, 20, 0.6)' },
        }
      }
    },
  },
  plugins: [],
};
