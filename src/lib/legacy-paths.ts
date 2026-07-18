import { readdirSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

function walkMarkdown(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolute = join(directory, entry.name);
    if (entry.isDirectory()) return walkMarkdown(absolute);
    if (!entry.isFile() || !entry.name.endsWith('.md') || entry.name.endsWith('.hidden.md')) return [];
    return [absolute];
  });
}

export function legacyNotePaths(section: 'math' | 'cs') {
  const root = join(process.cwd(), 'src', 'content', 'notes', section);
  return walkMarkdown(root).map((file) => {
    const markdownPath = relative(root, file).split(sep).join('/').replace(/\.md$/, '');
    const slug = markdownPath === 'index'
      ? undefined
      : markdownPath.endsWith('/index')
        ? markdownPath.slice(0, -'/index'.length)
        : markdownPath;
    const suffix = slug ? `${slug}/` : '';
    return {
      params: { slug },
      props: { target: `/notes/${section}/${suffix}` },
    };
  });
}
