/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#f7f5f0',
        sand: {
          50: '#fcfbf8',
          100: '#f7f5f0',
          200: '#efece4',
          300: '#ded9cc',
          400: '#c5c0b0',
          500: '#9e9987',
        },
        primary: {
          DEFAULT: '#182232',
          container: '#030b1a',
          hover: '#0f172a',
          light: '#2a3b54',
        },
        secondary: {
          DEFAULT: '#f59e0b',
          container: '#fef3c7',
          dark: '#d97706',
          light: '#fea619',
        },
        surface: {
          DEFAULT: '#ffffff',
          dim: '#dddad2',
          muted: '#efece4',
          container: '#f1eee6',
          lowest: '#ffffff',
        },
        slateMarine: '#2a4365',
        borderBase: '#ded9cc',
        textDark: '#0f172a',
        textMuted: '#64748b',
        safeGreen: '#059669',
        safeGreenContainer: '#ecfdf5',
        errorRed: '#dc2626',
        errorContainer: '#fef2f2',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'warm-sm': '0 1px 2px rgba(24, 34, 50, 0.03)',
        'warm-card': '0 1px 3px rgba(24, 34, 50, 0.04), 0 4px 16px rgba(222, 217, 204, 0.45)',
        'warm-elevated': '0 8px 24px -4px rgba(24, 34, 50, 0.08), 0 2px 6px -1px rgba(24, 34, 50, 0.04)',
        'amber-glow': '0 0 0 1px #f59e0b, 0 4px 16px rgba(245, 158, 11, 0.18)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      }
    },
  },
  plugins: [],
};
