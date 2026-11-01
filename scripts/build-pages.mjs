// Builds the static site for GitHub Pages into apps/docs/dist:
// docs + Theme Builder + showcase (SPA) under PAGES_BASE, Storybook under <base>storybook/.
//
//   PAGES_BASE=/design-system/ node scripts/build-pages.mjs
//   npm run build:pages -- --base /design-system/      (cross-platform)
//
// GitHub Pages has no rewrite rules, so every known route gets a copy of index.html
// (HTTP 200 on deep links) and 404.html is the SPA fallback for anything else.
import { execSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repo = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const docs = resolve(repo, 'apps/docs');
const dist = resolve(docs, 'dist');
const storybookOut = resolve(repo, 'packages/ui/storybook-static');

const argBase = process.argv.indexOf('--base');
const rawBase = argBase > -1 ? process.argv[argBase + 1] : process.env.PAGES_BASE;
const trimmed = (rawBase ?? '/').trim().replace(/^\/+|\/+$/g, '');
const base = trimmed ? `/${trimmed}/` : '/';
const withStorybook = process.env.PAGES_STORYBOOK !== 'false';

const run = (cmd, env = {}) => execSync(cmd, { cwd: repo, stdio: 'inherit', env: { ...process.env, ...env } });

console.log(`\n▸ Docs (base ${base}${withStorybook ? ', con Storybook' : ''})`);
run('npm run build -w @devcommunityit/docs', { DOCS_BASE: base, VITE_STORYBOOK: String(withStorybook) });

if (withStorybook) {
  console.log('\n▸ Storybook');
  run('npm run build-storybook -w @devcommunityit/ui');
  if (!existsSync(join(storybookOut, 'index.html'))) throw new Error('Storybook build did not produce index.html');
  cpSync(storybookOut, join(dist, 'storybook'), { recursive: true });
}

// Route list from the same sources the site uses.
const slugs = (file, pattern = /\bslug:\s*(['"])(.*?)\1/g) => [...readFileSync(file, 'utf8').matchAll(pattern)].map((m) => m[2]);
const metaSlugs = [];
(function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith('.meta.ts')) metaSlugs.push(...slugs(full).slice(0, 1));
  }
})(resolve(repo, 'packages/ui/src'));

const routes = [
  'componenti',
  'pattern',
  'theme-builder',
  'theme-designer',
  'showcase',
  ...slugs(resolve(docs, 'src/content/guides.ts')).map((s) => `guide/${s}`),
  ...slugs(resolve(docs, 'src/content/foundations.ts')).map((s) => `foundations/${s}`),
  ...metaSlugs.map((s) => `componenti/${s}`),
  ...slugs(resolve(docs, 'src/content/showcase.ts')).map((s) => `showcase/${s}`),
];

const index = readFileSync(join(dist, 'index.html'), 'utf8');
for (const route of new Set(routes)) {
  const dir = join(dist, route);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), index);
}
writeFileSync(join(dist, '404.html'), index);
// Deployed through Actions there is no Jekyll step; the marker also covers branch-based publishing.
writeFileSync(join(dist, '.nojekyll'), '');

console.log(`\n✔ GitHub Pages: apps/docs/dist (base ${base}, ${new Set(routes).size + 1} pagine HTML, 404.html${withStorybook ? ', storybook/' : ''})`);
