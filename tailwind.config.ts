import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{md,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cool slate, tinted toward PostgreSQL blue.
        ink: {
          50: "#f4f7fa",
          100: "#e8eef3",
          200: "#d0dbe5",
          300: "#a9bccb",
          400: "#7590a6",
          500: "#527089",
          600: "#3c566c",
          700: "#2c4257",
          800: "#1c2f41",
          900: "#12222f",
          950: "#0b1722",
        },
        // PostgreSQL elephant blue; 500 is the official #336791.
        brand: {
          50: "#eef5fa",
          100: "#d9e8f2",
          200: "#b5d1e5",
          300: "#86b2d2",
          400: "#6aa3cc",
          500: "#336791",
          600: "#2a5679",
          700: "#234762",
          800: "#1d3a50",
          900: "#182f41",
          950: "#0f1e2b",
        },
        // postgresql.org link cyan, used sparingly.
        accent: {
          50: "#ecf8fc",
          100: "#d0eef7",
          200: "#a3ddef",
          300: "#6cc5e2",
          400: "#32a8cf",
          500: "#0085b0",
          600: "#006f94",
          700: "#005a78",
          800: "#00475f",
          900: "#00384b",
          950: "#00222e",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      // Documentation-like, squared-off corners instead of soft SaaS cards.
      borderRadius: {
        md: "3px",
        lg: "4px",
        xl: "4px",
        "2xl": "6px",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out",
        "slide-up": "slideUp 0.6s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
