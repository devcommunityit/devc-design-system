import { readFileSync, statSync } from 'node:fs';

export interface PropDoc {
  name: string;
  type: string;
  default?: string;
  description: string;
  required?: boolean;
}

export interface ExampleDoc {
  name: string;
  title: string;
  description?: string;
  code: string;
}

export interface ComponentEntry {
  exports: string[];
  /** Package subpath of the exports when not the root entry, e.g. 'editor'. */
  entry?: string;
  name: string;
  slug: string;
  category: string;
  summary: string;
  whenToUse: string[];
  whenNotToUse: string[];
  props: PropDoc[];
  inherits?: string;
  keyboard: Array<{ keys: string; action: string }>;
  accessibility: string[];
  responsive: string[];
  customization: string[];
  commonMistakes: string[];
  examples: ExampleDoc[];
  status: { implemented: boolean; documented: boolean; tests: string[]; limits: string[] };
  apg?: string;
  kind: 'component' | 'pattern';
  sourceDir: string;
}

export interface TokenEntry {
  name: string;
  cssVar: string;
  value: string;
}

export interface PresetEntry {
  name: string;
  label: { it: string; en: string };
  description: string;
  brand: string;
  tertiary?: string;
  colors: { light: Record<string, string>; dark: Record<string, string> };
}

export interface Catalog {
  package: string;
  version: string;
  categories: Record<string, string>;
  components: ComponentEntry[];
  exports: Array<{ name: string; kind: 'value' | 'type'; entry?: string }>;
  tokens: {
    prefix: string;
    defaultPreset: string;
    defaultLook: string;
    color: Array<{ name: string; cssVar: string }>;
    base: TokenEntry[];
    density: Record<string, TokenEntry[]>;
    look: Record<string, TokenEntry[]>;
    gradient: TokenEntry[];
    breakpoints: Record<string, number>;
    contrastPairs: Array<[string, string, number]>;
    presets: PresetEntry[];
  };
  cssVars: string[];
  setup: Array<{ id: string; title: string; markdown: string }>;
  pages: Array<{
    slug: string;
    title: string;
    description: string;
    component: string;
    file: string;
    localImports: string[];
    code: string;
  }>;
}

/** Reloads the catalog when its file is replaced or modified; unchanged files reuse the parsed data. */
export function createCatalogLoader(path = new URL('../data/catalog.json', import.meta.url)): () => Catalog {
  let cached: Catalog | undefined;
  let signature: string | undefined;
  return () => {
    const stat = statSync(path, { bigint: true });
    const next = [stat.dev, stat.ino, stat.size, stat.mtimeNs].join(':');
    if (!cached || signature !== next) {
      cached = JSON.parse(readFileSync(path, 'utf8')) as Catalog;
      signature = next;
    }
    return cached;
  };
}

/** Loads generated data/catalog.json, resolving the same path from src/ and dist/. */
export const loadCatalog = createCatalogLoader();

export const normalize = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

/** Strips the "type " prefix used for type-only exports in the docs metadata. */
export const exportName = (e: string) => e.replace(/^type\s+/, '');

export function findComponent(catalog: Catalog, query: string): ComponentEntry | undefined {
  const q = normalize(query.trim());
  return (
    catalog.components.find((c) => c.slug === q) ??
    catalog.components.find((c) => normalize(c.name) === q) ??
    catalog.components.find((c) => c.exports.some((e) => normalize(exportName(e)) === q))
  );
}

/** Component doc whose main (first) export is `name`, falling back to any doc that lists it. */
export function componentForExport(catalog: Catalog, name: string): ComponentEntry | undefined {
  return (
    catalog.components.find((c) => exportName(c.exports[0] ?? '') === name) ??
    catalog.components.find((c) => c.exports.some((e) => exportName(e) === name))
  );
}

export function levenshtein(a: string, b: string): number {
  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = row[0]!;
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = row[j]!;
      row[j] = Math.min(row[j]! + 1, row[j - 1]! + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = tmp;
    }
  }
  return row[b.length]!;
}

/** Closest candidates by edit distance (case-insensitive), for "did you mean" hints. */
export function suggest(value: string, candidates: Iterable<string>, limit = 3): string[] {
  const v = value.toLowerCase();
  const maxDistance = Math.max(2, Math.floor(v.length / 3));
  return [...candidates]
    .map((c) => {
      const lc = c.toLowerCase();
      const distance = lc.includes(v) || v.includes(lc) ? Math.abs(lc.length - v.length) / 10 : levenshtein(v, lc);
      return { c, distance };
    })
    .filter((x) => x.distance <= maxDistance)
    .sort((a, b) => a.distance - b.distance || a.c.localeCompare(b.c))
    .slice(0, limit)
    .map((x) => x.c);
}

export interface SearchHit {
  component: ComponentEntry;
  score: number;
}

export function searchComponents(catalog: Catalog, query: string, limit = 10): SearchHit[] {
  const q = normalize(query.trim());
  const terms = q.split(/[^a-z0-9]+/).filter((t) => t.length > 1);
  if (!terms.length) return [];
  const hits: SearchHit[] = [];
  for (const component of catalog.components) {
    const names = [component.name, component.slug, ...component.exports.map(exportName)].map(normalize);
    const category = normalize(`${component.category} ${catalog.categories[component.category] ?? ''}`);
    const summary = normalize(component.summary);
    const usage = normalize([...component.whenToUse, ...component.customization].join(' '));
    const props = normalize(component.props.map((p) => `${p.name} ${p.description}`).join(' '));
    const examples = normalize(component.examples.map((e) => `${e.title} ${e.description ?? ''}`).join(' '));
    let score = 0;
    if (names.includes(q)) score += 100;
    for (const term of terms) {
      if (names.some((n) => n === term)) score += 40;
      else if (names.some((n) => n.includes(term))) score += 20;
      if (category.includes(term)) score += 10;
      if (summary.includes(term)) score += 6;
      if (usage.includes(term)) score += 3;
      if (examples.includes(term)) score += 2;
      if (props.includes(term)) score += 1;
    }
    if (score > 0) hits.push({ component, score });
  }
  return hits.sort((a, b) => b.score - a.score || a.component.name.localeCompare(b.component.name)).slice(0, limit);
}
