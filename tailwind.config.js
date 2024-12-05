module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'], // Paths to your components
  darkMode: false, // or 'media' or 'class' depending on your dark mode strategy
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {}, // Customize or extend default Tailwind styles here
  },
  variants: {
    extend: {}, // Add any Tailwind variants (hover, active, etc.)
  },
  plugins: [], // Add any additional plugins here
}

