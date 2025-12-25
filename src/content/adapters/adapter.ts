import type { ContentItem, ContentKind, AdapterHealth } from './types';

export interface ContentAdapter {
  /** human-readable adapter name */
  readonly name: string;

  /** quick self-check (useful for gates/diagnostics later) */
  health(): Promise<AdapterHealth>;

  /** list all items of a kind */
  list(kind: ContentKind): Promise<ContentItem[]>;

  /** get a single item by slug */
  get(kind: ContentKind, slug: string): Promise<ContentItem | null>;
}
