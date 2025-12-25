/**
 * Astro Content Collections adapter.
 *
 * Important:
 * - TypeScript is strict with exactOptionalPropertyTypes, so we MUST omit keys when undefined.
 */

import type { ContentAdapter } from './adapter';
import type { AdapterHealth, ContentItem, ContentKind, ContentMeta } from './types';

type CollectionName = string;

const DEFAULT_COLLECTIONS: Record<ContentKind, CollectionName> = {
  article: 'blog',
  page: 'pages',
  doc: 'docs',
};

function collectionFor(kind: ContentKind): CollectionName {
  const envKey =
    kind === 'article'
      ? 'NBW_COLLECTION_ARTICLE'
      : kind === 'page'
        ? 'NBW_COLLECTION_PAGE'
        : 'NBW_COLLECTION_DOC';

  const v = (import.meta as any).env?.[envKey] ?? (process as any).env?.[envKey];
  return (typeof v === 'string' && v.trim()) ? v.trim() : DEFAULT_COLLECTIONS[kind];
}

function isoOrUndefined(v: unknown): string | undefined {
  if (!v) return undefined;
  const d = new Date(v as any);
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
}

function buildMeta(data: any): ContentMeta {
  const date = isoOrUndefined(data?.date);
  const updated = isoOrUndefined(data?.updated);

  const tags = Array.isArray(data?.tags) ? data.tags : undefined;
  const readingTime = typeof data?.readingTime === 'number' ? data.readingTime : undefined;
  const draft = typeof data?.draft === 'boolean' ? data.draft : undefined;

  return {
    ...(typeof data?.title === 'string' ? { title: data.title } : {}),
    ...(typeof data?.description === 'string' ? { description: data.description } : {}),
    ...(date ? { date } : {}),
    ...(updated ? { updated } : {}),
    ...(tags ? { tags } : {}),
    ...(typeof readingTime === 'number' ? { readingTime } : {}),
    ...(typeof draft === 'boolean' ? { draft } : {}),
  };
}

export class AstroContentAdapter implements ContentAdapter {
  readonly name = 'astro:content';

  async health(): Promise<AdapterHealth> {
    return { name: this.name, ok: true };
  }

  async list(kind: ContentKind): Promise<ContentItem[]> {
    const mod = await import('astro:content');
    const getCollection = (mod as any).getCollection as (name: string) => Promise<any[]>;
    const collection = collectionFor(kind);

    const entries = await getCollection(collection);

    return entries.map((e: any) => ({
      kind,
      slug: String(e?.slug ?? ''),
      meta: buildMeta(e?.data),
      body: typeof e?.body === 'string' ? e.body : '',
      raw: e,
    }));
  }

  async get(kind: ContentKind, slug: string): Promise<ContentItem | null> {
    const mod = await import('astro:content');
    const getEntry = (mod as any).getEntry as (name: string, slug: string) => Promise<any>;
    const collection = collectionFor(kind);

    try {
      const e = await getEntry(collection, slug);
      if (!e) return null;

      return {
        kind,
        slug: String(e?.slug ?? slug),
        meta: buildMeta(e?.data),
        body: typeof e?.body === 'string' ? e.body : '',
        raw: e,
      };
    } catch {
      return null;
    }
  }
}
