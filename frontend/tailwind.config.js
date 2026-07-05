/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        bee: {
          50: '#fff9e6',
          100: '#fff0b3',
          200: '#ffe680',
          300: '#ffd633',
          400: '#f5c518',
          500: '#e0b000',
          600: '#c49b00',
          700: '#a07d00',
          800: '#7d6200',
          900: '#5c4800',
        },
        honey: {
          DEFAULT: '#f5c518',
          light: '#ffd633',
          dark: '#e0b000',
        },
        ink: '#0a0a0a',
        surface: '#141414',
        surface2: '#1c1c1c',
        surface3: '#242424',
        muted: '#888888',
        marquee: '#f5c518',
        marquee2: '#ffd633',
        velvet: '#f5c518',
        velvet2: '#e0b000',
        cream: '#ffffff',
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        grain: "radial-gradient(circle at 20% 20%, rgba(245,197,24,0.04), transparent 40%), radial-gradient(circle at 80% 60%, rgba(245,197,24,0.06), transparent 45%)",
      },
    },
  },
  plugins: [],
};
