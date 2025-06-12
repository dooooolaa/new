/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light mode
        light: {
          bg: '#ffffff',
          text: '#1a1a1a',
          accent: '#2e7d32',
          secondary: '#4caf50',
          muted: '#f5f5f5',
        },
        // Dark mode
        dark: {
          bg: '#121212',
          text: '#e0e0e0',
          accent: '#26a69a',
          secondary: '#80cbc4',
          muted: '#1e1e1e',
        },
        // Shared colors
        primary: {
          50: '#e8f5e9',
          100: '#c8e6c9',
          200: '#a5d6a7',
          300: '#81c784',
          400: '#66bb6a',
          500: '#4caf50',
          600: '#43a047',
          700: '#388e3c',
          800: '#2e7d32',
          900: '#1b5e20',
        },
        success: '#4caf50',
        warning: '#ff9800',
        error: '#f44336',
        info: '#2196f3',
      },
      fontFamily: {
        sans: ['Noto Sans Arabic', 'sans-serif'],
        quran: ['Noto Naskh Arabic', 'serif'],
        title: ['Amiri', 'serif'],
      },
      backgroundImage: {
        'pattern-light': "url('https://www.transparenttextures.com/patterns/subtle-white-feathers.png')",
        'pattern-dark': "url('https://www.transparenttextures.com/patterns/black-linen.png')",
      },
    },
  },
  plugins: [],
};