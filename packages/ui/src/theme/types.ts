import type { ColorRole, PresetKind, PresetName, Density } from '../tokens/generated';

export type { ColorRole, PresetKind, PresetName, Density };

/** User preference. `system` follows `prefers-color-scheme`. */
export type ThemeMode = 'light' | 'dark' | 'system';
/** Effective color scheme after resolving `system`. */
export type ResolvedScheme = 'light' | 'dark';

export const THEME_SCHEMA_VERSION = 1 as const;

/** Non-color tokens that a custom theme may override. */
export const OVERRIDABLE_TOKENS = [
  'radius.xs',
  'radius.sm',
  'radius.md',
  'radius.lg',
  'radius.xl',
  'font.family.sans',
  'font.family.mono',
] as const;
export type OverridableToken = (typeof OVERRIDABLE_TOKENS)[number];

export interface ThemeSeeds {
  /** Brand seed (hex). Generates the brand tonal palette. */
  brand?: string;
  /**
   * Optional second accent seed (hex), Material "tertiary". Used by `color.accent.*` and the
   * two-tone gradients. Defaults to the preset's tertiary seed or the brand hue rotated by 60°.
   */
  tertiary?: string;
  /** Optional neutral seed (hex); defaults to a low-chroma brand hue. */
  neutral?: string;
  danger?: string;
  warning?: string;
  success?: string;
  info?: string;
}

/** Serializable theme definition (JSON schema version 1). */
export interface ThemeInput {
  schemaVersion: typeof THEME_SCHEMA_VERSION;
  /** Identifier: lowercase letters, digits and dashes; must not equal a preset name. */
  name: string;
  label?: string;
  /** Preset used as a base. Defaults to the default preset. */
  extends?: PresetName;
  /** Regenerate palettes from seed colors. */
  seeds?: ThemeSeeds;
  /** Per-role overrides applied after palette generation. */
  colors?: {
    light?: Partial<Record<ColorRole, string>>;
    dark?: Partial<Record<ColorRole, string>>;
  };
  tokens?: Partial<Record<OverridableToken, string>>;
}

/** Fully resolved theme returned by `createTheme`. */
export interface Theme {
  readonly schemaVersion: typeof THEME_SCHEMA_VERSION;
  readonly name: string;
  readonly label: string;
  readonly kind: 'preset' | 'custom';
  readonly extends: PresetName;
  readonly colors: { readonly light: Readonly<Record<ColorRole, string>>; readonly dark: Readonly<Record<ColorRole, string>> };
  readonly tokens: Readonly<Partial<Record<OverridableToken, string>>>;
  /** The normalized input, used for JSON export. */
  readonly input: ThemeInput;
}

export type ThemeIssueCode =
  | 'invalid_json'
  | 'too_large'
  | 'invalid_type'
  | 'missing_field'
  | 'unsupported_version'
  | 'invalid_version'
  | 'unknown_key'
  | 'unknown_token'
  | 'unknown_preset'
  | 'invalid_name'
  | 'reserved_name'
  | 'invalid_color'
  | 'invalid_length'
  | 'invalid_font_family'
  | 'invalid_label';

export interface ThemeIssue {
  code: ThemeIssueCode;
  severity: 'error' | 'warning';
  /** JSON path, e.g. `colors.light.text.primary`. */
  path: string;
  /** Developer-facing English message. For end users, use `formatThemeIssue(issue, messages)`. */
  message: string;
  /** Values interpolated by localized messages (see `Messages.themeIssue`). */
  params?: ThemeIssueParams;
}

export interface ThemeIssueParams {
  /** The rejected value, serialized as JSON. */
  value?: string;
  /** Expected JSON type for `invalid_type`. */
  expected?: 'object' | 'string';
  /** Schema version found in the input. */
  version?: number;
  /** Highest schema version supported by this library. */
  supported?: number;
  /** Accepted values, e.g. preset names or overridable tokens. */
  allowed?: readonly string[];
  /** Size limit for `too_large`, in KB. */
  limitKb?: number;
}

export type ThemeValidationResult =
  | { success: true; theme: Theme; warnings: ThemeIssue[] }
  | { success: false; issues: ThemeIssue[] };

export interface ValidateOptions {
  /** How to treat unknown keys/tokens. Default `error`. */
  unknown?: 'error' | 'ignore';
}
