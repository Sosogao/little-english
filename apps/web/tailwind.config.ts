import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        meadow: {
          50: '#f2fbf4',
          100: '#ddf4e1',
          500: '#3aa65a',
          700: '#23713c',
        },
        sunshine: {
          100: '#fff4cf',
          300: '#ffd66b',
          500: '#f7a928',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
} satisfies Config;
