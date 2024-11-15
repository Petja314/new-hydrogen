import type {Config} from 'tailwindcss';

export default {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      container: {
        center: true,
        padding: '2rem',
      },
    },
  },
  plugins: [],
} satisfies Config;
