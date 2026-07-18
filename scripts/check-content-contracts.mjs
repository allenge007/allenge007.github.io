import { access, readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const root = process.cwd();
const dist = join(root, 'dist');
const failures = [];

function luminance(hex) {
  const channels = [1, 3, 5]
    .map((index) => Number.parseInt(hex.slice(index, index + 2), 16) / 255)
    .map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrast(foreground, background) {
  const [lighter, darker] = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (lighter + 0.05) / (darker + 0.05);
}

async function mustExist(relativePath, label = relativePath) {
  try { await access(join(root, relativePath)); } catch { failures.push(`Missing ${label}: ${relativePath}`); }
}

async function mustContain(relativePath, expression, label) {
  try {
    const content = await readFile(join(root, relativePath), 'utf8');
    if (!expression.test(content)) failures.push(`${label} not found in ${relativePath}`);
  } catch {
    failures.push(`Could not read ${relativePath} for ${label}`);
  }
}

async function mustNotContain(relativePath, expression, label) {
  try {
    const content = await readFile(join(root, relativePath), 'utf8');
    if (expression.test(content)) failures.push(`${label} found in ${relativePath}`);
  } catch {
    failures.push(`Could not read ${relativePath} for ${label}`);
  }
}

for (const path of [
  'dist/index.html',
  'dist/en/index.html',
  'dist/projects/index.html',
  'dist/blog/index.html',
  'dist/about/index.html',
  'dist/notes/index.html',
  'dist/rss.xml',
  'dist/sitemap-index.xml',
  'dist/pagefind/pagefind-ui.js',
  'dist/pagefind/pagefind-ui.css',
  'dist/notes/search/index.html',
  'dist/notes/cs/ai/code_minmaxtree.py',
  'dist/notes/math/optimization_theory/test.tex',
  'dist/og.png',
  'dist/projects/geosketch-cot/index.html',
  'dist/projects/idagent/index.html',
  'dist/projects/foodflow/index.html',
  'dist/projects/yatcc-se/index.html',
  'dist/projects/deepseek-cli/index.html',
]) await mustExist(path);

await mustContain('docs/CNAME', /^www\.allenge\.me\s*$/, 'preserved custom domain');
await mustContain('dist/CNAME', /^www\.allenge\.me\s*$/, 'deployed custom domain');
await mustContain('dist/index.html', /href="\/en\/"/, 'Chinese-to-English navigation');
await mustContain('dist/en/index.html', /href="\/"/, 'English-to-Chinese navigation');
await mustContain('dist/blog/index.html', /post-card-no-cover/, 'coverless post fallback');
await mustContain('src/components/PhotosBand.astro', /items\.length > 0[\s\S]*photo-empty/, 'empty photo manifest fallback');
await mustContain('src/styles/global.css', /\.is-image-error img\s*\{\s*visibility:\s*hidden/, 'failed image fallback');
await mustContain('src/styles/global.css', /@media \(prefers-reduced-motion: reduce\)[\s\S]*\.js \[data-reveal\]\s*\{\s*opacity:\s*1;\s*transform:\s*none/, 'reduced-motion fallback');
await mustContain('src/components/HeroVisual.astro', /class="hero-slide-frame"[\s\S]*<Picture[\s\S]*src=\{photo\.src\}/, 'photo-driven hero slide frame');
await mustContain('src/styles/global.css', /\.hero-slide-frame\s*\{[\s\S]*?width:\s*fit-content;[\s\S]*?height:\s*fit-content;/, 'content-sized hero photo frame');
await mustContain('src/styles/global.css', /\.hero-slide img\s*\{[\s\S]*?width:\s*auto;[\s\S]*?height:\s*auto;[\s\S]*?object-fit:\s*contain;/, 'source-proportional hero image sizing');
await mustContain('src/components/HeroVisual.astro', /monthly-salary-cat-sway\.gif\?url[\s\S]*monthly-salary-cat-review\.gif\?url[\s\S]*monthly-salary-cat-waving\.gif\?url[\s\S]*monthly-salary-cat-jumping\.gif\?url[\s\S]*prefers-reduced-motion: reduce[\s\S]*monthlySalaryCatStatic/, 'Monthly Salary Cat action set with reduced-motion still');
await mustContain('src/components/HeroVisual.astro', /data-mascot-mode="slack"[\s\S]*pointerenter[\s\S]*setMode\('work'\)[\s\S]*pointerleave[\s\S]*returnToSlack/, 'work-on-hover and slack-at-rest mascot behavior');
await mustNotContain('src/components/HeroVisual.astro', /mascot-label|mascotNote/, 'visible mascot explanatory label');
await mustContain('src/styles/global.css', /\.mascot-card img\s*\{[\s\S]*?width:\s*100%;[\s\S]*?height:\s*auto;[\s\S]*?aspect-ratio:\s*auto;[\s\S]*?object-fit:\s*contain;/, 'source-proportional mascot sizing');
await mustContain('src/components/HomePage.astro', /site-path-card[\s\S]*Writing[\s\S]*Projects[\s\S]*Notes/, 'content-led homepage routes');
await mustNotContain('src/components/HomePage.astro', /profileContent\.(?:research|skills|education|honors)/, 'About-only profile sections on the homepage');
await mustContain('src/components/AboutMascot.astro', /monthly-salary-cat-running-right\.gif\?url[\s\S]*monthly-salary-cat-running-left\.gif\?url[\s\S]*monthly-salary-cat-failed\.gif\?url[\s\S]*monthly-salary-cat-waiting\.gif\?url/, 'About mascot unused action set');
await mustContain('src/components/AboutMascot.astro', /pointerenter[\s\S]*startRunning\(\)[\s\S]*pointerleave[\s\S]*returnToWaiting[\s\S]*addEventListener\('click', stumble\)/, 'About mascot run, wait, and fail choreography');
await mustContain('src/components/AboutMascot.astro', /prefers-reduced-motion: reduce[\s\S]*monthlySalaryCatStatic/, 'About mascot reduced-motion still');
await mustContain('src/styles/global.css', /\.about-mascot img\s*\{[\s\S]*?width:\s*100%;[\s\S]*?height:\s*auto;[\s\S]*?aspect-ratio:\s*auto;[\s\S]*?object-fit:\s*contain;/, 'source-proportional About mascot sizing');
await mustContain('src/components/Header.astro', /monthly-salary-cat-static\.webp[\s\S]*src=\{monthlySalaryCat\}/, 'Monthly Salary Cat wordmark');
await mustContain('dist/math/optimization_theory/chapter1/index.html', /\/notes\/math\/optimization_theory\/chapter1\//, 'legacy math redirect');
await mustContain('dist/cs/os/chapter1/index.html', /\/notes\/cs\/os\/chapter1\//, 'legacy computer science redirect');
await mustContain('dist/blog/posts/myfirst/index.html', /\/blog\/2025\/05\/23\/myfirst\//, 'legacy blog redirect');
await mustContain('dist/notes/admonitions/index.html', /class="note-admonition/, 'Astro admonition');
await mustContain('dist/notes/admonitions/index.html', /<details[^>]+note-admonition/, 'Astro collapsible block');
await mustContain('dist/notes/content-tabs/index.html', /data-note-tabs/, 'Astro tabs');
await mustContain('dist/notes/code-examples/index.html', /data-code-title="add_numbers\.py"[^>]+data-line-start="1"[^>]+data-highlight-lines="2-4"/, 'Astro titled and annotated code block');
await mustContain('dist/notes/cs/ai/chapter5/index.html', /<pre class="mermaid" data-mermaid/, 'Astro Mermaid source block');
await mustContain('dist/notes/search/index.html', /triggerFilters\(\{\s*kind:\s*['"]notes['"]\s*\}\)/, 'Notes-only Pagefind filter');
await mustContain('dist/notes/cs/ai/chapter1/index.html', /data-pagefind-filter="kind:notes"/, 'Notes Pagefind kind filter');
await mustContain('dist/notes/cs/ai/chapter1/index.html', /data-pagefind-filter="subject:computer-science"/, 'Notes Pagefind subject filter');
await mustContain('dist/notes/admonitions/index.html', /<meta name="robots" content="noindex, follow">[\s\S]*data-pagefind-ignore="all"/, 'hidden Notes regression page exclusion');
await mustNotContain('src/content/notes/cs/ai/chapter6.md', /your-image-placeholder|这是一个占位符图片/, 'invalid Imgur placeholder');
await mustContain('dist/index.html', /property="og:image" content="https:\/\/www\.allenge\.me\/og\.png"/, 'Open Graph image');
await mustContain('dist/projects/foodflow/index.html', /foodflow-dispatch-light\.jpg[\s\S]*foodflow-dispatch-dark\.jpg/, 'FoodFlow theme-aware demo pair');
await mustContain('dist/projects/yatcc-se/index.html', /yatcc-student-dashboard-light\.jpg[\s\S]*yatcc-student-dashboard-dark\.jpg/, 'YatCC-SE theme-aware demo pair');
await mustContain('src/styles/global.css', /:root\[data-theme="dark"\]\s+\[data-theme-image="light"\][\s\S]*\[data-theme-image="dark"\]/, 'manual-theme project image switching');

const homeHtml = await readFile(join(dist, 'index.html'), 'utf8');
if (/<title>[^<]*(?:陈正宇|Zhengyu Chen)/i.test(homeHtml)) {
  failures.push('The public home-page title should use the Allenge brand instead of repeating the full name.');
}
const themeBootstrap = homeHtml.indexOf('allenge-theme');
const firstStylesheet = homeHtml.indexOf('rel="stylesheet"');
if (themeBootstrap < 0 || firstStylesheet < 0 || themeBootstrap > firstStylesheet) {
  failures.push('Theme bootstrap must run before stylesheets to prevent a theme flash.');
}

const ogImage = await readFile(join(dist, 'og.png'));
if (ogImage.readUInt32BE(16) !== 1200 || ogImage.readUInt32BE(20) !== 630) {
  failures.push('Open Graph image must be exactly 1200×630.');
}

const css = await readFile(join(root, 'src', 'styles', 'global.css'), 'utf8');
const lightTokens = css.match(/:root\s*\{([\s\S]*?)\}/)?.[1] ?? '';
const darkTokens = css.match(/:root\[data-theme="dark"\]\s*\{([\s\S]*?)\}/)?.[1] ?? '';
const token = (block, name) => block.match(new RegExp(`--${name}:\\s*(#[0-9a-f]{6})`, 'i'))?.[1];
for (const [theme, block] of [['light', lightTokens], ['dark', darkTokens]]) {
  const background = token(block, 'page');
  for (const name of ['ink', 'ink-soft', 'muted', 'faint', 'blue']) {
    const foreground = token(block, name);
    if (!foreground || !background || contrast(foreground, background) < 4.5) {
      failures.push(`${theme} ${name} text color does not meet WCAG AA contrast against the page background.`);
    }
  }
}

const noteHtml = await readFile(join(dist, 'notes', 'math', 'optimization_theory', 'chapter1', 'index.html'), 'utf8');
if (!/arithmatex|katex/i.test(noteHtml)) failures.push('KaTeX/arithmatex markup missing from Notes.');
const aiHtml = await readFile(join(dist, 'notes', 'cs', 'ai', 'index.html'), 'utf8');
if (!/mermaid/i.test(aiHtml)) {
  const noteFiles = await readdir(join(dist, 'notes', 'cs', 'ai'), { recursive: true });
  const hasMermaid = await Promise.all(noteFiles.filter((name) => String(name).endsWith('.html')).map(async (name) => /mermaid/i.test(await readFile(join(dist, 'notes', 'cs', 'ai', String(name)), 'utf8'))));
  if (!hasMermaid.some(Boolean)) failures.push('Mermaid markup missing from Notes.');
}

const assets = await readdir(join(dist, '_assets'));
if (assets.some((name) => /\.(?:jpe?g|png)$/i.test(name))) {
  failures.push('Astro image output contains original JPEG/PNG assets instead of transformed AVIF/WebP.');
}
if (!assets.some((name) => name.endsWith('.avif')) || !assets.some((name) => name.endsWith('.webp'))) {
  failures.push('Responsive AVIF/WebP output was not generated.');
}

const publicAstroHtml = (await readdir(dist, { recursive: true }))
  .filter((name) => String(name).endsWith('.html'));
for (const name of publicAstroHtml) {
  const html = await readFile(join(dist, String(name)), 'utf8');
  for (const match of html.matchAll(/<img\b[^>]*>/gi)) {
    if (!/\balt(?:\s|=|>)/i.test(match[0])) failures.push(`Image without alt attribute in dist/${name}`);
  }
}

try {
  await access(join(dist, 'blog', 'drafts', 'content-features', 'index.html'));
  failures.push('Draft post was emitted into the public build.');
} catch {}

if (failures.length) {
  console.error(`Content contract verification failed:\n- ${failures.join('\n- ')}`);
  process.exit(1);
}

console.log('Verified bilingual navigation, fallbacks, legacy redirects, feeds, responsive images, Astro Notes, and filtered search.');
