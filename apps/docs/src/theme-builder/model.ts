import {
  COLOR_ROLES,
  CONTRAST_PAIRS,
  FEEDBACK_SEEDS,
  PRESET_META,
  THEME_SCHEMA_VERSION,
  contrastLevel,
  contrastRatio,
  getPreset,
  validateTheme,
  type ColorRole,
  type PresetName,
  type Theme,
  type ThemeInput,
  type ThemeIssue,
  type ThemeSeeds,
} from '@devcommunityit/ui/theme';
import type { DocsLang, Localized } from '../i18n/lang';

export type Scheme = 'light' | 'dark';
export type SeedKey = keyof ThemeSeeds;

export const SEED_KEYS: Array<{ key: SeedKey; label: Localized; help: Localized }> = [
  {
    key: 'brand',
    label: { it: 'Brand', en: 'Brand' },
    help: { it: 'Genera azioni primarie, link, focus e superfici brand.', en: 'Drives primary actions, links, focus and brand surfaces.' },
  },
  {
    key: 'tertiary',
    label: { it: 'Terziario', en: 'Tertiary' },
    help: {
      it: 'Secondo accento (Material tertiary): ruoli accent.* e gradienti bicolore. Se assente deriva dal preset o dal brand ruotato di 60°.',
      en: 'Second accent (Material tertiary): accent.* roles and two-tone gradients. If omitted it comes from the preset or from the brand rotated by 60°.',
    },
  },
  {
    key: 'neutral',
    label: { it: 'Neutro', en: 'Neutral' },
    help: { it: 'Testi, superfici e bordi. Se assente deriva dal brand con croma bassa.', en: 'Text, surfaces and borders. If omitted it derives from the brand with low chroma.' },
  },
  { key: 'danger', label: { it: 'Errore', en: 'Error' }, help: { it: 'Feedback di errore e azioni distruttive.', en: 'Error feedback and destructive actions.' } },
  { key: 'warning', label: { it: 'Avviso', en: 'Warning' }, help: { it: 'Feedback di attenzione.', en: 'Warning feedback.' } },
  { key: 'success', label: { it: 'Successo', en: 'Success' }, help: { it: 'Feedback di conferma.', en: 'Confirmation feedback.' } },
  { key: 'info', label: { it: 'Informazione', en: 'Information' }, help: { it: 'Feedback informativi.', en: 'Informational feedback.' } },
];

export interface RoleGroup {
  id: string;
  label: Localized;
  roles: ColorRole[];
}

const byPrefix = (prefix: string) => COLOR_ROLES.filter((r) => r.startsWith(prefix));

export const ROLE_GROUPS: RoleGroup[] = [
  { id: 'brand', label: { it: 'Brand e azioni', en: 'Brand and actions' }, roles: [...byPrefix('action.'), 'surface.brand', 'focus.ring'] },
  { id: 'accent', label: { it: 'Accento terziario', en: 'Tertiary accent' }, roles: byPrefix('accent.') },
  { id: 'text', label: { it: 'Testo', en: 'Text' }, roles: byPrefix('text.') },
  { id: 'surface', label: { it: 'Superfici', en: 'Surfaces' }, roles: byPrefix('surface.').filter((r) => r !== 'surface.brand') },
  { id: 'border', label: { it: 'Bordi', en: 'Borders' }, roles: byPrefix('border.') },
  { id: 'feedback', label: { it: 'Feedback', en: 'Feedback' }, roles: byPrefix('feedback.') },
  { id: 'data', label: { it: 'Dati e grafici', en: 'Data and charts' }, roles: byPrefix('data.') },
];

export interface BuilderState {
  name: string;
  label: string;
  base: PresetName;
  /** Only seeds explicitly changed by the user (others come from the base preset). */
  seeds: ThemeSeeds;
  overrides: Record<Scheme, Partial<Record<ColorRole, string>>>;
}

const DEFAULT_THEME: Localized<{ name: string; label: string }> = {
  it: { name: 'mio-tema', label: 'Il mio tema' },
  en: { name: 'my-theme', label: 'My theme' },
};

