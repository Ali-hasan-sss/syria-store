import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // اللون البنفسجي الأساسي (لونه هادي وأنيق)
        primary: {
          DEFAULT: "#6B46C1", // أرجواني معتدل (purple-600)
          light: "#9F7AEA", // فاتح (purple-400)
          dark: "#553C9A", // غامق (purple-800)
        },
        // لون ثانوي مميز ومشرق (مثلاً أصفر-ذهبي دافئ)
        secondary: {
          DEFAULT: "#D69E2E", // أصفر-ذهبي (yellow-600)
          light: "#F6E05E", // فاتح (yellow-400)
          dark: "#B7791F", // غامق (yellow-700)
        },
        // لون داعم للنصوص أو العناصر الثانوية (كـ teal أو cyan)
        accent: {
          DEFAULT: "#319795", // teal-600
          light: "#4FD1C5", // teal-400
          dark: "#2C7A7B", // teal-700
        },
        // لون خلفية للدارك مود
        background: {
          light: "#F7FAFC", // أبيض فاتح - للوضوح في وضع النهار
          dark: "#1A202C", // رمادي داكن جداً - للدارك مود
        },
        // لون النص الأساسي
        text: {
          light: "#2D3748", // رمادي داكن - للنص في الوضع العادي
          dark: "#E2E8F0", // رمادي فاتح - للنص في الدارك مود
        },
      },
      fontFamily: {
        cairo: ["var(--font-cairo-sans)"],
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  darkMode: "class",
  plugins: [],
};

export default config;
