/**
 * Builds data/catalog.json for the MCP server from the design system sources, so the server
 * never diverges from the library: component metadata (*.meta.ts) and examples (*.examples.tsx),
 * generated tokens, the public export list, the package README (setup) and the docs showcase pages.
 */
import { randomUUID } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, renameSync, unlinkSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const here = dirname(fileURLToPath(import.meta.url));
const pkgRoot = join(here, '..');
const repoRoot = join(pkgRoot, '..', '..');
const uiRoot = join(repoRoot, 'packages', 'ui');
const uiSrc = join(uiRoot, 'src');
const docsSrc = join(repoRoot, 'apps', 'docs', 'src');
const outFile = join(pkgRoot, 'data', 'catalog.json');

const rel = (file) => relative(repoRoot, file).split(sep).join('/');
const read = (file) => readFileSync(file, 'utf8');

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return entry.name === 'node_modules' ? [] : walk(full);
    return [full];
  });
}

/** Imports a self-contained TS module (type-only imports are elided by the transpiler). */
async function importTs(file) {
  const { outputText } = ts.transpileModule(read(file), {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022, verbatimModuleSyntax: false },
    fileName: file,
  });
  if (/^\s*import\s+(?!type\b)/m.test(outputText)) throw new Error(`${rel(file)} has runtime imports; cannot load it in isolation`);
  return import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
}

// ---------- Examples: extract one exported example plus the imports and helpers it uses ----------

function declaredNames(statement) {
  if (ts.isVariableStatement(statement)) {
    return statement.declarationList.declarations.flatMap((d) => (ts.isIdentifier(d.name) ? [d.name.text] : []));
  }
  if (
    (ts.isFunctionDeclaration(statement) ||
      ts.isClassDeclaration(statement) ||
      ts.isInterfaceDeclaration(statement) ||
      ts.isTypeAliasDeclaration(statement) ||
      ts.isEnumDeclaration(statement)) &&
    statement.name
  ) {
    return [statement.name.text];
  }
  return [];
}

function identifiersIn(node) {
  const names = new Set();
  const visit = (n) => {
    if (ts.isIdentifier(n)) names.add(n.text);
    ts.forEachChild(n, visit);
  };
  visit(node);
  return names;
}

function extractExample(sourceFile, name) {
  const text = sourceFile.getFullText();
  const decls = new Map();
  const imports = [];
  for (const statement of sourceFile.statements) {
    if (ts.isImportDeclaration(statement)) imports.push(statement);
    for (const declName of declaredNames(statement)) decls.set(declName, statement);
  }
  const root = decls.get(name);
  if (!root) return null;

  // Transitive closure of top-level declarations used by the example.
  const included = new Set([root]);
  const queue = [root];
  while (queue.length) {
    for (const id of identifiersIn(queue.pop())) {
      const decl = decls.get(id);
      if (decl && !included.has(decl)) {
        included.add(decl);
        queue.push(decl);
      }
    }
  }
  const body = [...included]
    .sort((a, b) => a.getStart(sourceFile) - b.getStart(sourceFile))
    .map((s) => text.slice(s.getStart(sourceFile), s.getEnd()).trim());
  const used = new Set([...included].flatMap((s) => [...identifiersIn(s)]));

  const importLines = [];
  for (const decl of imports) {
    const from = decl.moduleSpecifier.text;
    const clause = decl.importClause;
    if (!clause) continue;
    const parts = [];
    if (clause.name && used.has(clause.name.text)) parts.push(clause.name.text);
    const bindings = clause.namedBindings;
    if (bindings && ts.isNamespaceImport(bindings) && used.has(bindings.name.text)) parts.push(`* as ${bindings.name.text}`);
    if (bindings && ts.isNamedImports(bindings)) {
      const named = bindings.elements
        .filter((el) => used.has(el.name.text))
        .map((el) => text.slice(el.getStart(sourceFile), el.getEnd()));
      if (named.length) parts.push(`{ ${named.join(', ')} }`);
    }
    if (parts.length) importLines.push(`import ${clause.isTypeOnly ? 'type ' : ''}${parts.join(', ')} from '${from}';`);
  }
  return [importLines.join('\n'), ...body].filter(Boolean).join('\n\n');
}

// ---------- Components and patterns ----------

const CATEGORY_LABELS = {
  layout: 'Layout',
  typography: 'Tipografia',
  actions: 'Azioni',
  navigation: 'Navigazione',
  forms: 'Form',
  data: 'Contenuti e dati',
  charts: 'Grafici',
  dashboard: 'Dashboard',
  ai: 'AI',
  website: 'Gestione siti',
  community: 'Community',
  editor: 'Editor',
  feedback: 'Feedback',
  overlay: 'Overlay',
  patterns: 'Pattern',
};

