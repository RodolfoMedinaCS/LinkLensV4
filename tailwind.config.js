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
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        primary: '#FFFFFF',
        secondary: '#8A94A4',
        accent: '#3E63DD',
        'accent-hover': '#2a4ec2',
        background: '#0D1117',
        card: '#161B22',
        border: '#21262D',
        error: '#E5534B',
        success: '#2DA44E',
        warning: '#C69026',
      },
      borderRadius: {
        none: '0',
        sm: '2px',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}