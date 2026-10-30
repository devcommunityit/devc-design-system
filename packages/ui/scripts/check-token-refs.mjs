// Fails when source files reference `--dc-*` custom properties that no token or stylesheet defines.
// Catches typos and stale token names that CSS would otherwise silently ignore.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const roots = process.argv.slice(2).length ? process.argv.slice(2) : [join(root, 'src')];

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === 'dist') continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.(css|tsx?|mdx?)$/.test(name)) out.push(full);
  }
  return out;
}

const defined = new Set();
const definitionRe = /(--dc-[a-z0-9-]+)\s*:/g;
const referenceRe = /var\(\s*(--dc-[a-z0-9-]+)/g;
// Definitions: generated tokens plus any stylesheet / TS that sets a --dc-* property.
const sources = [...walk(join(root, 'src')), ...roots.flatMap((r) => walk(r))];
for (const file of new Set(sources)) {
  const text = readFileSync(file, 'utf8');
  for (const m of text.matchAll(definitionRe)) defined.add(m[1]);
  // Theme engine writes variables from token paths at runtime: `'--dc-color-…'` string keys.
  for (const m of text.matchAll(/['"`](--dc-[a-z0-9-]+)['"`]\s*[:,\]]/g)) defined.add(m[1]);
}

const problems = [];
for (const base of roots) {
  for (const file of walk(base)) {
    const text = readFileSync(file, 'utf8');
    for (const m of text.matchAll(referenceRe)) {
      const name = m[1];
      if (name.endsWith('-')) continue; // template prefix such as `var(--dc-space-${n})`
      // Per-scheme palettes of custom themes are written inline by ThemeProvider at runtime.
      if (/^--dc-(light|dark)-color-/.test(name)) continue;
      if (!defined.has(name)) {
        const line = text.slice(0, m.index).split('\n').length;
        problems.push(`${relative(process.cwd(), file)}:${line}  ${name}`);
      }
    }
  }
}

if (problems.length) {
  console.error(`Unknown design tokens referenced (${problems.length}):\n${problems.join('\n')}`);
  process.exit(1);
}
console.log(`Token references OK (${defined.size} known custom properties).`);
