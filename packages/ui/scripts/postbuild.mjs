// Copies standalone CSS/JSON artifacts into dist after `vite build` + `tsc`.
import { copyFileSync, existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
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

// tsc emits extensionless relative specifiers in .d.ts files, which TypeScript consumers using
// `moduleResolution: node16 | nodenext` cannot resolve. Rewrite them to the emitted `.js` paths
// and drop side-effect CSS imports (styles ship as dist/styles.css, not per-module files).
function* walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (entry.name.endsWith('.d.ts')) yield full;
  }
}
const specifier = /(\bfrom\s*|\bimport\s*\(\s*|^\s*import\s*)(['"])(\.{1,2}\/[^'"]*)\2/gm;
let rewritten = 0;
for (const file of walk(dist)) {
  const source = readFileSync(file, 'utf8');
  const withoutCss = source.replace(/^import\s+['"][^'"]+\.css['"];?\r?\n/gm, '');
  const next = withoutCss.replace(specifier, (match, lead, quote, spec) => {
    if (/\.(js|json)$/.test(spec)) return match;
    const base = resolve(dirname(file), spec);
    if (existsSync(`${base}.d.ts`)) return `${lead}${quote}${spec}.js${quote}`;
    if (existsSync(join(base, 'index.d.ts'))) return `${lead}${quote}${spec}/index.js${quote}`;
    problems.push(`${relative(dist, file)}: cannot resolve declaration import "${spec}"`);
    return match;
  });
  if (next !== source) {
    writeFileSync(file, next);
    rewritten += 1;
  }
}
if (/\.css['"]/.test(readFileSync(resolve(dist, 'index.d.ts'), 'utf8'))) problems.push('index.d.ts still imports CSS');
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
console.log(`postbuild: copied tokens.css, reset.css, tokens.dtcg.json; rewrote ${rewritten} declaration files; checks passed`);
