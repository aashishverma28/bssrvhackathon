/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "warm-white": "#F5F0EB",
        "off-white": "#FAFAF7",
        "dark": "#1A1A1A",
        "dark-soft": "#2C2C2C",
        "accent": "#C4704F",
        "accent-sage": "#7D9B76",
        "accent-amber": "#D4A853",
        "muted": "#8A8A8A",
        "border-soft": "#E0D9D0",
        "alert-bg": "#1C1C1E",
        "alert-text": "#E8E8E8",
      },
      fontFamily: {
        heading: ["Plus Jakarta Sans", "Sora", "sans-serif"],
        body: ["Inter", "Manrope", "sans-serif"],
        mono: ["JetBrains Mono", "Courier New", "monospace"],
      },
      fontSize: {
        "display": ["4.5rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "headline": ["3rem", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
        "title": ["1.75rem", { lineHeight: "1.3" }],
        "body-lg": ["1.125rem", { lineHeight: "1.7" }],
        "body": ["1rem", { lineHeight: "1.65" }],
        "small": ["0.875rem", { lineHeight: "1.5" }],
        "label": ["0.75rem", { lineHeight: "1.4", letterSpacing: "0.08em" }],
      },
      spacing: {
        "section": "7rem",
        "section-sm": "4rem",
        "container": "1200px",
      },
      borderRadius: {
        "rough": "3px",
        "soft": "8px",
        "card": "12px",
      },
      boxShadow: {
        "card": "0 2px 12px rgba(0,0,0,0.06)",
        "alert": "0 4px 24px rgba(0,0,0,0.15)",
      },
      rotate: {
        "slight": "-2deg",
        "slight-pos": "1.5deg",
      },
      animation: {
        "fade-up": "fadeUp 0.5s ease forwards",
        "fade-in": "fadeIn 0.4s ease forwards",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: 0, transform: "translateY(16px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
}
