module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        salon: {
          primary: '#8B5CF6',
          secondary: '#EC4899',
          accent: '#06B6D4',
          dark: '#1F2937',
          light: '#F9FAFB'
        }
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};