import type { ShikiTransformer } from '@shikijs/types';

function rawMeta(context: { options: { meta?: { __raw?: string } } }): string {
  return context.options.meta?.__raw ?? '';
}

function field(meta: string, name: string): string | undefined {
  return meta.match(new RegExp(`(?:^|\\s)${name}=(?:"([^"]+)"|'([^']+)'|([^\\s]+))`))
    ?.slice(1)
    .find(Boolean);
}

function highlightedLines(meta: string): Set<number> {
  const value = field(meta, 'hl_lines');
  const lines = new Set<number>();
  value?.split(/\s+/).forEach((part) => {
    const [start, end = start] = part.split('-').map(Number);
    if (!Number.isFinite(start) || !Number.isFinite(end)) return;
    for (let line = start; line <= end; line += 1) lines.add(line);
  });
  return lines;
}

export const notesCodeMetaTransformer: ShikiTransformer = {
  name: 'allenge:notes-code-meta',
  pre(node) {
    const meta = rawMeta(this);
    const title = field(meta, 'title');
    const lineStart = field(meta, 'linenums');
    const highlights = field(meta, 'hl_lines');
    if (title) node.properties.dataCodeTitle = title;
    if (lineStart) node.properties.dataLineStart = lineStart;
    if (highlights) node.properties.dataHighlightLines = highlights;
  },
  line(node, line) {
    if (!highlightedLines(rawMeta(this)).has(line)) return;
    this.addClassToHast(node, 'is-highlighted');
  },
};
