/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Screen zone — Gameboy green
        'gb-bg':     '#9bbc0f',
        'gb-mid':    '#306230',
        'gb-dark':   '#0f380f',
        // Controls zone — dark
        'lcd-bg':    '#0a0a0a',
        'lcd-green': '#74b83e',
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
      },
    },
  },
  plugins: [],
}
