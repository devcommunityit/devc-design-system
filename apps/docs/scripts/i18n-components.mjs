/**
 * Translations of the component documentation (the Italian source lives in packages/ui/src/**\/*.meta.ts).
 *
 *   node scripts/i18n-components.mjs extract [outDir]  → Italian translatable text per component (+ source hash)
 *   node scripts/i18n-components.mjs check [--strict]  → validates src/i18n/en/components/*.json
 *
 * `check` reports missing, stale (Italian source changed after translation) and malformed overlays.
 * Missing or stale ones are warnings (the site falls back to Italian) unless --strict; malformed ones are errors.
 */
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const here = dirname(fileURLToPath(import.meta.url));
const docsRoot = join(here, '..');
const repoRoot = join(docsRoot, '..', '..');
const uiSrc = join(repoRoot, 'packages', 'ui', 'src');
const overlayDir = join(docsRoot, 'src', 'i18n', 'en', 'components');

const rel = (file) => relative(repoRoot, file).split(sep).join('/');

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return entry.name === 'node_modules' ? [] : walk(full);
    return [full];
  });
}

async function importTs(file) {
  const { outputText } = ts.transpileModule(readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022, verbatimModuleSyntax: false },
    fileName: file,
  });
  return import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
}

/** Translatable projection of a ComponentDoc: the exact shape of an overlay file (minus `source`). */
function project(doc) {
  return {
    summary: doc.summary,
    whenToUse: doc.whenToUse,
    whenNotToUse: doc.whenNotToUse,
    props: doc.props.map((p) => ({ name: p.name, description: p.description })),
    ...(doc.inherits ? { inherits: doc.inherits } : {}),
    keyboard: doc.keyboard.map((k) => ({ keys: k.keys, action: k.action })),
    accessibility: doc.accessibility,
    responsive: doc.responsive,
    customization: doc.customization,
    commonMistakes: doc.commonMistakes,
    examples: doc.examples.map((e) => ({ name: e.name, title: e.title, ...(e.description ? { description: e.description } : {}) })),
    limits: doc.status.limits,
  };
}

const hash = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex').slice(0, 12);

async function loadDocs() {
  const files = [join(uiSrc, 'components'), join(uiSrc, 'patterns')].flatMap(walk).filter((f) => f.endsWith('.meta.ts'));
  const docs = [];
  for (const file of files) {
    const { doc } = await importTs(file);
    if (doc) docs.push({ file, doc });
  }
  return docs.sort((a, b) => a.doc.slug.localeCompare(b.doc.slug));
}

function sameShape(source, overlay, path, errors) {
  const where = path || '(root)';
  if (Array.isArray(source)) {
    if (!Array.isArray(overlay)) return errors.push(`${where}: expected an array`);
    if (overlay.length !== source.length) return errors.push(`${where}: ${overlay.length} items, Italian source has ${source.length}`);
    source.forEach((item, i) => sameShape(item, overlay[i], `${path}[${i}]`, errors));
    return;
  }
  if (source && typeof source === 'object') {
    if (!overlay || typeof overlay !== 'object' || Array.isArray(overlay)) return errors.push(`${where}: expected an object`);
    for (const key of Object.keys(source)) {
      if (!(key in overlay)) errors.push(`${path ? `${path}.` : ''}${key}: missing`);
      else if (key === 'name' || key === 'keys') {
        if (overlay[key] !== source[key]) errors.push(`${path}.${key}: must stay "${source[key]}"`);
      } else sameShape(source[key], overlay[key], `${path ? `${path}.` : ''}${key}`, errors);
    }
    for (const key of Object.keys(overlay)) if (key !== 'source' && !(key in source)) errors.push(`${path ? `${path}.` : ''}${key}: unknown field`);
    return;
  }
  if (typeof overlay !== 'string' || overlay.trim() === '') errors.push(`${where}: expected a non-empty string`);
}

const [command = 'check', ...args] = process.argv.slice(2);
const docs = await loadDocs();

if (command === 'extract') {
  const outDir = args[0] ?? join(docsRoot, '.i18n-source');
  mkdirSync(outDir, { recursive: true });
  for (const { doc } of docs) {
    const projected = project(doc);
    writeFileSync(join(outDir, `${doc.slug}.json`), `${JSON.stringify({ source: hash(projected), ...projected }, null, 2)}\n`);
  }
  console.log(`Extracted ${docs.length} components to ${outDir}`);
} else if (command === 'check') {
  const strict = args.includes('--strict');
  const slugs = new Set(docs.map((d) => d.doc.slug));
  const missing = [];
  const stale = [];
  const errors = [];
  for (const { doc, file } of docs) {
    const overlayFile = join(overlayDir, `${doc.slug}.json`);
    if (!existsSync(overlayFile)) {
      missing.push(doc.slug);
      continue;
    }
    let overlay;
    try {
      overlay = JSON.parse(readFileSync(overlayFile, 'utf8'));
    } catch (error) {
      errors.push(`${rel(overlayFile)}: invalid JSON (${error.message})`);
      continue;
    }
    const projected = project(doc);
    const shapeErrors = [];
    sameShape(projected, overlay, '', shapeErrors);
    errors.push(...shapeErrors.map((e) => `${rel(overlayFile)} (${rel(file)}): ${e}`));
    if (shapeErrors.length === 0 && overlay.source !== hash(projected)) stale.push(doc.slug);
  }
  const orphans = existsSync(overlayDir)
    ? readdirSync(overlayDir)
        .filter((f) => f.endsWith('.json') && !slugs.has(f.slice(0, -5)))
        .map((f) => f.slice(0, -5))
    : [];
  errors.push(...orphans.map((slug) => `${slug}.json: no component with this slug`));
  const translated = docs.length - missing.length;
  console.log(`English component docs: ${translated}/${docs.length} translated, ${stale.length} stale, ${errors.length} errors.`);
  if (missing.length) console.log(`Missing (Italian fallback): ${missing.join(', ')}`);
  if (stale.length) console.log(`Stale (Italian source changed; re-translate and update "source"): ${stale.join(', ')}`);
  for (const error of errors) console.error(`  ✖ ${error}`);
  if (errors.length || (strict && (missing.length || stale.length))) process.exit(1);
} else {
  console.error(`Unknown command "${command}". Use "extract" or "check".`);
  process.exit(2);
}
