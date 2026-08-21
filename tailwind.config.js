/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'app-bg': '#F4F2EE',
        'brand-primary': '#728974',
        'brand-light': '#E8EFE9',
        'brand-dark': '#5E7160',
        'surface': '#FFFFFF',
        'text-main': '#1C1C1C',
        'text-primary': '#1C1C1C',
        'text-muted': '#8A8A8A',
        grubpac: {
          bg: '#020B09',
          emerald: '#041F18',
          surface: '#0A1513',
          orange: '#FF5A00',
          mint: '#00F5A0',
          'mint-hover': '#00E092',
          success: '#22C55E',
          warning: '#F59E0B',
          danger: '#EF4444',
          secondary: '#A1A1AA',
          muted: '#71717A',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        heading: ['Plus Jakarta Sans', 'Space Grotesk', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(0, 0, 0, 0.03)',
        'soft-lg': '0 10px 30px rgba(0, 0, 0, 0.05)',
        'glow-mint': '0 0 25px rgba(114, 137, 116, 0.35)',
      },
    },
  },
  plugins: [],
}
