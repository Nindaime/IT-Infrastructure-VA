/** @type {import('tailwindcss').Config} */
export default {
  // THIS IS THE CRITICAL PART FOR TAILWIND V4's LOCAL COMPILATION.
  // The 'content' array tells Tailwind where to scan your project files for utility classes.
  // If Tailwind cannot find these files, it won't know which classes to generate,
  // leading to "unknown utility class" errors, especially with @apply directives in your CSS.
  content: [
    './index.html', // Essential: Scans your root HTML file
    // Essential: Scans all Vue components, JavaScript, TypeScript, JSX, and TSX files
    // within the 'src' directory and all its subdirectories.
    // Double-check this path very carefully against your actual folder structure.
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // Define your custom font family here to ensure 'Inter' is used
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
    screens: {
      xs: '400px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
  },
  plugins: [
    // Add any official Tailwind plugins here if you install them later (e.g., @tailwindcss/forms)
    '@tailwindcss/postcss',
  ],
}
