import { createTheme, type Density, type Look, type OverridableToken, type Theme, type ThemeInput } from '@dev-community/ui/theme';

export interface Swatch {
  id: string;
  label: string;
  hex: string;
}

/** Accent seeds. Each one regenerates the brand tonal palette with the HCT algorithm used by `createTheme`. */
export const ACCENTS: readonly Swatch[] = [
  { id: 'grigio', label: 'Grigio', hex: '#80838d' },
  { id: 'bronzo', label: 'Bronzo', hex: '#a18072' },
  { id: 'oro', label: 'Oro', hex: '#978365' },
  { id: 'marrone', label: 'Marrone', hex: '#ad7f58' },
  { id: 'giallo', label: 'Giallo', hex: '#e8c20a' },
  { id: 'ambra', label: 'Ambra', hex: '#f0a020' },
  { id: 'arancio', label: 'Arancio', hex: '#f76b15' },
  { id: 'pomodoro', label: 'Pomodoro', hex: '#e2553a' },
  { id: 'rosso', label: 'Rosso', hex: '#dc3545' },
  { id: 'rubino', label: 'Rubino', hex: '#d6336c' },
  { id: 'cremisi', label: 'Cremisi', hex: '#d63384' },
  { id: 'rosa', label: 'Rosa', hex: '#e64ca4' },
  { id: 'prugna', label: 'Prugna', hex: '#ab4aba' },
  { id: 'viola', label: 'Viola', hex: '#8e4ec6' },
  { id: 'violetto', label: 'Violetto', hex: '#6e56cf' },
  { id: 'iris', label: 'Iris', hex: '#5b5bd6' },
  { id: 'indaco', label: 'Indaco', hex: '#3e63dd' },
  { id: 'blu', label: 'Blu', hex: '#0b7ad1' },
  { id: 'ciano', label: 'Ciano', hex: '#0894b3' },
  { id: 'verde-acqua', label: 'Verde acqua', hex: '#12a594' },
  { id: 'giada', label: 'Giada', hex: '#29a383' },
  { id: 'verde', label: 'Verde', hex: '#30a46c' },
  { id: 'erba', label: 'Erba', hex: '#46a758' },
  { id: 'lime', label: 'Lime', hex: '#9ab51e' },
  { id: 'menta', label: 'Menta', hex: '#3dbfa6' },
  { id: 'cielo', label: 'Cielo', hex: '#3aa8d8' },
];

/** Neutral seeds. `auto` omits the seed so neutrals derive from the accent hue. */
export const GRAYS: readonly (Swatch & { seed: string | null })[] = [
  { id: 'auto', label: 'Automatico (dall’accento)', hex: '#8b8d98', seed: null },
  { id: 'grigio', label: 'Grigio puro', hex: '#8d8d8d', seed: '#8d8d8d' },
  { id: 'malva', label: 'Malva', hex: '#8e8c99', seed: '#8e8c99' },
  { id: 'ardesia', label: 'Ardesia', hex: '#8b8d98', seed: '#8b8d98' },
  { id: 'salvia', label: 'Salvia', hex: '#868e8b', seed: '#868e8b' },
  { id: 'oliva', label: 'Oliva', hex: '#898e87', seed: '#898e87' },
  { id: 'sabbia', label: 'Sabbia', hex: '#8f8d88', seed: '#8f8d88' },
];

export type RadiusPreset = 'none' | 'small' | 'medium' | 'large' | 'full';
export const RADIUS_PRESETS: readonly { id: RadiusPreset; label: string }[] = [
  { id: 'none', label: 'Nessuno' },
  { id: 'small', label: 'Piccolo' },
  { id: 'medium', label: 'Medio' },
  { id: 'large', label: 'Grande' },
  { id: 'full', label: 'Massimo' },
];

type RadiusTokens = Partial<Record<OverridableToken, string>>;
const radius = (xs: string, sm: string, md: string, lg: string, xl: string): RadiusTokens => ({
  'radius.xs': xs,
  'radius.sm': sm,
  'radius.md': md,
  'radius.lg': lg,
  'radius.xl': xl,
});

/** `medium` keeps the library defaults; `radius.full` (pills, avatars) is never changed. */
export const RADIUS_TOKENS: Record<RadiusPreset, RadiusTokens> = {
  none: radius('0', '0', '0', '0', '0'),
  small: radius('2px', '4px', '6px', '8px', '12px'),
  medium: {},
  large: radius('6px', '10px', '14px', '20px', '28px'),
  full: radius('8px', '12px', '20px', '24px', '32px'),
};

export const SCALES = [90, 95, 100, 105, 110] as const;
export type Scale = (typeof SCALES)[number];

export type Appearance = 'light' | 'dark';
export type PanelBackground = 'solid' | 'translucent';

export interface DesignerState {
  accent: string;
  gray: string;
  appearance: Appearance;
  radius: RadiusPreset;
  scale: Scale;
  look: Look;
  density: Density;
  panel: PanelBackground;
}

export const INITIAL_STATE: DesignerState = {
  accent: 'pomodoro',
  gray: 'auto',
  appearance: 'light',
  radius: 'medium',
  scale: 100,
  look: 'standard',
  density: 'comfortable',
  panel: 'solid',
};

export const findAccent = (id: string): Swatch => ACCENTS.find((a) => a.id === id) ?? ACCENTS[7]!;
export const findGray = (id: string) => GRAYS.find((g) => g.id === id) ?? GRAYS[0]!;

export function toThemeInput(state: DesignerState): ThemeInput {
  const accent = findAccent(state.accent);
  const gray = findGray(state.gray);
  const tokens = RADIUS_TOKENS[state.radius];
  const input: ThemeInput = {
    schemaVersion: 1,
    name: `designer-${accent.id}`,
    label: `${accent.label}${gray.seed ? ` · ${gray.label}` : ''}`,
    seeds: gray.seed ? { brand: accent.hex, neutral: gray.seed } : { brand: accent.hex },
  };
  if (Object.keys(tokens).length > 0) input.tokens = { ...tokens };
  return input;
}

export function buildDesignerTheme(state: DesignerState): Theme {
  return createTheme(toThemeInput(state));
}

const PANEL_CSS = `/* Pannelli traslucidi: ricetta CSS opzionale, non è un token della libreria. */
.app-panel {
  background-color: color-mix(in srgb, var(--dc-color-surface-default) 72%, transparent);
  backdrop-filter: blur(16px) saturate(1.4);
}`;

/** Copyable TypeScript configuration. Scale and panel background are CSS recipes, not theme tokens. */
export function designerSnippet(state: DesignerState): string {
  const { schemaVersion: _version, ...rest } = toThemeInput(state);
  void _version;
  const body = JSON.stringify(rest, null, 2).replace(/"([A-Za-z_$][\w$]*)":/g, '$1:');
  const provider = [
    'theme={theme}',
    `defaultMode="${state.appearance}"`,
    state.look !== 'standard' ? `look="${state.look}"` : null,
    state.density !== 'comfortable' ? `density="${state.density}"` : null,
  ]
    .filter(Boolean)
    .join(' ');
  const notes: string[] = [];
  if (state.scale !== 100) {
    notes.push(`/* Scala ${state.scale}%: non è un token. Se serve, applica al contenitore dell’app: zoom: ${state.scale / 100}; */`);
  }
  if (state.panel === 'translucent') notes.push(PANEL_CSS);
  return `import { createTheme, ThemeProvider } from '@dev-community/ui';

export const theme = createTheme(${body});

// <ThemeProvider ${provider}>…</ThemeProvider>
${notes.length ? `\n${notes.join('\n\n')}\n` : ''}`;
}
