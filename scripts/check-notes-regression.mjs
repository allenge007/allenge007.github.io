import { access, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const root = process.cwd();
const baseline = JSON.parse(await readFile(join(root, 'tests', 'fixtures', 'notes-baseline.json'), 'utf8'));
const failures = [];

function routeFile(route) {
  return join(root, 'dist', route.replace(/^\//, ''), 'index.html');
}

function sourceFile(oldSource) {
  return join(root, oldSource.replace(/^docs\//, 'src/content/notes/'));
}

function withoutCode(source) {
  return source.replace(/^\s*(?:`{3,}|~{3,})[^\n]*\n[\s\S]*?^\s*(?:`{3,}|~{3,})\s*$/gm, '');
}

function count(value, pattern) {
  return [...value.matchAll(pattern)].length;
}

function decodeEntities(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)));
}

for (const page of baseline.pages) {
  let html;
  let source;
  try {
    [html, source] = await Promise.all([
      readFile(routeFile(page.route), 'utf8'),
      readFile(sourceFile(page.source), 'utf8'),
    ]);
  } catch {
    failures.push(`Missing migrated route or source for ${page.route}`);
    continue;
  }

  const article = html.match(/<article\b[^>]*class="[^"]*notes-article[^"]*"[^>]*>([\s\S]*?)<\/article>/i)?.[1] ?? '';
  const proseSource = withoutCode(source);
  const sourceHeadingCount = count(proseSource, /^#{1,6}\s+/gm);
  const outputHeadingCount = count(article, /<h[1-6]\b/gi);
  if (outputHeadingCount < Math.max(1, sourceHeadingCount)) failures.push(`${page.route}: heading loss (${sourceHeadingCount} → ${outputHeadingCount})`);

  const sourceCodeCount = count(source, /^```(?:py|c|cpp)\b/gm);
  const outputCodeCount = count(article, /<pre\b[^>]*class="[^"]*astro-code/gi);
  if (outputCodeCount < sourceCodeCount) failures.push(`${page.route}: code block loss (${sourceCodeCount} → ${outputCodeCount})`);

  const sourceMermaidCount = count(source, /^\s*```mermaid\b/gm);
  const outputMermaidCount = count(article, /<pre\b[^>]*class="mermaid"/gi);
  if (outputMermaidCount !== sourceMermaidCount) failures.push(`${page.route}: Mermaid mismatch (${sourceMermaidCount} → ${outputMermaidCount})`);

  const sourceAdmonitionCount = count(source, /^\s*(?:!!!|\?\?\?)[+-]?\s*[\w-]+/gm);
  const outputAdmonitionCount = count(article, /data-admonition="/gi);
  if (outputAdmonitionCount !== sourceAdmonitionCount) failures.push(`${page.route}: admonition mismatch (${sourceAdmonitionCount} → ${outputAdmonitionCount})`);

  const sourceCollapsibleCount = count(source, /^\s*\?\?\?[+-]?\s*[\w-]+/gm);
  const outputCollapsibleCount = count(article, /<details\b[^>]*class="[^"]*note-admonition/gi);
  if (outputCollapsibleCount !== sourceCollapsibleCount) failures.push(`${page.route}: collapsible mismatch (${sourceCollapsibleCount} → ${outputCollapsibleCount})`);

  const sourceTabCount = count(source, /^\s*===\s+"/gm);
  const outputTabCount = count(article, /data-tab-label="/gi);
  if (outputTabCount !== sourceTabCount) failures.push(`${page.route}: tab mismatch (${sourceTabCount} → ${outputTabCount})`);

  const sourceMathCount = Math.floor(count(proseSource, /\$\$/g) / 2);
  const outputMathCount = count(article, /class="katex-display"/gi);
  if (outputMathCount < sourceMathCount) failures.push(`${page.route}: display math loss (${sourceMathCount} → ${outputMathCount})`);

  const sourceImageCount = count(proseSource, /!\[[^\]]*\]\([^)]+\)/g);
  const outputImageCount = count(article, /<img\b/gi);
  if (outputImageCount < sourceImageCount) failures.push(`${page.route}: image loss (${sourceImageCount} → ${outputImageCount})`);

  const title = page.title || source.match(/^#\s+(.+)$/m)?.[1];
  if (title && !decodeEntities(article.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').includes(title)) {
    failures.push(`${page.route}: title text is missing`);
  }

  if (!html.includes(`data-giscus-pathname="${page.giscusPathname}"`)) failures.push(`${page.route}: Giscus pathname changed`);
  for (const heading of page.headings) {
    if (!html.includes(JSON.stringify(heading.id))) failures.push(`${page.route}: legacy hash ${heading.id} is not embedded`);
  }
}

for (const hidden of [
  '/notes/admonitions/',
  '/notes/content-tabs/',
  '/notes/code-examples/',
  '/notes/cs/ai/minmaxtree.hidden/',
]) {
  const html = await readFile(routeFile(hidden), 'utf8');
  if (!/<meta name="robots" content="noindex, follow">/.test(html) || !/data-pagefind-ignore="all"/.test(html)) {
    failures.push(`${hidden}: hidden regression page is indexable`);
  }
}

for (const attachment of [
  'dist/notes/cs/ai/code_minmaxtree.py',
  'dist/notes/math/optimization_theory/test.tex',
]) {
  try { await access(join(root, attachment)); } catch { failures.push(`Missing attachment ${attachment}`); }
}

const fft = await readFile(routeFile('/notes/math/signals_and_systems/FFT/'), 'utf8');
for (const external of [
  'https://cdn.luogu.com.cn/upload/image_hosting/bnq82t01.png',
  'https://cdn.luogu.com.cn/upload/image_hosting/x8nezcch.png',
]) {
  if (!fft.includes(external)) failures.push(`FFT external image changed: ${external}`);
}

if (failures.length) {
  console.error(`Notes regression verification failed:\n- ${failures.slice(0, 120).join('\n- ')}`);
  process.exit(1);
}

console.log(`Verified ${baseline.pageCount} migrated Notes routes, legacy hashes, syntax features, images, math, and attachments.`);
