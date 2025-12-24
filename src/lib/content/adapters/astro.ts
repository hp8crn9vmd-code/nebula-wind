// Astro Content adapter (Kaggle-safe, strict TS)
// - No `any`
// - exactOptionalPropertyTypes friendly: omit optional props when undefined
// - Exports `astroContentAdapter()` factory returning methods index.ts expects

import { getCollection, getEntryBySlug } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import type { BlogPostDTO, LibraryItemDTO } from '../types';

export type ListOpts = {
  limit?: number;
  includeDrafts?: boolean;
  tag?: string;
};

type UnknownRecord = Record<string, unknown>;

function asString(v: unknown, fallback = ''): string {
  return typeof v === 'string' ? v : fallback;
}
function asBool(v: unknown, fallback = false): boolean {
  return typeof v === 'boolean' ? v : fallback;
}
function asStringArray(v: unknown): string[] {
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : [];
}
function asDateOrUndefined(v: unknown): Date | undefined {
  if (v instanceof Date) return v;
  if (typeof v === 'number' || typeof v === 'string') {
    const d = new Date(v);
    return Number.isNaN(d.getTime()) ? undefined : d;
  }
  return undefined;
}

function blogFromEntry(e: CollectionEntry<'blog'>): BlogPostDTO {
  const d = (e.data ?? {}) as UnknownRecord;

  const base: BlogPostDTO = {
    slug: e.slug,
    title: asString(d.title),
    description: asString(d.description, ''),
    pubDate: asDateOrUndefined(d.pubDate) ?? new Date(),
    tags: asStringArray(d.tags),
    author: asString(d.author, ''),
    draft: asBool(d.draft, false),
  };

  const updatedDate = asDateOrUndefined(d.updatedDate);
  if (updatedDate) base.updatedDate = updatedDate;

  // If author ended up empty, omit it (optional)
  if (!base.author) delete (base as unknown as { author?: string }).author;

  return base;
}

function libraryFromEntry(e: CollectionEntry<'library'>): LibraryItemDTO {
  const d = (e.data ?? {}) as UnknownRecord;

  const base: LibraryItemDTO = {
    slug: e.slug,
    title: asString(d.title),
    description: asString(d.description, ''),
    tags: asStringArray(d.tags),
    draft: asBool(d.draft, false),
  };

  const pubDate = asDateOrUndefined(d.pubDate);
  if (pubDate) base.pubDate = pubDate;

  const updatedDate = asDateOrUndefined(d.updatedDate);
  if (updatedDate) base.updatedDate = updatedDate;

  const url = asString(d.url, '');
  if (url) base.url = url;

  const category = asString(d.category, '');
  if (category) base.category = category;

  // If description empty, omit it (optional)
  if (!base.description) delete (base as unknown as { description?: string }).description;

  return base;
}

async function listBlogPosts(opts: ListOpts = {}): Promise<BlogPostDTO[]> {
  const includeDrafts = Boolean(opts.includeDrafts);
  const tag = typeof opts.tag === 'string' ? opts.tag : undefined;
  const limit = typeof opts.limit === 'number' && opts.limit > 0 ? opts.limit : undefined;

  const entries = await getCollection('blog', (e: CollectionEntry<'blog'>) => {
    const d = (e.data ?? {}) as UnknownRecord;
    const draft = asBool(d.draft, false);
    if (!includeDrafts && draft) return false;
    if (tag) {
      const tags = asStringArray(d.tags);
      if (!tags.includes(tag)) return false;
    }
    return true;
  });

  const mapped = entries.map((e: CollectionEntry<'blog'>) => blogFromEntry(e));
  mapped.sort((a: BlogPostDTO, b: BlogPostDTO) => b.pubDate.getTime() - a.pubDate.getTime());
  return limit ? mapped.slice(0, limit) : mapped;
}

async function getBlogPost(slug: string): Promise<BlogPostDTO | null> {
  const s = asString(slug);
  if (!s) return null;
  const e = await getEntryBySlug('blog', s);
  return e ? blogFromEntry(e as CollectionEntry<'blog'>) : null;
}

async function listLibraryItems(opts: ListOpts = {}): Promise<LibraryItemDTO[]> {
  const includeDrafts = Boolean(opts.includeDrafts);
  const tag = typeof opts.tag === 'string' ? opts.tag : undefined;
  const limit = typeof opts.limit === 'number' && opts.limit > 0 ? opts.limit : undefined;

  const entries = await getCollection('library', (e: CollectionEntry<'library'>) => {
    const d = (e.data ?? {}) as UnknownRecord;
    const draft = asBool(d.draft, false);
    if (!includeDrafts && draft) return false;
    if (tag) {
      const tags = asStringArray(d.tags);
      if (!tags.includes(tag)) return false;
    }
    return true;
  });

  const mapped = entries.map((e: CollectionEntry<'library'>) => libraryFromEntry(e));
  mapped.sort((a: LibraryItemDTO, b: LibraryItemDTO) => {
    const ad = a.pubDate ? a.pubDate.getTime() : 0;
    const bd = b.pubDate ? b.pubDate.getTime() : 0;
    return bd - ad;
  });
  return limit ? mapped.slice(0, limit) : mapped;
}

async function getLibraryItem(slug: string): Promise<LibraryItemDTO | null> {
  const s = asString(slug);
  if (!s) return null;
  const e = await getEntryBySlug('library', s);
  return e ? libraryFromEntry(e as CollectionEntry<'library'>) : null;
}

// Factory (index.ts calls astroContentAdapter())
export function astroContentAdapter() {
  return {
    listBlogPosts,
    getBlogPost,
    listLibraryItems,
    getLibraryItem,
  };
}
