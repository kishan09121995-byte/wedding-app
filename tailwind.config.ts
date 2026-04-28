import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'rose-gold': '#B76E79',
        'mauve': '#8B3A62',
        'gold': '#D4AF37',
        'cream': '#FFF8F0',
        'f1-brown': '#7B3F00',
        'f2-blue': '#1A5276',
        'f3-purple': '#4A235A',
        'f4-green': '#1B5E20',
      },
      fontFamily: {
        sans: ['Nunito', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config
