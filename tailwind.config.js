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
        sans: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
      },
      colors: {
        background: '#0D1117',
        card: '#161B22',
        border: '#21262D',
        primary: {
          DEFAULT: '#3E63DD',
          hover: '#2a4ec2',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#8A94A4',
        },
        success: '#2DA44E',
        warning: '#C69026',
        error: '#E5534B',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
} 