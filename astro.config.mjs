import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import starlight from "@astrojs/starlight";
export default defineConfig({
  // GitHub Pages canonical base (adjust if you later move domains)
  site: "https://hp8crn9vmd-code.github.io/nebula-wind/",

  output: "static",

  vite: {
    // Keeps CI output clean from upstream Vite warnings originating in node_modules.
    logLevel: "error",
  },

  integrations: [
    tailwind(),
    sitemap(),
    starlight({
      

      disable404Route: true,title: "NebulaWind Docs",

      // Disable Starlight's built-in Pagefind indexing/UI (we index once globally in our build script)
      pagefind: false,

      // Social config (array syntax)
      social: [
        { icon: "github", label: "GitHub", href: "https://github.com/hp8crn9vmd-code/nebula-wind" },
      ],
    }),
  ],
});