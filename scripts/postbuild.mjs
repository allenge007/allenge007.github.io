import { copyFile, mkdir, readFile, readdir, stat, unlink, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const root = process.cwd();
const sourceCname = join(root, 'docs', 'CNAME');
const outputCname = join(root, 'dist', 'CNAME');
const expectedDomain = 'www.allenge.me';

const cname = (await readFile(sourceCname, 'utf8')).trim();
if (cname !== expectedDomain) {
  throw new Error(`docs/CNAME must remain ${expectedDomain}; received ${JSON.stringify(cname)}.`);
}

await mkdir(join(root, 'dist'), { recursive: true });
await copyFile(sourceCname, outputCname);

async function normalizeNotesLanguage(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  await Promise.all(entries.map(async (entry) => {
    const absolute = join(directory, entry.name);
    if (entry.isDirectory()) return normalizeNotesLanguage(absolute);
    if (!entry.isFile() || !entry.name.endsWith('.html')) return;
    const html = await readFile(absolute, 'utf8');
    const normalized = html.replace(/<html lang="zh"(?=[\s>])/i, '<html lang="zh-CN"');
    if (normalized !== html) await writeFile(absolute, normalized);
  }));
}

await normalizeNotesLanguage(join(root, 'dist', 'notes'));

const astroAssets = join(root, 'dist', '_assets');
for (const name of await readdir(astroAssets)) {
  if (/\.(?:jpe?g|png)$/i.test(name)) await unlink(join(astroAssets, name));
}

for (const required of ['dist/index.html', 'dist/en/index.html', 'dist/notes/index.html']) {
  await stat(join(root, required));
}

console.log(`Combined output prepared with CNAME ${expectedDomain}.`);
