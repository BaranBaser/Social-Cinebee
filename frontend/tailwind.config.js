/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0F0D0D',
        surface: '#1C1817',
        surface2: '#241F1D',
        marquee: '#E8B34E',
        marquee2: '#F4CC7A',
        velvet: '#B33A3A',
        velvet2: '#8F2C2C',
        cream: '#F5EFE6',
        muted: '#A89A8C',
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        grain: "radial-gradient(circle at 20% 20%, rgba(232,179,78,0.06), transparent 40%), radial-gradient(circle at 80% 60%, rgba(179,58,58,0.08), transparent 45%)",
      },
    },
  },
  plugins: [],
};
