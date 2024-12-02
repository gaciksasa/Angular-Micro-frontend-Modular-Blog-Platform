/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./projects/shell/src/**/*.{html,ts,scss}",
    "./projects/blog-viewer/src/**/*.{html,ts,scss}",
    "./projects/blog-manager/src/**/*.{html,ts,scss}",
    "./projects/shared-lib/src/**/*.{html,ts,scss}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
