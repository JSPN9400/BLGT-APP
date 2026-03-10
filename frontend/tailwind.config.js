/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#08111f",
        panel: "#0f1b2d",
        accent: "#f97316",
        sand: "#f4ebe1",
        "accent-soft": "#ffd0a8",
        app: "#09121c"
      },
      fontFamily: {
        display: ["Cambria", "Georgia", "serif"],
        body: ["Segoe UI", "Trebuchet MS", "sans-serif"]
      }
    }
  },
  plugins: []
};
