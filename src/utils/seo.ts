export type SeoInput = {
  title?: string;
  description?: string;
  canonical?: string;
  noindex?: boolean;
};

const SITE_NAME = 'NebulaWind';
const DEFAULT_DESCRIPTION =
  'NebulaWind — modern, clean-room Astro starter with quality gates, SEO, and accessibility baked in.';

export function buildSeo(input: SeoInput = {}) {
  const title = input.title ? `${input.title} · ${SITE_NAME}` : SITE_NAME;

  return {
    title,
    description: input.description ?? DEFAULT_DESCRIPTION,
    canonical: input.canonical,
    noindex: input.noindex ?? false,
  };
}
