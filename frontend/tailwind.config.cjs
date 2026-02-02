/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'serif']
      },
      colors: {
        bg: '#f8f7f4',
        card: '#ffffff',
        foreground: '#1a1a1a',
        muted: '#6b7280',
        border: '#e5e5e5',
        accent: '#d4a853',
        success: '#22c55e',
        destructive: '#ef4444'
      },
      backgroundImage: {
        'primary-gradient': 'linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%)',
        'accent-gradient': 'linear-gradient(135deg, #d4a853 0%, #e8c068 100%)'
      }
    }
  },
  plugins: []
};
