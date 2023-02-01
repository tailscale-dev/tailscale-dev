// @ts-check
const { fontFamily } = require('tailwindcss/defaultTheme');
const plugin = require('tailwindcss/plugin');

/** @type {import("tailwindcss/types").Config } */
module.exports = {
  content: [
    './pages/**/*.{js,ts,tsx}',
    './components/**/*.{js,ts,tsx}',
    './layouts/**/*.{js,ts,tsx}',
    './lib/**/*.{js,ts,tsx}',
    './data/**/*.mdx',
  ],
  darkMode: 'class',
  theme: {
    fontFamily: {
      sans: ['var(--font-inter)', ...fontFamily.sans],
      mono: ['"SF Mono", "SFMono-Regular"', ...fontFamily.mono],
      sansDefault: [...fontFamily.sans],
    },
    colors: {
      blue: {
        50: 'rgba(228, 233, 240, 0.15)',
        100: 'rgba(220, 233, 242, 0.6)',
        200: 'rgba(43, 123, 185, 0.15)',
        300: '#80bdff',
        500: '#4a7ddd',
        600: '#4D78C8',
        700: '#496495',
        800: '#2A4067',
      },
      orange: {
        600: '#CA6940',
        700: '#C65835',
      },
      yellow: {
        50: '#f8e5b9',
        100: 'hsla(48, 100%, 50%, 0.4)',
        600: '#762b0b',
        700: '#CCA000',
      },
      green: {
        500: '#41a663',
        700: '#487961',
        800: '#385A4A',
      },
      gray: {
        50: '#faf9f8',
        100: '#f6f4f2',
        200: '#E6E4E2',
        300: '#D6D2CC',
        400: '#B6B0AD',
        500: '#9F9995',
        600: '#666361',
        700: '#474645',
        800: '#343433',
        900: '#242424',
      },
      red: {
        400: '#c65835',
      },
      white: '#fff',
      transparent: 'transparent',
      current: 'currentColor',
    },
    stroke: ({ theme }) => ({
      current: 'currentColor',
      'gray-500': theme('colors.gray.500'),
      'blue-500': theme('colors.blue.500'),
      'blue-700': theme('colors.blue.700'),
    }),
    extend: {
      fontSize: {
        tiny: '.7rem',
      },
      transitionDuration: {
        0: '1ms',
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
    plugin(function ({ addVariant }) {
      addVariant('state-open', '&[data-state="open"]');
      addVariant('state-closed', '&[data-state="closed"]');
      addVariant('copy-toggle', ['&[data-copy-toggle="true"]', '[data-copy-toggle="true"] &']);
    }),
  ],
};
