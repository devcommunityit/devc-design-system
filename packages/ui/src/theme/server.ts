/**
 * Server-safe entry (`@dev-community/ui/theme`): no React, no DOM access at import time.
 * Use it in Next.js server components, build scripts and Node.
 */
export {
  createTheme,
  validateTheme,
  parseThemeJson,
  getPreset,
  isPresetName,
  themeToJson,
  ThemeValidationError,
  MAX_THEME_JSON_BYTES,
} from './createTheme';
export { themeToCss, themeToStyle, colorVar, tokenVar, type ThemeToCssOptions } from './cssVars';
export {
  getThemeScript,
  getThemePreferencesFromCookie,
  readThemeCookie,
  parsePreferences,
  serializePreferences,
  sanitizePreferences,
  createLocalStorageAdapter,
  createCookieStorageAdapter,
  ThemePersistenceError,
  DEFAULT_STORAGE_KEY,
  type ThemePreferences,
  type ThemeStorage,
  type CookieStorageOptions,
  type ThemeScriptOptions,
} from './persistence';
export { contrastRatio, contrastLevel, relativeLuminance, hexToRgb } from './contrast';
export { isHexColor, normalizeHex } from './palette';
export {
  THEME_SCHEMA_VERSION,
  OVERRIDABLE_TOKENS,
  type ThemeMode,
  type ResolvedScheme,
  type ThemeInput,
  type ThemeSeeds,
  type Theme,
  type ThemeIssue,
  type ThemeIssueCode,
  type ThemeIssueParams,
  type ThemeValidationResult,
  type ValidateOptions,
  type OverridableToken,
  type ColorRole,
  type PresetName,
  type Density,
} from './types';
export {
  TOKEN_PREFIX,
  COLOR_ROLES,
  PRESET_NAMES,
  DEFAULT_PRESET,
  PRESET_META,
  PRESET_COLORS,
  FEEDBACK_SEEDS,
  CONTRAST_PAIRS,
  BASE_TOKENS,
  DENSITY_TOKENS,
  LOOK_TOKENS,
  LOOK_NAMES,
  DEFAULT_LOOK,
  GRADIENT_TOKENS,
  breakpoints,
  type Look,
} from '../tokens/generated';
