/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Outfit', 'sans-serif'], serif: ['Playfair Display', 'serif'] },
      colors: {
        primary: '#F97316',
        primaryHover: '#EA580C',
        dark: '#1F2937',
        lightGray: '#F9FAFB',
        cream: '#FFF8F0',
        whatsapp: '#25D366',
      },
      animation: {
        float: 'float 4s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 1s ease-out forwards',
        'modal-in': 'modalIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        shake: 'shake 0.4s ease-in-out',
        'pulse-glow': 'pulseGlow 2s infinite',
      },
      keyframes: {
        float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-15px)' } },
        fadeInUp: { '0%': { opacity: '0', transform: 'translateY(30px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        modalIn: { '0%': { opacity: '0', transform: 'scale(0.9) translateY(20px)' }, '100%': { opacity: '1', transform: 'scale(1) translateY(0)' } },
        shake: { '0%, 100%': { transform: 'translateX(0)' }, '25%': { transform: 'translateX(-5px)' }, '75%': { transform: 'translateX(5px)' } },
        pulseGlow: { '0%': { boxShadow: '0 0 0 0 rgba(37, 211, 102, 0.7)' }, '70%': { boxShadow: '0 0 0 15px rgba(37, 211, 102, 0)' }, '100%': { boxShadow: '0 0 0 0 rgba(37, 211, 102, 0)' } },
      },
    },
  },
  plugins: [],
};
