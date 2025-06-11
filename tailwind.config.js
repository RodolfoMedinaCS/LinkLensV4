/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'sans-serif'],
      },
      colors: {
        background: '#0D1117',
        card: '#161B22',
        border: '#21262D',
        primary: '#3E63DD',
        'primary-dark': '#2a4ec2',
        error: '#E5534B',
        muted: '#8A94A4',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
} 