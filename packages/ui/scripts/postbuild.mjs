// Copies standalone CSS/JSON artifacts into dist after `vite build` + `tsc`.
import { copyFileSync, existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'dist');
const repo = resolve(root, '../..');

const copies = [
  ['src/styles/generated/tokens.css', 'tokens.css'],
  ['src/styles/reset.css', 'reset.css'],
];
for (const [from, to] of copies) copyFileSync(resolve(root, from), resolve(dist, to));
copyFileSync(resolve(repo, 'design/figma/tokens.dtcg.json'), resolve(dist, 'tokens.dtcg.json'));

const problems = [];
for (const file of ['index.js', 'index.d.ts', 'styles.css', 'theme/server.js', 'theme/server.d.ts', 'tokens.css', 'reset.css', 'tokens.dtcg.json']) {
  if (!existsSync(resolve(dist, file))) problems.push(`missing dist/${file}`);
}
const styles = readFileSync(resolve(dist, 'styles.css'), 'utf8');
if (!styles.includes('--dc-color-text-primary')) problems.push('styles.css does not include tokens');
// Only unscoped selectors count: `html {`, `, body {`, `* {`; scoped `.dc-x > *` is fine.
if (/(^|[,{}])\s*(html|body|\*)\s*[{,]/m.test(styles)) problems.push('styles.css contains global element selectors');
const server = readFileSync(resolve(dist, 'theme/server.js'), 'utf8');
if (server.includes('use client')) problems.push('theme/server.js must not be a client module');

if (problems.length) {
  console.error(`postbuild checks failed:\n- ${problems.join('\n- ')}`);
  process.exit(1);
}
console.log('postbuild: copied tokens.css, reset.css, tokens.dtcg.json; checks passed');
