import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getCollection('blog');
  return rss({
    title: 'GigFlow Pro Blog — Photography Business Guides',
    description: 'Practical tips on workflow, client management, payments, and growing your freelance photography business.',
    site: context.site!,
    items: posts
      .sort((a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf())
      .map(post => ({
        title: post.data.title,
        description: post.data.description,
        pubDate: post.data.publishDate,
        link: `/blog/${post.id}/`,
      })),
    customData: '<language>en-gb</language>',
  });
}
