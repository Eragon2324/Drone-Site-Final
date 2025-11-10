/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#0e0e0e',
          text: '#eaeaea',
          gold: '#d7b764',
          violet: '#6e6ba0',
          slate: '#7d8ca3',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 30px rgba(215, 183, 100, 0.1)',
        'glow-strong': '0 0 40px rgba(215, 183, 100, 0.18)',
        'inner-glow': 'inset 0 0 30px rgba(215, 183, 100, 0.1)',
      },
      animation: {
        'shimmer': 'shimmer 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};
