import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { siteConfig } from '../../site.config';

export async function GET(context: { site: URL }) {
  const posts = (await getCollection('posts', ({ data }) => !data.draft))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return rss({
    title: 'Allenge · Writing',
    description: siteConfig.description.zh,
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `/blog/${post.data.slug}/`,
      categories: post.data.tags,
      customData: `<language>${post.data.lang === 'zh' ? 'zh-CN' : 'en'}</language>`,
    })),
  });
}