export function initialState(base: PresetName, lang: DocsLang = 'it'): BuilderState {
  return { ...DEFAULT_THEME[lang], base, seeds: {}, overrides: { light: {}, dark: {} } };
}

/** Seed value shown in the editor: explicit seed, else the preset default. */
export function seedValue(state: BuilderState, key: SeedKey): string | undefined {
  const explicit = state.seeds[key];
  if (explicit) return explicit;
  if (key === 'brand') return PRESET_META[state.base].brand;
  if (key === 'neutral') return undefined;
  if (key === 'tertiary') return state.seeds.brand ? undefined : PRESET_META[state.base].tertiary;
  return FEEDBACK_SEEDS[key];
}

export function toInput(state: BuilderState): ThemeInput {
  const input: ThemeInput = { schemaVersion: THEME_SCHEMA_VERSION, name: state.name, label: state.label, extends: state.base };
  if (Object.keys(state.seeds).length > 0) input.seeds = { ...state.seeds };
  const light = state.overrides.light;
  const dark = state.overrides.dark;
  if (Object.keys(light).length > 0 || Object.keys(dark).length > 0) {
    input.colors = {};
    if (Object.keys(light).length > 0) input.colors.light = { ...light };
    if (Object.keys(dark).length > 0) input.colors.dark = { ...dark };
  }
  return input;
}

/** Inverse of `toInput` for imported JSON (already validated). */
export function fromTheme(theme: Theme): BuilderState {
  const input = theme.input;
  return {
    name: input.name,
    label: input.label ?? input.name,
    base: input.extends ?? theme.extends,
    seeds: { ...input.seeds },
    overrides: { light: { ...input.colors?.light }, dark: { ...input.colors?.dark } },
  };
}

export type BuildResult = { ok: true; theme: Theme; warnings: ThemeIssue[] } | { ok: false; issues: ThemeIssue[]; fallback: Theme };

export function buildTheme(state: BuilderState): BuildResult {
  const result = validateTheme(toInput(state));
  if (result.success) return { ok: true, theme: result.theme, warnings: result.warnings };
  return { ok: false, issues: result.issues, fallback: getPreset(state.base) };
}

type ContrastLevel = ReturnType<typeof contrastLevel>;

export interface ContrastRow {
  fg: ColorRole;
  bg: ColorRole;
  min: number;
  ratio: number | null;
  level: ContrastLevel | 'unknown';
  pass: boolean;
}

export function contrastReport(theme: Theme, scheme: Scheme): ContrastRow[] {
  const colors = theme.colors[scheme];
  return CONTRAST_PAIRS.map(([fg, bg, min]) => {
    const ratio = contrastRatio(colors[fg], colors[bg]);
    return { fg, bg, min, ratio, level: ratio === null ? 'unknown' : contrastLevel(ratio), pass: ratio !== null && ratio >= min };
  });
}

export function typeScriptSnippet(input: ThemeInput): string {
  const { schemaVersion: _version, ...rest } = input;
  void _version;
  const body = JSON.stringify(rest, null, 2).replace(/"([A-Za-z_$][\w$]*)":/g, '$1:');
  return `import { createTheme, ThemeProvider } from '@devcommunityit/ui';

export const ${toIdentifier(input.name)} = createTheme(${body});

// <ThemeProvider theme={${toIdentifier(input.name)}} defaultMode="system">…</ThemeProvider>
`;
}

function toIdentifier(name: string): string {
  const camel = name.replace(/-([a-z0-9])/g, (_m, c: string) => c.toUpperCase());
  return /^[a-z]/.test(camel) ? `${camel}Theme` : `theme${camel}`;
}

/** Triggers a client-side download of generated text (no network involved). */
export function downloadText(fileName: string, text: string, type: string) {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.append(a);
  a.click();
  a.remove();
  // Revoke after the click has been processed.
  setTimeout(() => URL.revokeObjectURL(url), 0);
}