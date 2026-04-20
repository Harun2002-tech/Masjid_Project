/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",

  theme: {
    extend: {
      colors: {
        red: {
          glow: "#ef4444",
          deep: "#b91c1c",
        },
        gold: {
          DEFAULT: "#fbbf24",
          deep: "#d4af37",
        },
        dark: {
          DEFAULT: "#0b1220",
        },
      },

      boxShadow: {
        redGlow: "0 0 25px rgba(239,68,68,0.35)",
        goldGlow: "0 0 25px rgba(251,191,36,0.35)",
      },
    },
  },

  plugins: [],
};
