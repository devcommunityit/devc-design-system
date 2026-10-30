import { DENSITY_TOKENS, PRESET_NAMES, type Density } from '../tokens/generated';
import type { ThemeMode } from './types';

/** Stored theme preferences. Only names are stored, never theme definitions. */
export interface ThemePreferences {
  mode?: ThemeMode;
  density?: Density;
  /** Preset or custom theme name. Custom themes must be supplied again by the app. */
  theme?: string;
}

/** Minimal synchronous storage contract. Implementations may throw; errors are reported, not swallowed silently. */
export interface ThemeStorage {
  get(key: string): string | null;
  set(key: string, value: string): void;
  remove(key: string): void;
}

export class ThemePersistenceError extends Error {
  readonly operation: 'read' | 'write' | 'parse';
  override readonly cause: unknown;
  constructor(operation: 'read' | 'write' | 'parse', cause: unknown) {
    super(`Theme persistence ${operation} failed: ${cause instanceof Error ? cause.message : String(cause)}`);
    this.name = 'ThemePersistenceError';
    this.operation = operation;
    this.cause = cause;
  }
}

export const DEFAULT_STORAGE_KEY = 'dc-theme';
const MODES: readonly string[] = ['light', 'dark', 'system'];
const NAME_RE = /^[a-z][a-z0-9-]{0,47}$/;

/** Validates untrusted stored data. Unknown or invalid fields are dropped. */
export function sanitizePreferences(value: unknown): ThemePreferences {
  if (typeof value !== 'object' || value === null) return {};
  const v = value as Record<string, unknown>;
  const prefs: ThemePreferences = {};
  if (typeof v.mode === 'string' && MODES.includes(v.mode)) prefs.mode = v.mode as ThemeMode;
  if (typeof v.density === 'string' && v.density in DENSITY_TOKENS) prefs.density = v.density as Density;
  if (typeof v.theme === 'string' && NAME_RE.test(v.theme)) prefs.theme = v.theme;
  return prefs;
}

export function parsePreferences(raw: string | null | undefined): ThemePreferences {
  if (!raw) return {};
  return sanitizePreferences(JSON.parse(raw));
}

export function serializePreferences(prefs: ThemePreferences): string {
  return JSON.stringify(sanitizePreferences(prefs));
}

/** localStorage adapter; `window` is only touched when a method is called. */
export function createLocalStorageAdapter(): ThemeStorage {
  return {
    get: (key) => window.localStorage.getItem(key),
    set: (key, value) => window.localStorage.setItem(key, value),
    remove: (key) => window.localStorage.removeItem(key),
  };
}

export interface CookieStorageOptions {
  path?: string;
  /** Seconds. Default: one year. */
  maxAge?: number;
  sameSite?: 'Lax' | 'Strict' | 'None';
  secure?: boolean;
  domain?: string;
}

/**
 * Cookie adapter. Lets the server read preferences (see `readThemeCookie`) and render
 * the right attributes, avoiding theme flash and hydration mismatches with SSR.
 */
export function createCookieStorageAdapter(options: CookieStorageOptions = {}): ThemeStorage {
  const { path = '/', maxAge = 31536000, sameSite = 'Lax', secure, domain } = options;
  const attrs = (age: number) =>
    [`Path=${path}`, `Max-Age=${age}`, `SameSite=${sameSite}`, secure ? 'Secure' : '', domain ? `Domain=${domain}` : '']
      .filter(Boolean)
      .join('; ');
  return {
    get: (key) => readThemeCookie(document.cookie, key),
    set: (key, value) => {
      document.cookie = `${encodeURIComponent(key)}=${encodeURIComponent(value)}; ${attrs(maxAge)}`;
    },
    remove: (key) => {
      document.cookie = `${encodeURIComponent(key)}=; ${attrs(0)}`;
    },
  };
}

/** Reads the raw preferences cookie value from a Cookie header (server or client). */
export function readThemeCookie(cookieHeader: string | null | undefined, key = DEFAULT_STORAGE_KEY): string | null {
  if (!cookieHeader) return null;
  for (const part of cookieHeader.split(';')) {
    const idx = part.indexOf('=');
    if (idx < 0) continue;
    if (decodeURIComponent(part.slice(0, idx).trim()) === key) return decodeURIComponent(part.slice(idx + 1).trim());
  }
  return null;
}

/** Server helper: validated preferences from a Cookie header. Never throws. */
export function getThemePreferencesFromCookie(cookieHeader: string | null | undefined, key = DEFAULT_STORAGE_KEY): ThemePreferences {
  try {
    return parsePreferences(readThemeCookie(cookieHeader, key));
  } catch {
    return {};
  }
}

export interface ThemeScriptOptions {
  storageKey?: string;
  defaultMode?: ThemeMode;
  defaultTheme?: string;
  defaultDensity?: Density;
}

/**
 * Returns a small inline script that sets `data-dc-*` attributes on <html> from localStorage
 * before first paint (SPA / static sites). Insert it in <head> with a CSP nonce or hash.
 * The script contains only validated literals; it never evaluates stored data.
 */
export function getThemeScript(options: ThemeScriptOptions = {}): string {
  const { storageKey = DEFAULT_STORAGE_KEY, defaultMode = 'system', defaultTheme = PRESET_NAMES[0], defaultDensity = 'comfortable' } = options;
  const cfg = JSON.stringify({ k: storageKey, m: defaultMode, t: defaultTheme, d: defaultDensity, presets: PRESET_NAMES, densities: Object.keys(DENSITY_TOKENS) }).replace(/</g, '\\u003c');
  return `(function(){var c=${cfg};var e=document.documentElement;var p={};try{p=JSON.parse(localStorage.getItem(c.k)||'{}')||{}}catch(_){}var m=['light','dark','system'].indexOf(p.mode)>-1?p.mode:c.m;var t=c.presets.indexOf(p.theme)>-1?p.theme:c.t;var d=c.densities.indexOf(p.density)>-1?p.density:c.d;e.setAttribute('data-dc-theme','');e.setAttribute('data-dc-scheme',m);e.setAttribute('data-dc-palette',t);e.setAttribute('data-dc-density',d);})();`;
}