const components = [];
const problems = [];
const metaFiles = [join(uiSrc, 'components'), join(uiSrc, 'patterns')]
  .flatMap(walk)
  .filter((f) => f.endsWith('.meta.ts'))
  .sort();
for (const metaFile of metaFiles) {
  const { doc } = await importTs(metaFile);
  if (!doc?.slug) {
    problems.push(`${rel(metaFile)}: no exported doc`);
    continue;
  }
  const examplesFile = metaFile.replace(/\.meta\.ts$/, '.examples.tsx');
  let sourceFile = null;
  try {
    sourceFile = ts.createSourceFile(examplesFile, read(examplesFile), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  } catch {
    problems.push(`${rel(metaFile)}: missing examples file`);
  }
  const examples = doc.examples.map((ex) => {
    const code = sourceFile ? extractExample(sourceFile, ex.name) : null;
    if (!code) problems.push(`${rel(examplesFile)}: example ${ex.name} not found`);
    return { ...ex, code: code ?? '' };
  });
  components.push({
    ...doc,
    examples,
    kind: metaFile.includes(`${sep}patterns${sep}`) ? 'pattern' : 'component',
    sourceDir: rel(dirname(metaFile)),
  });
}
const slugs = new Set();
for (const c of components) {
  if (slugs.has(c.slug)) problems.push(`duplicate slug ${c.slug}`);
  slugs.add(c.slug);
}

// ---------- Public exports of @dev-community/ui ----------

// Root entry plus optional subpath entries (`entry` is the subpath: 'editor' → '@dev-community/ui/editor').
const ENTRIES = [
  { entry: undefined, file: 'index.ts' },
  { entry: 'editor', file: 'editor.ts' },
  { entry: 'patterns', file: 'patterns-entry.ts' },
  { entry: 'widgets', file: 'widgets.ts' },
];

function publicExports() {
  const configPath = join(uiRoot, 'tsconfig.json');
  const config = ts.readConfigFile(configPath, ts.sys.readFile);
  const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, uiRoot);
  const program = ts.createProgram(
    ENTRIES.map((e) => join(uiSrc, e.file)),
    { ...parsed.options, noEmit: true },
  );
  const checker = program.getTypeChecker();
  return ENTRIES.flatMap(({ entry, file }) => {
    const moduleSymbol = checker.getSymbolAtLocation(program.getSourceFile(join(uiSrc, file)));
    return checker.getExportsOfModule(moduleSymbol).map((symbol) => {
      const target = symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol;
      return { name: symbol.name, kind: target.flags & ts.SymbolFlags.Value ? 'value' : 'type', ...(entry ? { entry } : {}) };
    });
  }).sort((a, b) => a.name.localeCompare(b.name));
}
const exportsList = publicExports();
const exportEntries = new Set(exportsList.map((e) => `${e.entry ?? ''}:${e.name}`));
for (const c of components) {
  const where = c.entry ? `@dev-community/ui/${c.entry}` : '@dev-community/ui';
  // Type-only exports are documented as "type Name".
  for (const name of c.exports.map((e) => e.replace(/^type\s+/, ''))) {
    if (!exportEntries.has(`${c.entry ?? ''}:${name}`)) problems.push(`${c.slug}: documented export ${name} is not exported by ${where}`);
  }
}

// ---------- Tokens ----------

const gen = await importTs(join(uiSrc, 'tokens', 'generated.ts'));
const P = gen.TOKEN_PREFIX;
const colorVar = (role) => `--${P}-color-${role.replace(/\./g, '-')}`;
const tokenVar = (token) => `--${P}-${token.replace(/\./g, '-')}`;

const presets = gen.PRESET_NAMES.map((name) => ({
  name,
  label: gen.PRESET_META[name].label,
  description: gen.PRESET_META[name].description,
  brand: gen.PRESET_META[name].brand,
  ...(gen.PRESET_META[name].tertiary ? { tertiary: gen.PRESET_META[name].tertiary } : {}),
  colors: gen.PRESET_COLORS[name],
}));
const tokens = {
  prefix: P,
  defaultPreset: gen.DEFAULT_PRESET,
  defaultLook: gen.DEFAULT_LOOK,
  color: gen.COLOR_ROLES.map((role) => ({ name: role, cssVar: colorVar(role) })),
  base: Object.entries(gen.BASE_TOKENS).map(([name, value]) => ({ name, cssVar: tokenVar(name), value: String(value) })),
  density: Object.fromEntries(
    Object.entries(gen.DENSITY_TOKENS).map(([density, values]) => [
      density,
      Object.entries(values).map(([name, value]) => ({ name, cssVar: tokenVar(name), value: String(value) })),
    ]),
  ),
  look: Object.fromEntries(
    Object.entries(gen.LOOK_TOKENS).map(([look, values]) => [
      look,
      Object.entries(values).map(([name, value]) => ({ name: `look.${name}`, cssVar: `--${P}-look-${name}`, value: String(value) })),
    ]),
  ),
  gradient: Object.entries(gen.GRADIENT_TOKENS ?? {}).map(([name, value]) => ({
    name: `gradient.${name}`,
    cssVar: `--${P}-gradient-${name}`,
    value: String(value),
  })),
  breakpoints: gen.breakpoints,
  contrastPairs: gen.CONTRAST_PAIRS,
  presets,
};

