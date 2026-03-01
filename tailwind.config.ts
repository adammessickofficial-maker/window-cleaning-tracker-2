import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#f5f6f8',
        surface: '#ffffff',
        ink: '#111827',
        muted: '#6b7280',
        brand: '#0f172a'
      },
      boxShadow: {
        card: '0 8px 30px rgba(15, 23, 42, 0.08)'
      },
      borderRadius: {
        xl2: '1rem'
      }
    }
  },
  plugins: []
} satisfies Config;
