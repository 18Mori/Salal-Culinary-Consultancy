export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: '#121212',
        cream: '#FDFBF7',
        sage: '#88A095',
        terracotta: '#A05E4C',
        brass: '#B8860B',
        accent: '#6B5B4C',
        background: '#F8F6F2',
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
      letterSpacing: {
        tight: '0.02em',
      },
      keyframes: {
        'skeleton-shimmer': {
          '0%': { backgroundPosition: '200% 50%', opacity: '0.4' },
          '50%': { backgroundPosition: '0% 50%', opacity: '0.6' },
          '100%': { backgroundPosition: '200% 50%', opacity: '0.4' },
        },
        'skeleton-bg': {
          '0%': { backgroundColor: 'rgba(18, 18, 18, 0.1)' },
          '50%': { backgroundColor: 'rgba(253, 251, 247, 0.3)' },
          '100%': { backgroundColor: 'rgba(18, 18, 18, 0.1)' },
        },
      },
      animation: {
        'skeleton-shimmer': 'skeleton-shimmer 2s cubic-bezier(0.4, 0, 0.2, 1) infinite',
        'skeleton-bg': 'skeleton-bg 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};