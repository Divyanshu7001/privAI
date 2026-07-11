/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--bg-color)",
        card: "var(--card-bg)",
        border: "var(--border-color)",
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        brand: {
          DEFAULT: "var(--accent-color)",
          secondary: "var(--accent-secondary)",
        },
      },
      fontFamily: {
        sans: ["var(--font-family)", "system-ui", "sans-serif"],
        mono: ["var(--mono-font)", "monospace"],
      },
    },
  },
  plugins: [],
};

