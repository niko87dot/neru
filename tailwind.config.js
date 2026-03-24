/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'gb-bg':     '#9bbc0f',  // page background
        'gb-screen': '#8bac0f',  // card / screen surface
        'gb-mid':    '#306230',  // borders, dividers, progress fill
        'gb-dark':   '#0f380f',  // text, pixels, checkbox fill
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
      },
    },
  },
  plugins: [],
}
