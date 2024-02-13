import starlightPlugin from "@astrojs/starlight-tailwind";

// Generated color palettes
// https://starlight.astro.build/guides/css-and-tailwind/#color-theme-editor
const accent = { 200: "#c5c6e0", 600: "#6462a8", 900: "#2f2e4d", 950: "#222135" };
const gray = {
  100: "#f5f6f9",
  200: "#ebeef4",
  300: "#bfc2c9",
  400: "#858c99",
  500: "#525864",
  700: "#333844",
  800: "#222732",
  900: "#16181d",
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: { accent, gray },
    },
  },
  plugins: [starlightPlugin()],
};
