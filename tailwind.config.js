/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // --- YOUR NEW PALETTE ---
        primary: '#22333b',       // Deep Slate (Main Buttons/Nav)
        secondary: '#c6ac8f',     // Warm Tan (Accents)

        // Backgrounds
        background: '#eae0d5',    // Almond (Page BG)
        surface: '#ffffff',       // White (Keep cards white for readability)

        // Text Colors
        'text-main': '#0a0908',   // Jet Black (Headings)
        'text-muted': '#5e503f',  // Walnut (Subtitles)

        // Mapping old "Ocean" class names to your new Earthy Palette
        // This ensures existing code (Navbar, cards) automatically adopts the new look.
        'ocean-dark': '#0a0908',  // Jet Black
        'ocean-mid': '#22333b',   // Deep Slate
        'ocean-teal': '#5e503f',  // Walnut
        'ocean-sky': '#c6ac8f',   // Warm Tan
        'ocean-light': '#eae0d5', // Almond
      },
      borderRadius: {
        'DEFAULT': '0.5rem',      // rounded-lg
        'full': '0.5rem',         // Defined shapes (not round)
      }
    },
  },
  plugins: [],
}