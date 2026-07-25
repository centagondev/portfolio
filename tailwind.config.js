/** @type {import('tailwindcss').Config} */
export default {
  /*
   * Wraps every `hover:` utility in `@media (hover: hover)`, so card
   * and button hovers never fire (and stick) on touch devices.
   */
  future: { hoverOnlyWhenSupported: true },
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        deep: "#05070f",
        navy: {
          1: "#0a1730",
          2: "#14315f",
          3: "#1e4079",
        },
        midblue: "#5c83cc",
        silk: "#a9c8ef",
        sky: "#cfe0ff",
        electric: "#3571ff",
        lightblue: "#94b4ff",
        muted: "#9fb0cc",
      },
      fontFamily: {
        display: ['"Space Grotesk"', "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        display: "-0.02em",
      },
      fontWeight: {
        400: "400",
        500: "500",
        600: "600",
        700: "700",
      },
      transitionTimingFunction: {
        silk: "cubic-bezier(.2,.7,.2,1)",
      },
      animation: {
        marquee: "marquee 42s linear infinite",
        caret: "caret 1.1s steps(1) infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        caret: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};
