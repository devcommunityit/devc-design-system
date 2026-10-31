import {
  COLOR_ROLES,
  DEFAULT_PRESET,
  FEEDBACK_SEEDS,
  PALETTE_RULES,
  PRESET_COLORS_PACKED,
  PRESET_META,
  PRESET_NAMES,
  ROLE_SPECS,
  type ColorRole,
  type PresetName,
} from '../tokens/generated';
import { createTonalPalettes, isHexColor, normalizeHex, resolveRoles, type RoleSpec } from './palette';
import {
  OVERRIDABLE_TOKENS,
  THEME_SCHEMA_VERSION,
  type OverridableToken,
  type Theme,
  type ThemeInput,
  type ThemeIssue,
  type ThemeSeeds,
  type ThemeValidationResult,
  type ValidateOptions,
} from './types';

export const MAX_THEME_JSON_BYTES = 64 * 1024;

const NAME_RE = /^[a-z][a-z0-9-]{0,47}$/;
const LENGTH_RE = /^(?:0|\d{1,3}(?:\.\d{1,3})?(?:px|rem|em))$/;
const FONT_FAMILY_RE = /^[A-Za-z0-9 ,"'-]{1,300}$/;
const SEED_KEYS = ['brand', 'tertiary', 'neutral', 'danger', 'warning', 'success', 'info'] as const;
const TOP_KEYS = ['schemaVersion', 'name', 'label', 'extends', 'seeds', 'colors', 'tokens'] as const;

const colorRoleSet = new Set<string>(COLOR_ROLES);
const tokenSet = new Set<string>(OVERRIDABLE_TOKENS);
const presetSet = new Set<string>(PRESET_NAMES);

export function isPresetName(value: unknown): value is PresetName {
  return typeof value === 'string' && presetSet.has(value);
}

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);

/** Thrown by `createTheme` when the input is invalid. */
export class ThemeValidationError extends Error {
  readonly issues: ThemeIssue[];
  constructor(issues: ThemeIssue[]) {
    super(`Invalid theme: ${issues.map((i) => `${i.path || '(root)'}: ${i.message}`).join('; ')}`);
    this.name = 'ThemeValidationError';
    this.issues = issues;
  }
}

/**
 * Explicit schema migrations, keyed by the version they upgrade *from*.
 * Version 1 is the first public schema, so there are no migrations yet; future
 * versions add an entry here instead of silently reinterpreting old files.
 */
const MIGRATIONS: Record<number, (input: Record<string, unknown>) => Record<string, unknown>> = {};

function migrate(raw: Record<string, unknown>, issues: ThemeIssue[]): Record<string, unknown> | null {
  const version = raw.schemaVersion;
  if (version === undefined) {
    issues.push({ code: 'missing_field', severity: 'error', path: 'schemaVersion', message: `"schemaVersion" is required (current: ${THEME_SCHEMA_VERSION}).`, params: { supported: THEME_SCHEMA_VERSION } });
    return null;
  }
  if (typeof version !== 'number' || !Number.isInteger(version) || version < 1) {
    issues.push({ code: 'invalid_version', severity: 'error', path: 'schemaVersion', message: '"schemaVersion" must be a positive integer.', params: { value: JSON.stringify(version) } });
    return null;
  }
  if (version > THEME_SCHEMA_VERSION) {
    issues.push({
      code: 'unsupported_version',
      severity: 'error',
      path: 'schemaVersion',
      message: `Theme uses schema version ${version}, but this library supports up to ${THEME_SCHEMA_VERSION}. Update @dev-community/ui.`,
      params: { version, supported: THEME_SCHEMA_VERSION },
    });
    return null;
  }
  let current = raw;
  for (let v = version; v < THEME_SCHEMA_VERSION; v++) {
    const step = MIGRATIONS[v];
    if (!step) {
      issues.push({ code: 'unsupported_version', severity: 'error', path: 'schemaVersion', message: `No migration from schema version ${v}.`, params: { version: v, supported: THEME_SCHEMA_VERSION } });
      return null;
    }
    current = step(current);
  }
  return current;
}

