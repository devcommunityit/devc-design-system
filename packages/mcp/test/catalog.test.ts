import { describe, expect, it } from 'vitest';
import { findComponent, loadCatalog, searchComponents } from '../src/catalog.js';
import { lookupToken, nearestColors, nearestLengths, parseColor } from '../src/tokens.js';

const catalog = loadCatalog();

describe('catalog', () => {
  it('is generated from the design system sources', () => {
    expect(catalog.package).toBe('@dev-community/ui');
    expect(catalog.components.length).toBeGreaterThan(90);
    expect(catalog.components.some((c) => c.kind === 'pattern')).toBe(true);
    expect(catalog.pages.length).toBeGreaterThan(5);
    expect(catalog.exports.find((e) => e.name === 'Button')).toEqual({ name: 'Button', kind: 'value' });
    expect(catalog.exports.find((e) => e.name === 'ThemeProviderProps')?.kind).toBe('type');
  });

  it('has code for every documented example', () => {
    for (const component of catalog.components) {
      for (const example of component.examples) expect(example.code, `${component.slug}/${example.name}`).toMatch(/export (function|const) /);
    }
  });

  it('generates page titles and descriptions as text', () => {
    for (const page of catalog.pages) {
      expect(typeof page.title, page.slug).toBe('string');
      expect(typeof page.description, page.slug).toBe('string');
      expect(page.title.length).toBeGreaterThan(0);
      expect(page.description.length).toBeGreaterThan(0);
    }
  });

  it('exports every documented symbol from its documented entry point', () => {
    for (const component of catalog.components) {
      for (const name of component.exports.map((e) => e.replace(/^type\s+/, ''))) {
        expect(
          catalog.exports.some((e) => e.name === name && e.entry === component.entry),
          `${component.slug}: ${name}`,
        ).toBe(true);
      }
    }
    expect(findComponent(catalog, 'email-preview')?.entry).toBe('editor');
  });

  it.each(['RaffleEntry', 'VolunteerShift'])('preserves %s in both root and patterns exports', (name) => {
    expect(catalog.exports.filter((e) => e.name === name)).toEqual([
      { name, kind: 'type' },
      { name, kind: 'type', entry: 'patterns' },
    ]);
  });

  it('finds components by slug, name and any export', () => {
    expect(findComponent(catalog, 'button')?.name).toBe('Button');
    expect(findComponent(catalog, 'LinkButton')?.slug).toBe('button');
    expect(findComponent(catalog, 'nope')).toBeUndefined();
  });

  it('ranks search results by relevance', () => {
    expect(searchComponents(catalog, 'date picker')[0]?.component.slug).toBe('date-picker');
    expect(searchComponents(catalog, 'toast')[0]?.component.slug).toBe('toast');
    expect(searchComponents(catalog, 'zzzz-unknown')).toEqual([]);
  });
});

describe('tokens', () => {
  it('parses CSS colors', () => {
    expect(parseColor('#fff')).toEqual([255, 255, 255]);
    expect(parseColor('rgb(0 128 255 / .5)')).toEqual([0, 128, 255]);
    expect(parseColor('hsl(0, 100%, 50%)')?.map(Math.round)).toEqual([255, 0, 0]);
    expect(parseColor('var(--x)')).toBeNull();
  });

  it('maps a theme color back to its role', () => {
    const value = catalog.tokens.presets.find((p) => p.name === catalog.tokens.defaultPreset)!.colors.light['text.primary']!;
    const [best] = nearestColors(catalog, value);
    expect(best?.distance).toBeCloseTo(0, 5);
    expect(best?.cssVar).toMatch(/^--dc-color-/);
  });

  it('maps lengths to the closest size tokens', () => {
    const [best] = nearestLengths(catalog, '16px', 'space');
    expect(best).toMatchObject({ name: 'space.4', cssVar: '--dc-space-4', delta: 0 });
  });

  it('looks tokens up by name, variable or var() reference', () => {
    expect(lookupToken(catalog, 'space.4')[0]?.cssVar).toBe('--dc-space-4');
    expect(lookupToken(catalog, 'var(--dc-color-text-primary)')[0]?.name).toBe('text.primary');
  });
});
