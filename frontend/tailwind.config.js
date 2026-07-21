/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#17181C',
        paper: '#F6F5F1',
        denim: {
          DEFAULT: '#2F4B7C',
          deep: '#1F3557',
          light: '#5D7BAD',
        },
        rust: '#B23A2E',
        mustard: '#D9A404',
        line: '#DAD7CE',
      },
      fontFamily: {
        display: ['"Anton"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.02em',
        widest2: '0.18em',
      },
      backgroundImage: {
        stitch: 'repeating-linear-gradient(90deg, currentColor 0 6px, transparent 6px 12px)',
      },
    },
  },
  plugins: [],
};
