// Central DTO types used by content layer.
// NOTE: exactOptionalPropertyTypes=true => optional props must be omitted when undefined.

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
  tags: string[];
  draft: boolean;
  pubDate?: Date;
  updatedDate?: Date;
  url?: string;
  category?: string;
}
