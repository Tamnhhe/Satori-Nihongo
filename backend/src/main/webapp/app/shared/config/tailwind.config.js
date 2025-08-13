/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Satori brand colors
        primary: {
          50: '#fef9e7',
          100: '#fef0c3',
          200: '#fde38a',
          300: '#fcd047',
          400: '#f3aa1c', // Primary brand color
          500: '#e19310',
          600: '#c2720c',
          700: '#9f520e',
          800: '#814114',
          900: '#6d3617',
        },
        secondary: {
          50: '#eef4ff',
          100: '#e0eaff',
          200: '#c7d8ff',
          300: '#a5bfff',
          400: '#819bff',
          500: '#6177ff',
          600: '#4f56f5',
          700: '#4144d8',
          800: '#3738ae',
          900: '#253a8c', // Secondary brand color
        },
        // Neutral greys (8-10 shades)
        gray: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans JP', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        xs: '12px',
        sm: '14px',
        base: '16px',
        lg: '20px',
        xl: '24px',
        '2xl': '32px',
      },
      spacing: {
        // 4px/8px based spacing scale
        1: '4px',
        2: '8px',
        3: '12px',
        4: '16px',
        5: '20px',
        6: '24px',
        7: '28px',
        8: '32px',
        10: '40px',
        12: '48px',
        16: '64px',
        20: '80px',
        24: '96px',
      },
      borderRadius: {
        DEFAULT: '8px',
        lg: '16px',
        xl: '24px',
      },
      boxShadow: {
        subtle: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        soft: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        medium: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      },
      transitionDuration: {
        250: '250ms',
        300: '300ms',
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
};
