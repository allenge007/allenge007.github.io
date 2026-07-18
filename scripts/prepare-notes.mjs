import { copyFile, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { dirname, extname, join, posix, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const sourceRoot = join(root, 'src', 'content', 'notes');
const generatedRoot = join(root, '.notes-generated');
const baseline = JSON.parse(await readFile(join(root, 'tests', 'fixtures', 'notes-baseline.json'), 'utf8'));

const baselineByRoute = new Map(baseline.pages.map((page) => [page.route, page]));
const hiddenRoutes = new Set([
  '/notes/admonitions/',
  '/notes/content-tabs/',
  '/notes/code-examples/',
  '/notes/cs/ai/minmaxtree.hidden/',
]);

const macroTrees = {
  '/notes/cs/ai/': [
    ['/notes/cs/ai/chapter1/', '知识表示与推理'],
    ['/notes/cs/ai/chapter2/', '搜索技术'],
    ['/notes/cs/ai/chapter3/', '不确定性知识表示与推理'],
    ['/notes/cs/ai/chapter4/', '机器学习：聚类'],
    ['/notes/cs/ai/chapter5/', '机器学习：神经网络'],
    ['/notes/cs/ai/chapter6/', '机器学习：决策树'],
    ['/notes/cs/ai/chapter7/', '深度学习'],
    ['/notes/cs/ai/chapter8/', 'Transformer'],
    ['/notes/cs/ai/chapter9/', '强化学习'],
  ],
  '/notes/cs/os/': [
    ['/notes/cs/os/chapter1/', '操作系统概述'],
    ['/notes/cs/os/chapter2/', '进程、线程与 CPU 调度'],
    ['/notes/cs/os/chapter3/', '进程同步与死锁'],
    ['/notes/cs/os/chapter4/', '内存管理'],
    ['/notes/cs/os/chapter5/', '大容量存储'],
    ['/notes/cs/os/chapter6/', '文件系统'],
    ['/notes/cs/os/chapter7/', 'I/O 管理'],
  ],
};

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map(async (entry) => {
    const absolute = join(directory, entry.name);
    return entry.isDirectory() ? walk(absolute) : [absolute];
  }))).flat();
}

function forwardSlash(value) {
  return value.split(sep).join('/');
}

function splitFrontmatter(source) {
  if (!source.startsWith('---\n') && !source.startsWith('---\r\n')) return { data: {}, body: source };
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!match) return { data: {}, body: source };
  return { data: parseYaml(match[1]) ?? {}, body: source.slice(match[0].length) };
}

function routeFor(relativePath) {
  const withoutExtension = relativePath.replace(/\.md$/i, '');
  const routePart = withoutExtension === 'index'
    ? ''
    : withoutExtension.endsWith('/index')
      ? withoutExtension.slice(0, -'/index'.length)
      : withoutExtension;
  return `/notes/${routePart ? `${routePart}/` : ''}`;
}

function sourceTitle(body, relativePath) {
  const h1 = body.match(/^#\s+(.+?)\s*$/m)?.[1]
    ?.replace(/\s+\{[^}]+\}\s*$/, '')
    .replace(/[*_`]/g, '')
    .trim();
  if (h1) return h1;
  const base = relativePath.split('/').at(-1)?.replace(/\.md$/i, '') ?? 'Notes';
  return ({
    admonitions: 'Admonition 与折叠块',
    'content-tabs': 'Content Tabs',
    'code-examples': '代码块',
    index: 'Notes',
  })[base] ?? base;
}

function sourceDescription(body, fallback) {
  const cleaned = body
    .replace(/```[\s\S]*?```/g, '')
    .replace(/^\s*(?:!!!|\?\?\?|===).*$/gm, '')
    .replace(/^\s*\{\{[^}]+\}\}\s*$/gm, '')
    .replace(/^#{1,6}\s+.*$/gm, '')
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+[.)]\s+/gm, '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[*_`~]/g, '')
    .split(/\r?\n\s*\r?\n/)
    .map((paragraph) => paragraph.replace(/\s+/g, ' ').trim())
    .find((paragraph) => paragraph.length > 16 && !paragraph.startsWith('$$'));
  return (cleaned || `${fallback}课程笔记。`).slice(0, 180);
}

