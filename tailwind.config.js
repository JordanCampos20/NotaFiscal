/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {},
  },
  darkMode: [
    'selector',
    '[class~="app-dark"]'
  ],
  plugins: [
    require('tailwindcss-primeui'),
    require('@tailwindcss/forms')
  ]
}
