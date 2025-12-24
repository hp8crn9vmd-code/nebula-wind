import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: process.env.SITE_URL || 'https://example.com',
  integrations: [
    tailwind({ applyBaseStyles: false }),
    sitemap(),
  ],
});
