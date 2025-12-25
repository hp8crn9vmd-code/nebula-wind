/**
 * NebulaWind Content Adapter Types
 * - Clean-room + generic enough to support multiple backends (Astro, CMS, filesystem, etc.)
 * - Keep these types stable; adapters can extend via generics if needed.
 */

export type ContentKind = 'article' | 'page' | 'doc';

export interface ContentMeta {
  title?: string;
  description?: string;
  date?: string;       // ISO string
  updated?: string;    // ISO string
  tags?: string[];
  readingTime?: number;
  draft?: boolean;
}

export interface ContentItem {
  kind: ContentKind;
  slug: string;
  meta: ContentMeta;
  /**
   * Renderable body. For Astro collections this can be markdown/MDX raw body or rendered HTML,
   * depending on adapter policy. We'll standardize later.
   */
  body: string;
  /**
   * Optional raw data for advanced use-cases (frontmatter, AST, etc.)
   */
  raw?: unknown;
}

export interface AdapterHealth {
  name: string;
  ok: boolean;
  details?: string;
}
