/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        tnesa: {
          primary: "#0ea5e9",
          dark: "#0c4a6e",
          gold: "#c9a227",
          platinum: "#b1c4d4",
        }
      }
    },
  },
  plugins: [],
}
