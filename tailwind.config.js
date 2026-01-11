/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#6C63FF",
        primaryLight: "#E7E6FF",
        darkText: "#1F2937",
        mutedText: "#6B7280",
        borderLight: "#E5E7EB",
      },
      borderRadius: {
        xl: "12px",
      },
    },
  },
  plugins: [],
};