function validateColor(value: unknown, path: string, issues: ThemeIssue[]): string | undefined {
  if (typeof value !== 'string' || !isHexColor(value.trim())) {
    issues.push({ code: 'invalid_color', severity: 'error', path, message: `Expected a hex color like "#1a73e8", got ${JSON.stringify(value)}.`, params: { value: JSON.stringify(value) } });
    return undefined;
  }
  return normalizeHex(value);
}

function unknownIssue(code: 'unknown_key' | 'unknown_token', path: string, opts: ValidateOptions, issues: ThemeIssue[]) {
  const ignore = opts.unknown === 'ignore';
  issues.push({
    code,
    severity: ignore ? 'warning' : 'error',
    path,
    message: code === 'unknown_token' ? `Unknown token "${path.split('.').slice(2).join('.')}"${ignore ? ' (ignored)' : ''}.` : `Unknown key "${path}"${ignore ? ' (ignored)' : ''}.`,
  });
}

function parseInput(raw: unknown, opts: ValidateOptions, issues: ThemeIssue[]): ThemeInput | null {
  if (!isRecord(raw)) {
    issues.push({ code: 'invalid_type', severity: 'error', path: '', message: 'Theme must be a JSON object.', params: { expected: 'object' } });
    return null;
  }
  const migrated = migrate(raw, issues);
  if (!migrated) return null;

  for (const key of Object.keys(migrated)) {
    if (!(TOP_KEYS as readonly string[]).includes(key)) unknownIssue('unknown_key', key, opts, issues);
  }

  const out: ThemeInput = { schemaVersion: THEME_SCHEMA_VERSION, name: '' };

  const name = migrated.name;
  if (typeof name !== 'string') {
    issues.push({ code: 'missing_field', severity: 'error', path: 'name', message: '"name" is required.' });
  } else if (!NAME_RE.test(name)) {
    issues.push({ code: 'invalid_name', severity: 'error', path: 'name', message: 'Name must start with a letter and contain only a-z, 0-9 and "-" (max 48 chars).', params: { value: JSON.stringify(name) } });
  } else if (presetSet.has(name)) {
    issues.push({ code: 'reserved_name', severity: 'error', path: 'name', message: `"${name}" is a built-in preset name; choose another name.`, params: { value: JSON.stringify(name) } });
  } else {
    out.name = name;
  }

  if (migrated.label !== undefined) {
    if (typeof migrated.label !== 'string' || migrated.label.length > 80 || /[<>]/.test(migrated.label)) {
      issues.push({ code: 'invalid_label', severity: 'error', path: 'label', message: 'Label must be a string of max 80 characters without "<" or ">".' });
    } else {
      out.label = migrated.label;
    }
  }

  if (migrated.extends !== undefined) {
    if (!isPresetName(migrated.extends)) {
      issues.push({ code: 'unknown_preset', severity: 'error', path: 'extends', message: `Unknown preset ${JSON.stringify(migrated.extends)}. Available: ${PRESET_NAMES.join(', ')}.`, params: { value: JSON.stringify(migrated.extends), allowed: PRESET_NAMES } });
    } else {
      out.extends = migrated.extends;
    }
  }

  if (migrated.seeds !== undefined) {
    if (!isRecord(migrated.seeds)) {
      issues.push({ code: 'invalid_type', severity: 'error', path: 'seeds', message: '"seeds" must be an object.', params: { expected: 'object' } });
    } else {
      const seeds: ThemeSeeds = {};
      for (const [k, v] of Object.entries(migrated.seeds)) {
        if (!(SEED_KEYS as readonly string[]).includes(k)) {
          unknownIssue('unknown_key', `seeds.${k}`, opts, issues);
          continue;
        }
        const c = validateColor(v, `seeds.${k}`, issues);
        if (c) seeds[k as (typeof SEED_KEYS)[number]] = c;
      }
      out.seeds = seeds;
    }
  }

  if (migrated.colors !== undefined) {
    if (!isRecord(migrated.colors)) {
      issues.push({ code: 'invalid_type', severity: 'error', path: 'colors', message: '"colors" must be an object with "light" and/or "dark".', params: { expected: 'object' } });
    } else {
      out.colors = {};
      for (const [scheme, map] of Object.entries(migrated.colors)) {
        if (scheme !== 'light' && scheme !== 'dark') {
          unknownIssue('unknown_key', `colors.${scheme}`, opts, issues);
          continue;
        }
        if (!isRecord(map)) {
          issues.push({ code: 'invalid_type', severity: 'error', path: `colors.${scheme}`, message: `"colors.${scheme}" must be an object.`, params: { expected: 'object' } });
          continue;
        }
        const target: Partial<Record<ColorRole, string>> = {};
        for (const [role, value] of Object.entries(map)) {
          if (!colorRoleSet.has(role)) {
            unknownIssue('unknown_token', `colors.${scheme}.${role}`, opts, issues);
            continue;
          }
          const c = validateColor(value, `colors.${scheme}.${role}`, issues);
          if (c) target[role as ColorRole] = c;
        }
        out.colors[scheme] = target;
      }
    }
  }

  if (migrated.tokens !== undefined) {
    if (!isRecord(migrated.tokens)) {
      issues.push({ code: 'invalid_type', severity: 'error', path: 'tokens', message: '"tokens" must be an object.', params: { expected: 'object' } });
    } else {
      const tokens: Partial<Record<OverridableToken, string>> = {};
      for (const [token, value] of Object.entries(migrated.tokens)) {
        const path = `tokens.${token}`;
        if (!tokenSet.has(token)) {
          issues.push({
            code: 'unknown_token',
            severity: opts.unknown === 'ignore' ? 'warning' : 'error',
            path,
            message: `Token "${token}" cannot be overridden. Allowed: ${OVERRIDABLE_TOKENS.join(', ')}.`,
            params: { allowed: OVERRIDABLE_TOKENS },
          });
          continue;
        }
        if (typeof value !== 'string') {
          issues.push({ code: 'invalid_type', severity: 'error', path, message: 'Token values must be strings.', params: { expected: 'string' } });
          continue;
        }
        const v = value.trim();
        if (token.startsWith('radius.')) {
          if (!LENGTH_RE.test(v)) {
            issues.push({ code: 'invalid_length', severity: 'error', path, message: `Expected a length like "8px" or "0.5rem", got ${JSON.stringify(value)}.`, params: { value: JSON.stringify(value) } });
            continue;
          }
        } else if (!FONT_FAMILY_RE.test(v) || /["']/.test(v.replace(/"[^"]*"|'[^']*'/g, ''))) {
          issues.push({ code: 'invalid_font_family', severity: 'error', path, message: 'Font family may contain only letters, digits, spaces, commas, dashes and balanced quotes.', params: { value: JSON.stringify(value) } });
          continue;
        }
        tokens[token as OverridableToken] = v;
      }
      out.tokens = tokens;
    }
  }

  return out;
}

function resolveTheme(input: ThemeInput): Theme {
  const base = input.extends ?? DEFAULT_PRESET;
  let light: Record<ColorRole, string> = { ...presetColors(base).light };
  let dark: Record<ColorRole, string> = { ...presetColors(base).dark };
  const seeds = input.seeds;
  if (seeds && Object.keys(seeds).length > 0) {
    const palettes = createTonalPalettes(
      {
        brand: seeds.brand ?? PRESET_META[base].brand,
        // A new brand seed re-derives the tertiary hue unless it is seeded explicitly.
        tertiary: seeds.tertiary ?? (seeds.brand ? undefined : PRESET_META[base].tertiary),
        neutral: seeds.neutral,
        danger: seeds.danger ?? FEEDBACK_SEEDS.danger,
        warning: seeds.warning ?? FEEDBACK_SEEDS.warning,
        success: seeds.success ?? FEEDBACK_SEEDS.success,
        info: seeds.info ?? FEEDBACK_SEEDS.info,
      },
      PALETTE_RULES,
    );
    const specs: Record<ColorRole, RoleSpec> = ROLE_SPECS;
    light = resolveRoles(palettes, specs, 'light');
    dark = resolveRoles(palettes, specs, 'dark');
  }
  Object.assign(light, input.colors?.light);
  Object.assign(dark, input.colors?.dark);
  return Object.freeze({
    schemaVersion: THEME_SCHEMA_VERSION,
    name: input.name,
    label: input.label ?? input.name,
    kind: 'custom' as const,
    extends: base,
    colors: Object.freeze({ light: Object.freeze(light), dark: Object.freeze(dark) }),
    tokens: Object.freeze({ ...input.tokens }),
    input,
  });
}

/** Validates unknown data (e.g. imported JSON) without throwing. */
export function validateTheme(raw: unknown, options: ValidateOptions = {}): ThemeValidationResult {
  const issues: ThemeIssue[] = [];
  const input = parseInput(raw, options, issues);
  const errors = issues.filter((i) => i.severity === 'error');
  if (!input || errors.length > 0) return { success: false, issues };
  return { success: true, theme: resolveTheme(input), warnings: issues };
}

/** Parses a JSON string and validates it as a theme. Never evaluates or injects CSS. */
export function parseThemeJson(json: string, options: ValidateOptions = {}): ThemeValidationResult {
  if (json.length > MAX_THEME_JSON_BYTES) {
    return { success: false, issues: [{ code: 'too_large', severity: 'error', path: '', message: `Theme file exceeds ${MAX_THEME_JSON_BYTES / 1024} KB.`, params: { limitKb: MAX_THEME_JSON_BYTES / 1024 } }] };
  }
  let data: unknown;
  try {
    data = JSON.parse(json);
  } catch (error) {
    return {
      success: false,
      issues: [{ code: 'invalid_json', severity: 'error', path: '', message: `Invalid JSON: ${error instanceof Error ? error.message : String(error)}` }],
    };
  }
  return validateTheme(data, options);
}

/**
 * Creates a validated, fully resolved custom theme.
 * @throws {ThemeValidationError} when the definition is invalid.
 */
export function createTheme(input: Omit<ThemeInput, 'schemaVersion'> & { schemaVersion?: typeof THEME_SCHEMA_VERSION }, options: ValidateOptions = {}): Theme {
  const result = validateTheme({ ...input, schemaVersion: input.schemaVersion ?? THEME_SCHEMA_VERSION }, options);
  if (!result.success) throw new ThemeValidationError(result.issues.filter((i) => i.severity === 'error'));
  return result.theme;
}

const presetColorCache = new Map<PresetName, Theme['colors']>();

/** Decodes the packed preset colors; the full PRESET_COLORS map stays out of the runtime bundle. */
function presetColors(name: PresetName): Theme['colors'] {
  let colors = presetColorCache.get(name);
  if (!colors) {
    const packed = PRESET_COLORS_PACKED[name];
    const read = (offset: number) =>
      Object.freeze(
        Object.fromEntries(COLOR_ROLES.map((role, i) => [role, `#${packed.slice((offset + i) * 6, (offset + i + 1) * 6)}`])) as Record<ColorRole, string>,
      );
    colors = Object.freeze({ light: read(0), dark: read(COLOR_ROLES.length) });
    presetColorCache.set(name, colors);
  }
  return colors;
}

const presetCache = new Map<PresetName, Theme>();

/** Returns the resolved built-in preset. */
export function getPreset(name: PresetName): Theme {
  if (!isPresetName(name)) {
    throw new Error(`[dc] Unknown theme preset "${String(name)}". Expected one of: ${PRESET_NAMES.join(', ')}.`);
  }
  let theme = presetCache.get(name);
  if (!theme) {
    theme = Object.freeze({
      schemaVersion: THEME_SCHEMA_VERSION,
      name,
      label: PRESET_META[name].label.en,
      kind: 'preset' as const,
      extends: name,
      colors: presetColors(name),
      tokens: Object.freeze({}),
      input: { schemaVersion: THEME_SCHEMA_VERSION, name, extends: name },
    });
    presetCache.set(name, theme);
  }
  return theme;
}

/** Serializable JSON (schema version 1) for a theme. */
export function themeToJson(theme: Theme): string {
  return JSON.stringify(theme.input, null, 2);
}
