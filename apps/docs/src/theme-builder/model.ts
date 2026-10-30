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
} from '@dev-community/ui/theme';

export type Scheme = 'light' | 'dark';
export type SeedKey = keyof ThemeSeeds;

export const SEED_KEYS: Array<{ key: SeedKey; label: string; help: string }> = [
  { key: 'brand', label: 'Brand', help: 'Genera azioni primarie, link, focus e superfici brand.' },
  { key: 'tertiary', label: 'Terziario', help: 'Secondo accento (Material tertiary): ruoli accent.* e gradienti bicolore. Se assente deriva dal preset o dal brand ruotato di 60°.' },
  { key: 'neutral', label: 'Neutro', help: 'Testi, superfici e bordi. Se assente deriva dal brand con croma bassa.' },
  { key: 'danger', label: 'Errore', help: 'Feedback di errore e azioni distruttive.' },
  { key: 'warning', label: 'Avviso', help: 'Feedback di attenzione.' },
  { key: 'success', label: 'Successo', help: 'Feedback di conferma.' },
  { key: 'info', label: 'Informazione', help: 'Feedback informativi.' },
];

export interface RoleGroup {
  id: string;
  label: string;
  roles: ColorRole[];
}

const byPrefix = (prefix: string) => COLOR_ROLES.filter((r) => r.startsWith(prefix));

export const ROLE_GROUPS: RoleGroup[] = [
  { id: 'brand', label: 'Brand e azioni', roles: [...byPrefix('action.'), 'surface.brand', 'focus.ring'] },
  { id: 'accent', label: 'Accento terziario', roles: byPrefix('accent.') },
  { id: 'text', label: 'Testo', roles: byPrefix('text.') },
  { id: 'surface', label: 'Superfici', roles: byPrefix('surface.').filter((r) => r !== 'surface.brand') },
  { id: 'border', label: 'Bordi', roles: byPrefix('border.') },
  { id: 'feedback', label: 'Feedback', roles: byPrefix('feedback.') },
];

export interface BuilderState {
  name: string;
  label: string;
  base: PresetName;
  /** Only seeds explicitly changed by the user (others come from the base preset). */
  seeds: ThemeSeeds;
  overrides: Record<Scheme, Partial<Record<ColorRole, string>>>;
}

export function initialState(base: PresetName): BuilderState {
  return { name: 'mio-tema', label: 'Il mio tema', base, seeds: {}, overrides: { light: {}, dark: {} } };
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
  return `import { createTheme, ThemeProvider } from '@dev-community/ui';

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