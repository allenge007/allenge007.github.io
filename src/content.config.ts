import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const localized = z.object({
  zh: z.string(),
  en: z.string(),
});

const links = z.array(
  z.object({
    label: localized,
    url: z.url(),
  }),
).default([]);

const projectMetrics = z.array(
  z.object({
    value: z.string(),
    label: localized,
  }),
).default([]);

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
      slug: z.string(),
      title: localized,
      summary: localized,
      problem: localized,
      work: localized,
      outcome: localized,
      date: z.string(),
      role: localized,
      status: localized,
      stack: z.array(z.string()),
      metrics: projectMetrics,
      featured: z.boolean().default(false),
      image: z.string().optional(),
      imageDark: z.string().optional(),
      imageAlt: localized.optional(),
      links,
    }),
});

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({
      slug: z.string(),
      title: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      updated: z.coerce.date().optional(),
      lang: z.enum(['zh', 'en']),
      tags: z.array(z.string()).default([]),
      draft: z.boolean().default(false),
      cover: z.enum(['after-rain', 'cloud-break']).optional(),
      coverAlt: z.string().optional(),
      coverCaption: z.string().optional(),
    })
    .refine((data) => !data.cover || Boolean(data.coverAlt), {
      message: 'Posts with a cover must provide coverAlt.',
      path: ['coverAlt'],
    }),
});

const notes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './.notes-generated' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    route: z.string(),
    sourcePath: z.string(),
    subject: z.enum(['math', 'computer-science', 'notes']),
    lang: z.literal('zh'),
    order: z.number().optional(),
    draft: z.boolean().default(false),
    comments: z.boolean().default(true),
    toc: z.boolean().default(true),
    noindex: z.boolean().default(false),
    updated: z.coerce.date().optional(),
  }),
});

export const collections = { projects, posts, notes };
