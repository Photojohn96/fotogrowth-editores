import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        'fg-bg': '#0A0A0A',
        'fg-azul': '#3B82F6',
        'fg-acento': '#F59E0B'
      },
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif']
      }
    }
  },
  plugins: []
}
export default config
