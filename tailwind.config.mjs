/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'formalogix': {
          50: '#EAF2FF',   // Very light blue
          100: '#d4e5ff',  // Lighter blue
          200: '#b2c9f3',  // Light blue
          300: '#7fa8f5',  // Medium light
          400: '#5b8ff4',  // Medium
          500: '#3C7FF3',  // PRIMARY BLUE
          600: '#2563eb',  // Darker blue
          700: '#1d4ed8',  // Very dark
          800: '#1e40af',  // Extra dark
          900: '#1e3a8a',  // Darkest
        },
        'formalogix-green': {
          500: '#66BD95',  // Accent green
          400: '#7fcca6',  // Light green
        }
      },
      fontFamily: {
        body: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
