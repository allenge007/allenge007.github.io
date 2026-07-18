import { readFile, readdir, stat, writeFile } from 'node:fs/promises';
import { dirname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const notesRoot = join(root, 'dist', 'notes');
const output = join(root, 'tests', 'fixtures', 'notes-baseline.json');

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map(async (entry) => {
    const absolute = join(directory, entry.name);
    return entry.isDirectory() ? walk(absolute) : [absolute];
  }))).flat();
}

function decodeEntities(value) {
  return value
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([\da-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)));
}

function textContent(value) {
  return decodeEntities(value)
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function routeFor(file) {
  const rel = relative(notesRoot, file).split(sep).join('/').replace(/index\.html$/, '');
  return `/notes/${rel}`;
}

function sourceForRoute(route) {
  const rel = route.replace(/^\/notes\/?/, '').replace(/\/$/, '');
  if (!rel) return 'docs/index.md';
  const direct = join(root, 'docs', `${rel}.md`);
  const index = join(root, 'docs', rel, 'index.md');
  return { direct, index };
}

async function resolveSource(route) {
  const candidate = sourceForRoute(route);
  if (typeof candidate === 'string') return candidate;
  for (const absolute of [candidate.direct, candidate.index]) {
    try {
      await stat(absolute);
      return relative(root, absolute).split(sep).join('/');
    } catch {}
  }
  throw new Error(`No source Markdown found for ${route}`);
}

function gitUpdated(source) {
  try {
    return execFileSync('git', ['log', '-1', '--format=%cI', '--', source], {
      cwd: root,
      encoding: 'utf8',
    }).trim() || null;
  } catch {
    return null;
  }
}

const htmlFiles = (await walk(notesRoot))
  .filter((file) => file.endsWith(`${sep}index.html`))
  .sort((a, b) => routeFor(a).localeCompare(routeFor(b), 'en'));

const pages = [];
for (const file of htmlFiles) {
  const route = routeFor(file);
  const source = await resolveSource(route);
  const html = await readFile(file, 'utf8');
  const article = html.match(/<article\b[^>]*>([\s\S]*?)<\/article>/i)?.[1]
    ?? html.match(/<div\b[^>]*class="[^"]*md-content__inner[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/i)?.[1]
    ?? html;
  const headings = [...article.matchAll(/<h([1-6])\b[^>]*\bid="([^"]+)"[^>]*>([\s\S]*?)<\/h\1>/gi)]
    .filter((match) => match[2] !== '__comments')
    .map((match) => ({ level: Number(match[1]), id: match[2], text: textContent(match[3]) }));
  const links = [...article.matchAll(/\bhref=(?:"([^"]*)"|'([^']*)')/gi)]
    .map((match) => match[1] ?? match[2])
    .filter((href) => href && !href.startsWith('#'));
  const images = [...article.matchAll(/\bsrc=(?:"([^"]*)"|'([^']*)')/gi)]
    .map((match) => match[1] ?? match[2]);
  const normalizedText = textContent(article.replace(/<h2\b[^>]*id="__comments"[\s\S]*$/i, ''));
  pages.push({
    route,
    source,
    title: headings.find((heading) => heading.level === 1)?.text ?? '',
    headings,
    links: [...new Set(links)].sort(),
    images: [...new Set(images)].sort(),
    giscusPathname: route,
    updated: gitUpdated(source),
    normalizedTextLength: normalizedText.length,
    normalizedTextStart: normalizedText.slice(0, 240),
  });
}

await writeFile(output, `${JSON.stringify({ capturedFrom: 'mkdocs', pageCount: pages.length, pages }, null, 2)}\n`);
console.log(`Captured ${pages.length} MkDocs Notes pages in ${relative(root, output)}.`);
