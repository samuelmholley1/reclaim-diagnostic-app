/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    // If you ever add a 'pages' directory, you'd add:
    // "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // These are examples based on your globals.css
        // Ensure they match what you want for Tailwind classes like 'text-brand-dark'
        'brand-background': '#F8FAFC',
        'brand-text-secondary': '#4A5568',
        'brand-text-primary': '#1A365D', // Same as brand-dark in your globals
        'brand-dark': '#1A365D',
        // YOU NEED TO DEFINE YOUR ACCENT COLOR HERE for bg-brand-accent to work
        // Pick an orange from your logo, for example:
        'brand-accent': '#F97316', // Example: A nice orange. Replace with your actual brand accent hex code.
        'brand-disabled': '#E2E8F0', // Example disabled color for borders etc.
        'brand-primary': '#3B82F6',  // Example primary color if needed for hover etc.
      },
      fontFamily: {
        // If you want to use 'Inter' via Tailwind classes like 'font-sans'
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
