import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkNotesCompat from './src/lib/remark-notes-compat';
import { notesCodeMetaTransformer } from './src/lib/shiki-notes-meta';

export default defineConfig({
  site: 'https://www.allenge.me',
  output: 'static',
  trailingSlash: 'always',
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !page.includes('/404/') && !page.includes('/legacy/'),
    }),
  ],
  markdown: {
    processor: unified({
      remarkPlugins: [remarkGfm, remarkMath, remarkNotesCompat],
      rehypePlugins: [rehypeKatex],
    }),
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      wrap: true,
      transformers: [notesCodeMetaTransformer],
    },
  },
  image: {
    layout: 'constrained',
    responsiveStyles: true,
  },
  build: {
    assets: '_assets',
    inlineStylesheets: 'auto',
  },
  vite: {
    build: {
      cssMinify: 'lightningcss',
    },
  },
});
