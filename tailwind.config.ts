import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        rosehouse: {
          primary: '#ff8fbc',
          deep: '#ff5fa2',
          light: '#ffe4ef',
          soft: '#fff3f8',
          cream: '#fffafc',
          purple: '#c8a2ff',
          ink: '#5a3d4f',
          muted: '#9c7b91'
        }
      },
      boxShadow: {
        love: '0 12px 30px rgba(255, 143, 188, 0.18)'
      }
    }
  },
  plugins: []
};

export default config;
