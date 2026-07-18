import type { Root } from 'mdast';
import type { Plugin } from 'unified';

type MdNode = {
  type?: string;
  value?: string;
  lang?: string | null;
  meta?: string | null;
  children?: MdNode[];
  data?: {
    hName?: string;
    hProperties?: Record<string, unknown>;
  };
};

const admonitionNames: Record<string, string> = {
  abstract: '摘要',
  answer: '解答',
  contrast: '对照',
  danger: '危险',
  details: '展开阅读',
  example: '示例',
  failure: '注意',
  goal: '学习目标',
  info: '说明',
  note: '说明',
  question: '问题',
  quote: '引文',
  success: '要点',
  summary: '小结',
  tip: '提示',
  warning: '注意',
};

function textOf(node: MdNode): string {
  if (typeof node.value === 'string') return node.value;
  return node.children?.map(textOf).join('') ?? '';
}

function markerParagraph(node: MdNode | undefined): string | undefined {
  return node?.type === 'paragraph' ? textOf(node).trim() : undefined;
}

function decode(value = ''): string {
  try { return decodeURIComponent(value); } catch { return value; }
}

function elementParagraph(tag: string, className: string, text: string): MdNode {
  return {
    type: 'paragraph',
    data: { hName: tag, hProperties: { className: [className] } },
    children: [{ type: 'text', value: text }],
  };
}

function replaceInlineMarkup(parent: MdNode) {
  if (!parent.children) return;
  const next: MdNode[] = [];
  const pattern = /(\+\+([^+\n]+)\+\+|==([^=\n]+)==|\{--([\s\S]+?)--\}|\{\+\+([\s\S]+?)\+\+\})/g;
  for (const child of parent.children) {
    if (child.type !== 'text' || !child.value) {
      next.push(child);
      continue;
    }
    let cursor = 0;
    for (const match of child.value.matchAll(pattern)) {
      if (match.index! > cursor) next.push({ type: 'text', value: child.value.slice(cursor, match.index) });
      const tag = match[2] ? 'kbd' : match[3] ? 'mark' : match[4] ? 'del' : 'ins';
      const value = match[2] ?? match[3] ?? match[4] ?? match[5] ?? '';
      next.push({ type: 'text', value, data: { hName: tag, hProperties: {} } });
      cursor = match.index! + match[0].length;
    }
    if (cursor === 0) next.push(child);
    else if (cursor < child.value.length) next.push({ type: 'text', value: child.value.slice(cursor) });
  }
  parent.children = next;
}

function enhanceHeading(node: MdNode) {
  if (node.type !== 'heading' || !node.children?.length) return;
  const last = node.children.at(-1);
  if (last?.type !== 'text' || !last.value) return;
  const match = last.value.match(/\s*\{([^}]+)\}\s*$/);
  if (!match) return;
  const tokens = match[1].trim().split(/\s+/);
  const id = tokens.find((token) => token.startsWith('#'))?.slice(1);
  const classes = tokens.filter((token) => token.startsWith('.')).map((token) => token.slice(1));
  if (!id && !classes.length) return;
  last.value = last.value.slice(0, match.index).trimEnd();
  node.data ??= {};
  node.data.hProperties ??= {};
  if (id) node.data.hProperties.id = id;
  if (classes.length) node.data.hProperties.className = classes;
}

function enhanceAttributeList(node: MdNode) {
  if (node.type !== 'paragraph' || !node.children || node.children.length < 2) return;
  const attribute = node.children.at(-1);
  const target = node.children.at(-2);
  if (attribute?.type !== 'text' || !attribute.value || !target) return;
  const match = attribute.value.match(/^\s*\{([^}]+)\}\s*$/);
  if (!match) return;
  const tokens = match[1].trim().split(/\s+/);
  const id = tokens.find((token) => token.startsWith('#'))?.slice(1);
  const classes = tokens.filter((token) => token.startsWith('.')).map((token) => token.slice(1));
  if (!id && !classes.length) return;
  target.data ??= {};
  target.data.hProperties ??= {};
  if (id) target.data.hProperties.id = id;
  if (classes.length) target.data.hProperties.className = classes;
  node.children.pop();
}

function enhanceCode(node: MdNode) {
  if (node.type !== 'code') return;
  if (node.lang === 'mermaid') {
    const source = node.value ?? '';
    node.type = 'paragraph';
    delete node.lang;
    delete node.meta;
    delete node.value;
    node.children = [{ type: 'text', value: source }];
    node.data = {
      hName: 'pre',
      hProperties: { className: ['mermaid'], 'data-mermaid': true },
    };
    return;
  }
  if (!node.meta) return;
  const title = node.meta.match(/(?:^|\s)title=(?:"([^"]+)"|'([^']+)'|([^\s]+))/)?.slice(1).find(Boolean);
  const lineStart = node.meta.match(/(?:^|\s)linenums=(?:"([^"]+)"|'([^']+)'|([^\s]+))/)?.slice(1).find(Boolean);
  const highlights = node.meta.match(/(?:^|\s)hl_lines=(?:"([^"]+)"|'([^']+)'|([^\s]+))/)?.slice(1).find(Boolean);
  node.data ??= {};
  node.data.hProperties ??= {};
  if (title) node.data.hProperties['data-code-title'] = title;
  if (lineStart) node.data.hProperties['data-line-start'] = lineStart;
  if (highlights) node.data.hProperties['data-highlight-lines'] = highlights;
}

function transformContainer(node: MdNode) {
  if (node.type !== 'blockquote' || !node.children?.length) return;
  const marker = markerParagraph(node.children[0]);
  if (!marker) return;

  const admonition = marker.match(/^\[\[!admonition\|([^|]+)\|([^|]*)\|([01])\|([01])\]\]$/);
  if (admonition) {
    const type = decode(admonition[1]).toLowerCase();
    const title = decode(admonition[2]) || admonitionNames[type] || '说明';
    const collapsible = admonition[3] === '1';
    const open = admonition[4] === '1';
    node.children.shift();
    node.data = {
      hName: collapsible ? 'details' : 'aside',
      hProperties: {
        className: ['note-admonition', `note-admonition-${type}`],
        'data-admonition': type,
        ...(open ? { open: true } : {}),
      },
    };
    node.children.unshift(elementParagraph(collapsible ? 'summary' : 'div', 'note-admonition-title', title));
    return;
  }

  if (marker === '[[!tabs]]') {
    node.children.shift();
    node.data = {
      hName: 'div',
      hProperties: { className: ['note-tabs'], 'data-note-tabs': true },
    };
    return;
  }

  const tab = marker.match(/^\[\[!tab\|([^|]+)\]\]$/);
  if (tab) {
    node.children.shift();
    node.data = {
      hName: 'section',
      hProperties: {
        className: ['note-tab-panel'],
        'data-tab-label': decode(tab[1]),
      },
    };
  }
}

function visit(node: MdNode) {
  transformContainer(node);
  enhanceHeading(node);
  enhanceAttributeList(node);
  enhanceCode(node);
  replaceInlineMarkup(node);
  node.children?.forEach(visit);
}

const remarkNotesCompat: Plugin<[], Root> = () => (tree) => visit(tree as unknown as MdNode);

export default remarkNotesCompat;
