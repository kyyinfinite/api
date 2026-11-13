/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: '#F2F0E9',
          soft: '#F8F6F0',
          raised: '#FDFCF9',
        },
        ink: {
          DEFAULT: '#111318',
          soft: '#697080',
        },
        cobalt: {
          DEFAULT: '#3457D5',
          deep: '#1749D8',
          light: '#4E79EA',
        },
        signal: {
          DEFAULT: '#E66B45',
        },
        navy: {
          DEFAULT: '#111827',
          panel: '#171E2C',
          border: '#232A40',
        },
        line: {
          DEFAULT: '#D8D5CB',
          muted: '#E6E2D8',
        },
        success: {
          DEFAULT: '#20C76A',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        tactile: '0 6px 0 0 #1749D8',
        tactileLine: '0 5px 0 0 #D8D5CB',
        tactileNavy: '0 6px 0 0 #0A0F1C',
        card: '0 14px 30px rgba(30, 35, 60, 0.10)',
        console: '0 30px 60px rgba(20, 25, 45, 0.25)',
        dropdown: '0 18px 40px rgba(17, 24, 39, 0.12)',
      },
      letterSpacing: {
        wideCaps: '0.14em',
      },
      maxWidth: {
        shell: '1440px',
      },
    },
  },
  plugins: [],
}
