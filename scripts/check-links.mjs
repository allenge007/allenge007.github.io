import { access, readFile, readdir } from 'node:fs/promises';
import { extname, join, relative, sep } from 'node:path';

const root = process.cwd();
const dist = join(root, 'dist');
const origin = 'https://www.allenge.me';

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map(async (entry) => {
    const absolute = join(directory, entry.name);
    return entry.isDirectory() ? walk(absolute) : [absolute];
  }))).flat();
}

async function exists(path) {
  try { await access(path); return true; } catch { return false; }
}

function pageUrl(file) {
  const rel = relative(dist, file).split(sep).join('/');
  return rel.endsWith('/index.html')
    ? `${origin}/${rel.slice(0, -'index.html'.length)}`
    : `${origin}/${rel}`;
}

function extractReferences(html) {
  const refs = [];
  for (const match of html.matchAll(/\b(?:href|src)=(?:"([^"]*)"|'([^']*)')/gi)) {
    refs.push(match[1] ?? match[2]);
  }
  for (const match of html.matchAll(/\bsrcset=(?:"([^"]*)"|'([^']*)')/gi)) {
    const value = match[1] ?? match[2];
    refs.push(...value.split(',').map((item) => item.trim().split(/\s+/)[0]));
  }
  return refs;
}

function outputCandidates(pathname) {
  let decoded;
  try { decoded = decodeURIComponent(pathname); } catch { decoded = pathname; }
  const clean = decoded.replace(/^\/+/, '');
  if (!clean) return [join(dist, 'index.html')];
  if (decoded.endsWith('/')) return [join(dist, clean, 'index.html')];
  if (extname(clean)) return [join(dist, clean)];
  return [join(dist, clean), join(dist, clean, 'index.html')];
}

const htmlFiles = (await walk(dist)).filter((file) => file.endsWith('.html'));
const broken = [];

for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  for (const reference of extractReferences(html)) {
    if (!reference || reference.startsWith('#') || /^(?:mailto:|tel:|data:|javascript:)/i.test(reference)) continue;
    let url;
    try { url = new URL(reference, pageUrl(file)); } catch { continue; }
    if (url.origin !== origin) continue;
    const candidates = outputCandidates(url.pathname);
    if (!(await Promise.all(candidates.map(exists))).some(Boolean)) {
      broken.push(`${relative(dist, file)} -> ${reference}`);
    }
  }
}

if (broken.length) {
  console.error(`Found ${broken.length} broken internal reference(s):\n${broken.slice(0, 80).join('\n')}`);
  process.exit(1);
}

console.log(`Checked ${htmlFiles.length} HTML files: no broken internal references.`);
