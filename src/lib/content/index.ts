import type { ListOptions } from './adapters/base';
import type { BlogPostDTO, LibraryItemDTO } from './types';
import { astroContentAdapter } from './adapters/astro';

// Default adapter (Astro content). Later you can swap by env/config.
const adapter = astroContentAdapter();

export type { ListOptions, BlogPostDTO, LibraryItemDTO };

export async function getBlogPosts(opts?: ListOptions): Promise<BlogPostDTO[]> {
  return adapter.listBlogPosts(opts);
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPostDTO | null> {
  return adapter.getBlogPost(slug);
}

export async function getLibraryItems(opts?: ListOptions): Promise<LibraryItemDTO[]> {
  return adapter.listLibraryItems(opts);
}

export async function getLibraryItemBySlug(slug: string): Promise<LibraryItemDTO | null> {
  return adapter.getLibraryItem(slug);
}
