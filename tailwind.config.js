/** @type {import('tailwindcss').Config} */

const { fontFamily } = require("tailwindcss/defaultTheme");

module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './layouts/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    fontFamily: {
      sans: ['"Inter"', ...fontFamily.sans],
      mono: ['"SF Mono", "SFMono-Regular"', ...fontFamily.mono],
      sansDefault: [...fontFamily.sans],
    },
    extend: {
      colors: {
        blue: {
          50: "rgba(228, 233, 240, 0.15)",
          100: "rgba(220, 233, 242, 0.6)",
          200: "rgba(43, 123, 185, 0.15)",
          300: "#80bdff",
          500: "#4a7ddd",
          600: "#4D78C8",
          700: "#496495",
          800: "#2A4067",
        },
        orange: {
          600: "#CA6940",
          700: "#C65835",
        },
        yellow: {
          50: "#f8e5b9",
          100: "hsla(48, 100%, 50%, 0.4)",
          600: "#762b0b",
          700: "#CCA000",
        },
        green: {
          500: "#41a663",
          700: "#487961",
          800: "#385A4A",
        },
        gray: {
          50: "#faf9f8",
          100: "#f6f4f2",
          200: "#E6E4E2",
          300: "#D6D2CC",
          400: "#B6B0AD",
          500: "#9F9995",
          600: "#666361",
          700: "#474645",
          800: "#343433",
          900: "#242424",
        },
        red: {
          400: "#c65835",
        },
        white: "#fff",
        transparent: "transparent",
        current: "currentColor",
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
