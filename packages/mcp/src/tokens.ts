import { type Catalog, type TokenEntry, normalize, suggest } from './catalog.js';

export type Rgb = [number, number, number];

const HEX_RE = /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

function hslToRgb(h: number, s: number, l: number): Rgb {
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [f(0) * 255, f(8) * 255, f(4) * 255];
}

/** Parses #hex, rgb()/rgba() and hsl()/hsla(). Returns null for anything else (keywords, var(), oklch…). */
export function parseColor(input: string): Rgb | null {
  const value = input.trim().toLowerCase();
  const hex = value.match(HEX_RE)?.[1];
  if (hex) {
    const full = hex.length <= 4 ? [...hex].map((c) => c + c).join('') : hex;
    return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16)) as Rgb;
  }
  const fn = value.match(/^(rgba?|hsla?)\(([^)]*)\)$/);
  if (!fn) return null;
  const parts = fn[2]!
    .split(/[\s,/]+/)
    .filter(Boolean)
    .map((p) => ({ n: parseFloat(p), pct: p.endsWith('%') }));
  if (parts.length < 3 || parts.slice(0, 3).some((p) => Number.isNaN(p.n))) return null;
  const [a, b, c] = parts as [{ n: number; pct: boolean }, { n: number; pct: boolean }, { n: number; pct: boolean }];
  if (fn[1]!.startsWith('rgb')) return [a, b, c].map((p) => (p.pct ? (p.n / 100) * 255 : p.n)) as Rgb;
  return hslToRgb(a.n, b.n / 100, c.n / 100);
}

function toOklab([r, g, b]: Rgb): Rgb {
  const lin = (v: number) => {
    const c = v / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  const [lr, lg, lb] = [lin(r), lin(g), lin(b)];
  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

/** Perceptual distance (OKLab, scaled ×100: < 2 is practically identical, > 10 clearly different). */
export function colorDistance(a: Rgb, b: Rgb): number {
  const [x, y] = [toOklab(a), toOklab(b)];
  return Math.hypot(x[0] - y[0], x[1] - y[1], x[2] - y[2]) * 100;
}

export interface ColorMatch {
  role: string;
  cssVar: string;
  value: string;
  distance: number;
}

export function nearestColors(catalog: Catalog, color: string, preset?: string, scheme: 'light' | 'dark' = 'light', limit = 5): ColorMatch[] {
  const rgb = parseColor(color);
  if (!rgb) return [];
  const palette = getPreset(catalog, preset)?.colors[scheme] ?? {};
  return catalog.tokens.color
    .flatMap((t) => {
      const value = palette[t.name];
      const parsed = value ? parseColor(value) : null;
      return parsed && value ? [{ role: t.name, cssVar: t.cssVar, value, distance: colorDistance(rgb, parsed) }] : [];
    })
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit);
}

/** Converts px/rem/em lengths to px (16px root). Returns null for anything else. */
export function lengthToPx(value: string): number | null {
  const m = value.trim().match(/^(-?\d*\.?\d+)(px|rem|em)?$/);
  if (!m) return null;
  const n = parseFloat(m[1]!);
  if (!m[2]) return n === 0 ? 0 : null;
  return m[2] === 'px' ? n : n * 16;
}

const LENGTH_GROUPS: Record<string, RegExp> = {
  space: /^space\./,
  radius: /^radius\./,
  'font-size': /^font\.size\./,
  border: /^border\.width\./,
  container: /^container\./,
};

export interface LengthMatch extends TokenEntry {
  px: number;
  delta: number;
}

export function nearestLengths(catalog: Catalog, value: string, group?: keyof typeof LENGTH_GROUPS, limit = 5): LengthMatch[] {
  const px = lengthToPx(value);
  if (px === null) return [];
  const groups = group ? [LENGTH_GROUPS[group]!] : Object.values(LENGTH_GROUPS);
  return catalog.tokens.base
    .filter((t) => groups.some((re) => re.test(t.name)))
    .flatMap((t) => {
      const tokenPx = lengthToPx(t.value);
      return tokenPx === null ? [] : [{ ...t, px: tokenPx, delta: Math.abs(tokenPx - px) }];
    })
    .sort((a, b) => a.delta - b.delta || a.name.localeCompare(b.name))
    .slice(0, limit);
}

export function getPreset(catalog: Catalog, name?: string) {
  const wanted = name ?? catalog.tokens.defaultPreset;
  return catalog.tokens.presets.find((p) => p.name === wanted);
}

export interface FlatToken {
  name: string;
  cssVar: string;
  group: string;
  value: string;
  darkValue?: string;
  note?: string;
}

/** Every public token as a flat list. Color values come from `preset` (default theme). */
export function allTokens(catalog: Catalog, preset?: string): FlatToken[] {
  const p = getPreset(catalog, preset);
  const t = catalog.tokens;
  const out: FlatToken[] = t.color.map((c) => ({
    name: c.name,
    cssVar: c.cssVar,
    group: 'color',
    value: p?.colors.light[c.name] ?? '',
    darkValue: p?.colors.dark[c.name] ?? '',
  }));
  for (const b of t.base) out.push({ ...b, group: b.name.split('.')[0]! });
  for (const [density, list] of Object.entries(t.density)) {
    for (const d of list) out.push({ ...d, group: 'density', note: density });
  }
  for (const [look, list] of Object.entries(t.look)) {
    for (const l of list) out.push({ ...l, group: 'look', note: look });
  }
  for (const g of t.gradient) out.push({ ...g, group: 'gradient' });
  return out;
}

export function tokenGroups(catalog: Catalog): string[] {
  return [...new Set(allTokens(catalog).map((t) => t.group))];
}

/** Finds a token by dotted name, CSS variable or `var(--…)` reference. */
export function lookupToken(catalog: Catalog, query: string, preset?: string): FlatToken[] {
  const q = query.trim().replace(/^var\(\s*/, '').replace(/\s*(,[^)]*)?\)$/, '');
  return allTokens(catalog, preset).filter((t) => t.cssVar === q || t.name === q);
}

export function searchTokens(catalog: Catalog, query: string, preset?: string): FlatToken[] {
  const terms = normalize(query).split(/[^a-z0-9-]+/).filter(Boolean);
  return allTokens(catalog, preset).filter((t) => terms.every((term) => normalize(`${t.name} ${t.cssVar} ${t.group}`).includes(term)));
}

export function suggestCssVars(catalog: Catalog, name: string): string[] {
  return suggest(name, catalog.cssVars);
}
