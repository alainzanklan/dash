/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },

      gridTemplateColumns: {
        '70/30': '70% 28%',
      },
      colors: {
        teal: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#d4d4d8',
          300: '#71717a',
          400: '#52525b',
          500: '#3f3f46',
          600: '#27272a',
          700: '#18181b',
          800: '#18181b',
          900: '#09090b',
        },
        sky: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#d4d4d8',
          300: '#71717a',
          400: '#52525b',
          500: '#3f3f46',
          600: '#27272a',
          700: '#18181b',
          800: '#18181b',
          900: '#09090b',
        },
      },
    },
  },
  plugins: [],
};
