// Adapter contract: swap Astro content with other backends later (JSON, CMS, etc.)
export type SortOrder = 'asc' | 'desc';

export interface ListOptions {
  includeDrafts?: boolean;
  limit?: number;
  order?: SortOrder;
}

export interface BlogPostDTO {
  slug: string;
  title: string;
  description?: string;
  pubDate: Date;
  updatedDate?: Date;
  tags: string[];
  author?: string;
  draft: boolean;
}

export interface LibraryItemDTO {
  slug: string;
  title: string;
  description?: string;
  url?: string;
  category?: string;
  pubDate?: Date;
  tags: string[];
  draft: boolean;
}

export interface ContentAdapter {
  listBlogPosts(opts?: ListOptions): Promise<BlogPostDTO[]>;
  getBlogPost(slug: string): Promise<BlogPostDTO | null>;

  listLibraryItems(opts?: ListOptions): Promise<LibraryItemDTO[]>;
  getLibraryItem(slug: string): Promise<LibraryItemDTO | null>;
}
