import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2A5F58",
          dark: "#1F4A45",
          light: "#4A7B75",
          900: "#13302C",
        },
        sage: {
          50:  "#F2F6F4",
          100: "#DCE7E2",
          200: "#BFCFC9",
          300: "#9DB6AE",
          500: "#6F8B83",
          700: "#3F605A",
          900: "#1F3A35",
        },
        cream: {
          DEFAULT: "#F5F0E8",
          dark: "#E8DFD0",
        },
        earth: {
          DEFAULT: "#5A3E2A",
          light: "#8B6F52",
        },
        ink: "#1A1A1A",
        mute: "#6B6B6B",
        line: "#DDE5E1",
      },
      fontFamily: {
        // 단일 산세리프 시스템 — sans/serif/display 모두 같은 패밀리
        sans:  ["var(--font-noto-kr)", "var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-noto-kr)", "var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-noto-kr)", "var(--font-inter)", "system-ui", "sans-serif"],
      },
      maxWidth: { container: "1320px" },
      keyframes: {
        marquee: {
          "0%":   { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: { marquee: "marquee 40s linear infinite" },
    },
  },
  plugins: [],
};

export default config;
