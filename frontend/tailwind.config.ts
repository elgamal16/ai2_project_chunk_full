import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#02615b',
          container: '#2c7a74',
          hover: '#014d48',
        },
        surface: {
          DEFAULT: '#eafdfb',
          container: '#def2ef',
          low: '#e4f8f5',
          lowest: '#ffffff',
        },
        'on-surface': {
          DEFAULT: '#0d1e1d',
          variant: '#3f4947',
        },
        outline: {
          DEFAULT: '#6f7977',
          variant: '#bec9c7',
        },
        error: {
          DEFAULT: '#ba1a1a',
          container: '#ffdad6',
        },
        risk: {
          high: {
            bg: '#fceaea',
            fg: '#bd3b3b',
          },
          medium: {
            bg: '#fef6ec',
            fg: '#b46e1b',
          },
          low: {
            bg: '#e8f5ee',
            fg: '#2e7d5b',
          },
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        arabic: ['Cairo', '"IBM Plex Sans Arabic"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '12px',
        control: '8px',
      },
    },
  },
  plugins: [],
} satisfies Config;

