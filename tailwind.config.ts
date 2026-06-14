import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // PRIMARY — hijau gudang nyaris-hitam. Dominan (~60% permukaan).
        // Warna interior gudang & rempah kering tua: permanen, tepercaya.
        primary: {
          DEFAULT: '#1B4332',
          50: '#EAF1EC',
          100: '#CBDCD0',
          200: '#A7C4B1',
          300: '#6E9B82',
          400: '#3F7257',
          500: '#1B4332',
          600: '#163A2B',
          700: '#11301F',
          800: '#0E281A',
          900: '#0A2016',
          950: '#06150E',
        },
        // SECONDARY — cokelat pinang/goni. Warna BAHAN untuk permukaan hangat.
        secondary: {
          DEFAULT: '#8B5E3C',
          50: '#F6EFE7',
          100: '#E7D8C9',
          200: '#D6BCA1',
          300: '#C29B74',
          400: '#A97C50',
          500: '#8B5E3C',
          600: '#704A2F',
          700: '#5E3D26',
          800: '#48301F',
          900: '#352417',
        },
        // ACCENT — emas kunyit. Percikan langka (<=5%): hanya CTA & highlight.
        accent: {
          DEFAULT: '#C9A84C',
          300: '#E3CE8C',
          400: '#D8BD6E',
          500: '#C9A84C',
          600: '#A6862F',
          700: '#856A24',
        },
        // brand — alias gold agar komponen lama (admin) tetap on-brand
        brand: {
          50: '#FBF6E7',
          100: '#F3E8C4',
          300: '#E3CE8C',
          400: '#D8BD6E',
          500: '#C9A84C',
          600: '#A6862F',
          700: '#856A24',
          800: '#6A531D',
          900: '#4F3E16',
        },
        // Permukaan & teks (memetakan plan: bg/surface/text)
        cream: '#FAF7F2',
        surface: '#FFFFFF',
        ink: {
          DEFAULT: '#1C1A17',
          muted: '#6B6357',
        },
        whatsapp: '#25D366',
        // Stone hangat untuk netral insidental
        stone: {
          50: '#FAF9F7',
          100: '#F3F1ED',
          200: '#E5E1DA',
          300: '#D2CCC1',
          400: '#A8A096',
          500: '#797165',
          600: '#574F45',
          700: '#423B33',
          800: '#2A251F',
          900: '#1A1712',
          950: '#0F0D0A',
        },
      },

      fontFamily: {
        display: ['var(--font-display)', 'Fraunces', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },

      backgroundImage: {
        // SIGNATURE — garis warp karung anyaman (biru, merah, pink) dari foto asli
        'karung-stripe':
          'repeating-linear-gradient(90deg,' +
          ' #2D5B8A 0 3px, transparent 3px 7px,' +
          ' #B23A48 7px 10px, transparent 10px 14px,' +
          ' #C98B9E 14px 17px, transparent 17px 21px)',
        // Glow skylight seng untuk atmosfer section gelap
        'skylight':
          'radial-gradient(120% 80% at 50% -10%, rgba(216,189,110,0.18), transparent 60%)',
      },

      boxShadow: {
        // Shadow ber-rona hijau, bukan abu netral
        card: '0 18px 40px -12px rgba(27, 67, 50, 0.25)',
        'card-sm': '0 6px 18px -8px rgba(27, 67, 50, 0.20)',
        glow: '0 0 0 1px rgba(201, 168, 76, 0.25), 0 12px 30px -10px rgba(201,168,76,0.30)',
      },

      borderRadius: {
        '4xl': '2rem',
      },

      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
      },
      animation: {
        'fade-up': 'fade-up 0.6s cubic-bezier(0.16,1,0.3,1) both',
        'fade-in': 'fade-in 0.5s ease-out both',
      },

      aspectRatio: {
        '4/3': '4 / 3',
        '3/4': '3 / 4',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
}

export default config
