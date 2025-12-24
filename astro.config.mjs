import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: process.env.SITE_URL || 'https://example.com',
  integrations: [
    tailwind({ applyBaseStyles: false }),
    sitemap(),
    starlight({
      title: 'NebulaWind Docs',
      description: 'Documentation for NebulaWind — clean-room production starter.',
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/' }
      ],
      sidebar: [
        { label: 'Start Here', items: [{ label: 'Introduction', link: '/docs/' }] },
        { label: 'Guides', items: [{ label: 'Project Structure', link: '/docs/guides/structure/' }] },
      ],
    }),
  ],
});
