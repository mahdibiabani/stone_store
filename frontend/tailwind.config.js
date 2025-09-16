/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'stone': {
          50: '#faf9f7',
          100: '#f5f1eb',
          200: '#e8ddd4',
          300: '#d4c4b0',
          400: '#c4a882',
          500: '#b8956b',
          600: '#a67c52',
          700: '#8b6644',
          800: '#72543a',
          900: '#5d4530',
        },
        'warm': {
          50: '#fdfcfa',
          100: '#f9f6f0',
          200: '#f0e9d9',
          300: '#e4d5c1',
          400: '#d4c4b0',
          500: '#c4a882',
          600: '#b8956b',
          700: '#a67c52',
          800: '#8b6644',
          900: '#72543a',
        }
      },
      fontFamily: {
        'persian': ['Vazir', 'Tahoma', 'Arial', 'sans-serif'],
        'english': ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      }
    },
  },
  plugins: [],
};
