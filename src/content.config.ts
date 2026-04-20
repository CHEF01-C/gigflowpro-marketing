import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.coerce.date(),
    author: z.string().default('GigFlow Pro'),
    tags: z.array(z.string()).default([]),
    ogImage: z.string().optional(),
    seoTitle: z.string().optional(),
  }),
});

export const collections = { blog };