function gitUpdated(relativePath) {
  try {
    return execFileSync('git', [
      'log', '--follow', '--diff-filter=M', '-1', '--format=%cI', '--', `src/content/notes/${relativePath}`,
    ], {
      cwd: root,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim() || undefined;
  } catch {
    return undefined;
  }
}

function indentation(line) {
  return line.match(/^[ \t]*/)?.[0].replace(/\t/g, '    ').length ?? 0;
}

function removeIndent(line, amount) {
  let remaining = amount;
  let index = 0;
  while (index < line.length && remaining > 0) {
    if (line[index] === ' ') remaining -= 1;
    else if (line[index] === '\t') remaining -= 4;
    else break;
    index += 1;
  }
  return line.slice(index);
}

function blockEnd(lines, start, baseIndent) {
  let end = start;
  while (end < lines.length) {
    if (lines[end].trim() && indentation(lines[end]) <= baseIndent) break;
    end += 1;
  }
  while (end > start && !lines[end - 1].trim()) end -= 1;
  return end;
}

function deindent(lines, baseIndent) {
  const nonBlank = lines.filter((line) => line.trim());
  const bodyIndent = nonBlank.length
    ? Math.min(...nonBlank.map(indentation))
    : baseIndent + 4;
  const amount = Math.max(0, bodyIndent - baseIndent);
  return lines.map((line) => line.trim() ? removeIndent(line, amount) : '');
}

function quoteBlock(lines, indent = '') {
  return lines.map((line) => `${indent}>${line ? ` ${line}` : ''}`);
}

function relativeBlockLines(lines, baseIndent) {
  return lines.map((line) => line.trim() ? removeIndent(line, baseIndent) : '');
}

function admonitionHeader(line) {
  const match = line.match(/^(\s*)(!!!|\?\?\?)([+-]?)(?:\s*)([\w-]+)(?:\s+"([\s\S]*)")?\s*$/);
  if (!match) return null;
  return {
    indent: match[1],
    marker: match[2],
    modifier: match[3],
    type: match[4],
    title: match[5] ?? '',
  };
}

function tabHeader(line) {
  const match = line.match(/^(\s*)===\s+"([\s\S]+)"\s*$/);
  return match ? { indent: match[1], title: match[2] } : null;
}

function transformBlocks(body, route) {
  const lines = body.replace(/\r\n/g, '\n').split('\n');

  function transform(input) {
    const output = [];
    for (let index = 0; index < input.length;) {
      const line = input[index];
      const fence = line.match(/^(\s*)(`{3,}|~{3,})(.*)$/);
      if (fence) {
        output.push(line);
        index += 1;
        while (index < input.length) {
          output.push(input[index]);
          const closes = new RegExp(`^\\s*${fence[2][0]}{${fence[2].length},}\\s*$`).test(input[index]);
          index += 1;
          if (closes) break;
        }
        continue;
      }

      const admonition = admonitionHeader(line);
      if (admonition) {
        const baseIndent = indentation(line);
        const end = blockEnd(input, index + 1, baseIndent);
        const bodyLines = relativeBlockLines(
          transform(deindent(input.slice(index + 1, end), baseIndent)),
          baseIndent,
        );
        const marker = [
          '[[!admonition',
          encodeURIComponent(admonition.type),
          encodeURIComponent(admonition.title),
          admonition.marker === '???' ? '1' : '0',
          admonition.modifier === '+' ? '1' : '0',
        ].join('|') + ']]';
        output.push(...quoteBlock([marker, '', ...bodyLines], admonition.indent));
        index = end;
        continue;
      }

      const firstTab = tabHeader(line);
      if (firstTab) {
        const baseIndent = indentation(line);
        const tabs = [];
        let cursor = index;
        while (cursor < input.length) {
          const header = tabHeader(input[cursor]);
          if (!header || indentation(input[cursor]) !== baseIndent) break;
          const end = blockEnd(input, cursor + 1, baseIndent);
          tabs.push({
            title: header.title,
            body: relativeBlockLines(
              transform(deindent(input.slice(cursor + 1, end), baseIndent)),
              baseIndent,
            ),
          });
          cursor = end;
          while (cursor < input.length && !input[cursor].trim()) cursor += 1;
        }
        const tabLines = ['[[!tabs]]', ''];
        tabs.forEach((tab, tabIndex) => {
          if (tabIndex) tabLines.push('');
          tabLines.push(...quoteBlock([`[[!tab|${encodeURIComponent(tab.title)}]]`, '', ...tab.body]));
        });
        output.push(...quoteBlock(tabLines, firstTab.indent));
        index = cursor;
        continue;
      }

      if (line.includes('{{ list_docs_as_tree() }}')) {
        const indent = line.match(/^\s*/)?.[0] ?? '';
        const children = macroTrees[route] ?? [];
        output.push(...children.map(([href, label]) => `${indent}- [${label}](${href})`));
        index += 1;
        continue;
      }

      output.push(line);
      index += 1;
    }
    return output;
  }

  return transform(lines).join('\n');
}

function normalizeDisplayMath(body) {
  let inFence = false;
  let fenceCharacter = '';
  return body.split('\n').flatMap((line) => {
    const fence = line.match(/^\s*(`{3,}|~{3,})/);
    if (fence) {
      if (!inFence) {
        inFence = true;
        fenceCharacter = fence[1][0];
      } else if (fence[1][0] === fenceCharacter) {
        inFence = false;
      }
      return [line];
    }
    if (inFence) return [line];
    const sameLineDisplay = line.match(/^(\s*)\$\$\s*(.*?)\s*\$\$\s*$/);
    return sameLineDisplay
      ? [`${sameLineDisplay[1]}$$`, `${sameLineDisplay[1]}${sameLineDisplay[2]}`, `${sameLineDisplay[1]}$$`]
      : [line];
  }).join('\n');
}

function transformMarkdownLinks(body, relativePath) {
  let inFence = false;
  let fenceCharacter = '';
  return body.split('\n').map((line) => {
    const fence = line.match(/^\s*(`{3,}|~{3,})/);
    if (fence) {
      if (!inFence) {
        inFence = true;
        fenceCharacter = fence[1][0];
      } else if (fence[1][0] === fenceCharacter) {
        inFence = false;
      }
      return line;
    }
    if (inFence) return line;
    return line.replace(/(?<!!)\]\((?!https?:\/\/|\/|#)([^)\s]+\.md)(#[^)\s]+)?\)/g, (_match, target, hash = '') => {
      const resolved = posix.normalize(posix.join(posix.dirname(relativePath), target));
      return `](${routeFor(resolved)}${hash})`;
    });
  }).join('\n');
}

function generatedFrontmatter(data) {
  return [
    '---',
    ...Object.entries(data)
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => `${key}: ${JSON.stringify(value)}`),
    '---',
    '',
  ].join('\n');
}

await rm(generatedRoot, { recursive: true, force: true });
await mkdir(generatedRoot, { recursive: true });

const files = await walk(sourceRoot);
let noteCount = 0;
for (const absolute of files) {
  const relativePath = forwardSlash(relative(sourceRoot, absolute));
  const destination = join(generatedRoot, relativePath);
  await mkdir(dirname(destination), { recursive: true });
  if (extname(absolute).toLowerCase() !== '.md') {
    await copyFile(absolute, destination);
    continue;
  }

  const original = await readFile(absolute, 'utf8');
  const { data: sourceData, body } = splitFrontmatter(original);
  const route = routeFor(relativePath);
  const title = sourceData.title ?? sourceTitle(body, relativePath);
  const description = sourceData.description ?? sourceDescription(body, title);
  const updated = gitUpdated(relativePath) ?? baselineByRoute.get(route)?.updated ?? undefined;
  const noindex = sourceData.noindex ?? hiddenRoutes.has(route);
  const subject = route.startsWith('/notes/math/')
    ? 'math'
    : route.startsWith('/notes/cs/')
      ? 'computer-science'
      : 'notes';
  const transformed = transformMarkdownLinks(transformBlocks(normalizeDisplayMath(body), route), relativePath);
  const metadata = {
    title,
    description,
    route,
    sourcePath: `src/content/notes/${relativePath}`,
    subject,
    lang: 'zh',
    order: sourceData.order,
    draft: sourceData.draft ?? false,
    comments: sourceData.comments ?? true,
    toc: sourceData.toc ?? true,
    noindex,
    updated,
  };
  await writeFile(destination, `${generatedFrontmatter(metadata)}${transformed.trimEnd()}\n`);
  noteCount += 1;
}

if (noteCount !== baseline.pageCount) {
  throw new Error(`Expected ${baseline.pageCount} Notes Markdown files; generated ${noteCount}.`);
}

console.log(`Prepared ${noteCount} Astro Notes documents in ${relative(root, generatedRoot)}.`);
