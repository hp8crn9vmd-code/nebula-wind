import rss from '@astrojs/rss';
import { getCollection, type CollectionEntry } from 'astro:content';
import type { APIContext } from 'astro';

type BlogEntry = CollectionEntry<'blog'>;

export async function GET(context: APIContext) {
  const posts: BlogEntry[] = (await getCollection('blog')).filter((p: BlogEntry) => !p.data.draft);

  return rss({
    title: 'NebulaWind Blog',
    description: 'Updates and articles from NebulaWind.',
    site: context.site!,
    items: posts.map((post: BlogEntry) => ({
      title: post.data.title,
      pubDate: post.data.publishDate,
      description: post.data.description,
      link: `/blog/${post.slug}/`,
    })),
  });
}
