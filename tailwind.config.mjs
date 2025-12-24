/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}",
    "./content/**/*.{md,mdx,json,yaml,yml}",
    "./docs/**/*.{md,mdx}"
  ],
  theme: {
    extend: {
      borderRadius: {
        'nw': 'var(--nw-radius)'
      },
      colors: {
        'nw-bg': 'rgb(var(--nw-bg) / <alpha-value>)',
        'nw-fg': 'rgb(var(--nw-fg) / <alpha-value>)',
        'nw-muted': 'rgb(var(--nw-muted) / <alpha-value>)',
        'nw-accent': 'rgb(var(--nw-accent) / <alpha-value>)'
      }
    }
  },
  darkMode: ["class", '[data-theme="dark"]'],
  plugins: []
};