// Every --dc-* custom property defined anywhere in the library (same rule as lint:tokens).
const definedVars = new Set([
  ...tokens.color.map((t) => t.cssVar),
  ...tokens.base.map((t) => t.cssVar),
  ...Object.values(tokens.density).flat().map((t) => t.cssVar),
  ...Object.values(tokens.look).flat().map((t) => t.cssVar),
  ...tokens.gradient.map((t) => t.cssVar),
]);
for (const file of walk(uiSrc).filter((f) => /\.(css|tsx?)$/.test(f))) {
  const text = read(file);
  for (const m of text.matchAll(/(--dc-[a-z0-9-]+)\s*:/g)) definedVars.add(m[1]);
  for (const m of text.matchAll(/['"`](--dc-[a-z0-9-]+)['"`]\s*[:,\]]/g)) definedVars.add(m[1]);
}

// ---------- Setup (package README, split in sections) ----------

function markdownSections(markdown) {
  const sections = [];
  let current = null;
  let inFence = false;
  for (const line of markdown.split(/\r?\n/)) {
    if (/^```/.test(line)) inFence = !inFence;
    const heading = !inFence && line.match(/^##\s+(.+)$/);
    if (heading) {
      current = { title: heading[1].trim(), lines: [] };
      sections.push(current);
    } else if (current) {
      current.lines.push(line);
    } else {
      sections[0] ??= { title: 'Introduzione', lines: [] };
      current = sections[0];
      if (!/^#\s/.test(line)) current.lines.push(line);
    }
  }
  const slug = (s) =>
    s
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  return sections.map((s) => ({ id: slug(s.title), title: s.title, markdown: s.lines.join('\n').trim() }));
}
const setup = markdownSections(read(join(uiRoot, 'README.md')));

// ---------- Showcase page templates (docs site) ----------

const showcaseDir = join(docsSrc, 'showcase');
const { SHOWCASE } = await importTs(join(docsSrc, 'content', 'showcase.ts'));
const routes = read(join(showcaseDir, 'ShowcaseRoutes.tsx'));
const pages = SHOWCASE.map((entry) => {
  const route = routes.match(new RegExp(`path="${entry.slug}"[^\\n]*?<Page[^>]*><(\\w+)\\s*/>`));
  const componentName = route?.[1];
  const importMatch =
    componentName && routes.match(new RegExp(`^import \\{[^}]*\\b${componentName}\\b[^}]*\\} from '\\./(\\w+)';`, 'm'));
  if (!importMatch) {
    problems.push(`showcase ${entry.slug}: cannot resolve page component`);
    return null;
  }
  const file = join(showcaseDir, `${importMatch[1]}.tsx`);
  const code = read(file);
  const localImports = [...code.matchAll(/^import [\s\S]*? from '(\.{1,2}\/[^']+)';$/gm)].map((m) => m[1]);
  return { ...entry, title: entry.title.it, description: entry.description.it, component: componentName, file: rel(file), localImports, code };
}).filter(Boolean);

// ---------- Write ----------

if (problems.length) {
  console.error(`MCP catalog problems (${problems.length}):\n${problems.join('\n')}`);
  process.exit(1);
}

const uiPkg = JSON.parse(read(join(uiRoot, 'package.json')));
const catalog = {
  package: uiPkg.name,
  version: uiPkg.version,
  categories: CATEGORY_LABELS,
  components,
  exports: exportsList,
  tokens,
  cssVars: [...definedVars].sort(),
  setup,
  pages,
};
mkdirSync(dirname(outFile), { recursive: true });
const tempFile = `${outFile}.${process.pid}.${randomUUID()}.tmp`;
try {
  writeFileSync(tempFile, `${JSON.stringify(catalog)}\n`, { flag: 'wx' });
  renameSync(tempFile, outFile);
} finally {
  if (existsSync(tempFile)) unlinkSync(tempFile);
}
console.log(
  `MCP catalog: ${components.length} components/patterns, ${exportsList.length} exports, ${definedVars.size} CSS variables, ` +
    `${setup.length} setup sections, ${pages.length} page templates -> ${rel(outFile)}`,
);
