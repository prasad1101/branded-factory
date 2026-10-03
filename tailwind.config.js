/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Deep rich base
        navy: {
          DEFAULT: '#0F1B2D',
          50: '#EEF1F6',
          100: '#D5DCE7',
          200: '#A9B6CB',
          300: '#7487A5',
          400: '#46597A',
          500: '#2A3B57',
          600: '#1C2B43',
          700: '#152238',
          800: '#0F1B2D',
          900: '#0A1320',
          950: '#060C15',
        },
        // Warm champagne / gold accent for premium touches
        gold: {
          DEFAULT: '#C9A24B',
          50: '#FBF7EC',
          100: '#F5ECD2',
          200: '#EBD9A6',
          300: '#DFC27A',
          400: '#D4AE5C',
          500: '#C9A24B',
          600: '#A9843A',
          700: '#86672F',
          800: '#634C24',
          900: '#43331A',
        },
        // Savings / discount colour (coral red)
        coral: {
          DEFAULT: '#E5484D',
          50: '#FEF2F2',
          100: '#FDE3E3',
          200: '#FBC9CA',
          500: '#E5484D',
          600: '#C9363B',
          700: '#A52A2F',
        },
        // "You save" success green
        save: {
          DEFAULT: '#15803D',
          50: '#F0FDF4',
          100: '#DCFCE7',
          600: '#15803D',
          700: '#166534',
        },
        // Off-white / cream canvas
        cream: {
          DEFAULT: '#FAF7F2',
          50: '#FDFCFA',
          100: '#FAF7F2',
          200: '#F3EDE3',
          300: '#E8DFD0',
        },
        ink: {
          DEFAULT: '#1B2333',
          muted: '#5B6577',
        },
        whatsapp: {
          DEFAULT: '#25D366',
          dark: '#0F7C70', // darkened from #128C7E for WCAG AA with white text
          deep: '#075E54',
        },
      },
      fontFamily: {
        serif: ['Fraunces', 'Georgia', 'Cambria', 'serif'],
        sans: ['Manrope', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(15,27,45,0.04), 0 4px 16px rgba(15,27,45,0.06)',
        lift: '0 2px 4px rgba(15,27,45,0.05), 0 16px 40px rgba(15,27,45,0.12)',
        gold: '0 8px 30px rgba(201,162,75,0.25)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
        pulseRing: {
          '0%': { transform: 'scale(1)', opacity: '0.6' },
          '80%, 100%': { transform: 'scale(1.7)', opacity: '0' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.4s linear infinite',
        'pulse-ring': 'pulseRing 2.2s cubic-bezier(0.2,0.6,0.4,1) infinite',
        marquee: 'marquee 30s linear infinite',
      },
    },
  },
  plugins: [],
}
