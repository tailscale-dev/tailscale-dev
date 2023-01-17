/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './layouts/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    fontFamily: {
      sans: ['Menlo, Monaco, monospace', 'sans-serif']
    },
    extend: {
      colors: {
        yellow: '#fb5',
        orange: '#f70'
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {},
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
} 
