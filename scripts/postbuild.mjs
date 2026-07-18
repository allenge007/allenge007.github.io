import { copyFile, mkdir, readFile, readdir, stat, unlink } from 'node:fs/promises';
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

const attachments = [
  ['src/content/notes/cs/ai/code_minmaxtree.py', 'dist/notes/cs/ai/code_minmaxtree.py'],
  ['src/content/notes/math/optimization_theory/test.tex', 'dist/notes/math/optimization_theory/test.tex'],
];
for (const [source, destination] of attachments) {
  await mkdir(join(root, destination, '..'), { recursive: true });
  await copyFile(join(root, source), join(root, destination));
}

const astroAssets = join(root, 'dist', '_assets');
for (const name of await readdir(astroAssets)) {
  if (/\.(?:jpe?g|png)$/i.test(name)) await unlink(join(astroAssets, name));
}

for (const required of [
  'dist/index.html',
  'dist/en/index.html',
  'dist/notes/index.html',
  'dist/notes/search/index.html',
  ...attachments.map(([, destination]) => destination),
]) {
  await stat(join(root, required));
}

console.log(`Combined output prepared with CNAME ${expectedDomain}.`);
