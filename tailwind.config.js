/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans:  ["Nunito", "system-ui", "sans-serif"],
        serif: ["Lora", "Georgia", "serif"],
      },
      colors: {
        teal: {
          DEFAULT: "#0C7A6A",
          hover:   "#0A6658",
          press:   "#085549",
          mid:     "#4DB8A4",
          lt:      "#C9F5EC",
          ltt:     "#EDFAF6",
        },
        ink: {
          1: "#111827",
          2: "#1F2937",
          3: "#374151",
          4: "#4B5563",
          5: "#6B7280",
        },
        surface: {
          DEFAULT: "#F7FAFC",
          2:       "#EEF7F5",
          card:    "#FFFFFF",
        },
        sidebar: {
          DEFAULT: "#F0FAF8",
          border:  "#C8E6DF",
          hover:   "#E0F5F0",
          active:  "#C9F5EC",
        },
      },
      borderRadius: {
        xs: "6px",
        sm: "10px",
        DEFAULT: "14px",
        lg: "20px",
        xl: "28px",
      },
      boxShadow: {
        xs: "0 1px 3px rgba(0,0,0,.06)",
        sm: "0 2px 6px rgba(0,0,0,.07)",
        DEFAULT: "0 3px 12px rgba(0,0,0,.08)",
        lg: "0 6px 20px rgba(0,0,0,.09)",
      },
      animation: {
        "fade-up":  "fadeUp 0.28s ease both",
        "scale-in": "scaleIn 0.22s ease both",
      },
      keyframes: {
        fadeUp:  {
          from: { opacity: "0", transform: "translateY(8px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          from: { opacity: "0", transform: "scale(0.98)" },
          to:   { opacity: "1", transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};
