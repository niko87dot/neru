/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'lcd-bg': '#0a0a0a',
        'lcd-green': '#74b83e',
        'lcd-dark': '#3d6b1f',
        'lcd-text': '#c8e6a0',
        'lcd-dim': '#2a4a10',
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
      },
    },
  },
  plugins: [],
}
