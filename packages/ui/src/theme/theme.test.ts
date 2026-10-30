import { describe, expect, it } from 'vitest';
import {
  COLOR_ROLES,
  CONTRAST_PAIRS,
  PRESET_NAMES,
  THEME_SCHEMA_VERSION,
  ThemeValidationError,
  contrastRatio,
  createTheme,
  getPreset,
  getThemePreferencesFromCookie,
  getThemeScript,
  parseThemeJson,
  themeToCss,
  themeToJson,
  themeToStyle,
  validateTheme,
} from './server';

describe('createTheme', () => {
  it('builds a custom theme from a brand seed with every role in both schemes', () => {
    const theme = createTheme({ name: 'acme', seeds: { brand: '#0a7d4f' } });
    expect(theme.kind).toBe('custom');
    for (const role of COLOR_ROLES) {
      expect(theme.colors.light[role]).toMatch(/^#[0-9a-f]{6}$/);
      expect(theme.colors.dark[role]).toMatch(/^#[0-9a-f]{6}$/);
    }
    expect(theme.colors.light['action.primary']).not.toBe(getPreset('aurora').colors.light['action.primary']);
  });

  it('extends a preset and applies role overrides after generation', () => {
    const theme = createTheme({ name: 'x', extends: 'lagoon', colors: { light: { 'text.primary': '#111' } } });
    expect(theme.colors.light['text.primary']).toBe('#111111');
    expect(theme.colors.dark['text.primary']).toBe(getPreset('lagoon').colors.dark['text.primary']);
  });

  it('throws a ThemeValidationError with issues for invalid input', () => {
    expect(() => createTheme({ name: 'aurora' })).toThrow(ThemeValidationError);
    try {
      createTheme({ name: 'Bad Name', seeds: { brand: 'red' } });
    } catch (e) {
      expect(e).toBeInstanceOf(ThemeValidationError);
      const codes = (e as ThemeValidationError).issues.map((i) => i.code);
      expect(codes).toEqual(expect.arrayContaining(['invalid_name', 'invalid_color']));
    }
  });

  it('keeps generated preset palettes above the declared contrast minimums', () => {
    for (const name of PRESET_NAMES) {
      for (const scheme of ['light', 'dark'] as const) {
        const colors = getPreset(name).colors[scheme];
        for (const [fg, bg, min] of CONTRAST_PAIRS) {
          expect(contrastRatio(colors[fg], colors[bg]), `${name}/${scheme} ${fg} on ${bg}`).toBeGreaterThanOrEqual(min);
        }
      }
    }
  });
});

describe('validateTheme / parseThemeJson', () => {
  it('reports invalid JSON', () => {
    const r = parseThemeJson('{ nope');
    expect(r.success).toBe(false);
    if (!r.success) expect(r.issues[0]?.code).toBe('invalid_json');
  });

  it('rejects oversized files', () => {
    const r = parseThemeJson(' '.repeat(70 * 1024));
    expect(r.success).toBe(false);
    if (!r.success) expect(r.issues[0]?.code).toBe('too_large');
  });

  it('requires schemaVersion and refuses newer versions', () => {
    const missing = validateTheme({ name: 'a' });
    expect(missing.success).toBe(false);
    const newer = validateTheme({ schemaVersion: THEME_SCHEMA_VERSION + 1, name: 'a' });
    expect(newer.success).toBe(false);
    if (!newer.success) expect(newer.issues[0]?.code).toBe('unsupported_version');
  });

  it('treats unknown tokens as errors by default and as warnings when ignored', () => {
    const input = { schemaVersion: 1, name: 'a', colors: { light: { 'text.rainbow': '#fff' } }, extra: true };
    const strict = validateTheme(input);
    expect(strict.success).toBe(false);
    const lenient = validateTheme(input, { unknown: 'ignore' });
    expect(lenient.success).toBe(true);
    if (lenient.success) expect(lenient.warnings.map((w) => w.code)).toEqual(['unknown_key', 'unknown_token']);
  });

  it('rejects CSS injection attempts in colors, lengths and fonts', () => {
    const r = validateTheme({
      schemaVersion: 1,
      name: 'evil',
      colors: { light: { 'text.primary': 'red; background: url(x)' } },
      tokens: { 'radius.md': '4px; }', 'font.family.sans': 'Inter; } body { display:none' },
      label: '<script>',
    });
    expect(r.success).toBe(false);
    if (!r.success) {
      expect(r.issues.map((i) => i.code).sort()).toEqual(['invalid_color', 'invalid_font_family', 'invalid_label', 'invalid_length']);
    }
  });

  it('round-trips through JSON', () => {
    const theme = createTheme({ name: 'round', label: 'Round', seeds: { brand: '#c2185b' }, tokens: { 'radius.md': '12px' } });
    const back = parseThemeJson(themeToJson(theme));
    expect(back.success).toBe(true);
    if (back.success) expect(back.theme.colors).toEqual(theme.colors);
  });
});

describe('serialization', () => {
  it('exports CSS scoped to the palette name for light, dark and system', () => {
    const theme = createTheme({ name: 'brand-x', seeds: { brand: '#336699' }, tokens: { 'radius.md': '6px' } });
    const css = themeToCss(theme);
    expect(css).toContain(':where([data-dc-theme][data-dc-palette="brand-x"])');
    expect(css).toContain('[data-dc-scheme="dark"]');
    expect(css).toContain('@media (prefers-color-scheme: dark)');
    expect(css).toContain('--dc-color-action-primary:');
    expect(css).toContain('--dc-radius-md: 6px;');
  });

  it('produces inline variables for both schemes', () => {
    const style = themeToStyle(createTheme({ name: 'y' }));
    expect(style['--dc-light-color-text-primary']).toMatch(/^#/);
    expect(style['--dc-dark-color-text-primary']).toMatch(/^#/);
  });
});

describe('SSR helpers', () => {
  it('reads and sanitizes preferences from a cookie header', () => {
    const value = encodeURIComponent(JSON.stringify({ mode: 'dark', theme: 'lagoon', density: 'huge' }));
    expect(getThemePreferencesFromCookie(`a=1; dc-theme=${value}`)).toEqual({ mode: 'dark', theme: 'lagoon' });
    expect(getThemePreferencesFromCookie('dc-theme=%7Bbroken')).toEqual({});
    expect(getThemePreferencesFromCookie(undefined)).toEqual({});
  });

  it('generates a self-contained theme script', () => {
    const script = getThemeScript({ storageKey: 'k', defaultMode: 'dark' });
    expect(script).toContain('"k":"k"');
    expect(script).not.toContain('</script');
    document.documentElement.removeAttribute('data-dc-scheme');
    new Function(script)();
    expect(document.documentElement.getAttribute('data-dc-scheme')).toBe('dark');
  });
});
