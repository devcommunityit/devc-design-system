import { createTheme, type Density, type Look, type OverridableToken, type Theme, type ThemeInput } from '@dev-community/ui/theme';
import type { DocsLang, Localized } from '../i18n/lang';

export interface Swatch {
  id: string;
  label: Localized;
  hex: string;
}

/** Accent seeds. Each one regenerates the brand tonal palette with the HCT algorithm used by `createTheme`. */
export const ACCENTS: readonly Swatch[] = [
  { id: 'grigio', label: { it: 'Grigio', en: 'Gray' }, hex: '#80838d' },
  { id: 'bronzo', label: { it: 'Bronzo', en: 'Bronze' }, hex: '#a18072' },
  { id: 'oro', label: { it: 'Oro', en: 'Gold' }, hex: '#978365' },
  { id: 'marrone', label: { it: 'Marrone', en: 'Brown' }, hex: '#ad7f58' },
  { id: 'giallo', label: { it: 'Giallo', en: 'Yellow' }, hex: '#e8c20a' },
  { id: 'ambra', label: { it: 'Ambra', en: 'Amber' }, hex: '#f0a020' },
  { id: 'arancio', label: { it: 'Arancio', en: 'Orange' }, hex: '#f76b15' },
  { id: 'pomodoro', label: { it: 'Pomodoro', en: 'Tomato' }, hex: '#e2553a' },
  { id: 'rosso', label: { it: 'Rosso', en: 'Red' }, hex: '#dc3545' },
  { id: 'rubino', label: { it: 'Rubino', en: 'Ruby' }, hex: '#d6336c' },
  { id: 'cremisi', label: { it: 'Cremisi', en: 'Crimson' }, hex: '#d63384' },
  { id: 'rosa', label: { it: 'Rosa', en: 'Pink' }, hex: '#e64ca4' },
  { id: 'prugna', label: { it: 'Prugna', en: 'Plum' }, hex: '#ab4aba' },
  { id: 'viola', label: { it: 'Viola', en: 'Purple' }, hex: '#8e4ec6' },
  { id: 'violetto', label: { it: 'Violetto', en: 'Violet' }, hex: '#6e56cf' },
  { id: 'iris', label: { it: 'Iris', en: 'Iris' }, hex: '#5b5bd6' },
  { id: 'indaco', label: { it: 'Indaco', en: 'Indigo' }, hex: '#3e63dd' },
  { id: 'blu', label: { it: 'Blu', en: 'Blue' }, hex: '#0b7ad1' },
  { id: 'ciano', label: { it: 'Ciano', en: 'Cyan' }, hex: '#0894b3' },
  { id: 'verde-acqua', label: { it: 'Verde acqua', en: 'Teal' }, hex: '#12a594' },
  { id: 'giada', label: { it: 'Giada', en: 'Jade' }, hex: '#29a383' },
  { id: 'verde', label: { it: 'Verde', en: 'Green' }, hex: '#30a46c' },
  { id: 'erba', label: { it: 'Erba', en: 'Grass' }, hex: '#46a758' },
  { id: 'lime', label: { it: 'Lime', en: 'Lime' }, hex: '#9ab51e' },
  { id: 'menta', label: { it: 'Menta', en: 'Mint' }, hex: '#3dbfa6' },
  { id: 'cielo', label: { it: 'Cielo', en: 'Sky' }, hex: '#3aa8d8' },
];

/** Neutral seeds. `auto` omits the seed so neutrals derive from the accent hue. */
export const GRAYS: readonly (Swatch & { seed: string | null })[] = [
  { id: 'auto', label: { it: 'Automatico (dall’accento)', en: 'Automatic (from accent)' }, hex: '#8b8d98', seed: null },
  { id: 'grigio', label: { it: 'Grigio puro', en: 'Pure gray' }, hex: '#8d8d8d', seed: '#8d8d8d' },
  { id: 'malva', label: { it: 'Malva', en: 'Mauve' }, hex: '#8e8c99', seed: '#8e8c99' },
  { id: 'ardesia', label: { it: 'Ardesia', en: 'Slate' }, hex: '#8b8d98', seed: '#8b8d98' },
  { id: 'salvia', label: { it: 'Salvia', en: 'Sage' }, hex: '#868e8b', seed: '#868e8b' },
  { id: 'oliva', label: { it: 'Oliva', en: 'Olive' }, hex: '#898e87', seed: '#898e87' },
  { id: 'sabbia', label: { it: 'Sabbia', en: 'Sand' }, hex: '#8f8d88', seed: '#8f8d88' },
];

export type RadiusPreset = 'none' | 'small' | 'medium' | 'large' | 'full';
export const RADIUS_PRESETS: readonly { id: RadiusPreset; label: Localized }[] = [
  { id: 'none', label: { it: 'Nessuno', en: 'None' } },
  { id: 'small', label: { it: 'Piccolo', en: 'Small' } },
  { id: 'medium', label: { it: 'Medio', en: 'Medium' } },
  { id: 'large', label: { it: 'Grande', en: 'Large' } },
  { id: 'full', label: { it: 'Massimo', en: 'Full' } },
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

export function toThemeInput(state: DesignerState, lang: DocsLang = 'it'): ThemeInput {
  const accent = findAccent(state.accent);
  const gray = findGray(state.gray);
  const tokens = RADIUS_TOKENS[state.radius];
  const input: ThemeInput = {
    schemaVersion: 1,
    name: `designer-${accent.id}`,
    label: `${accent.label[lang]}${gray.seed ? ` · ${gray.label[lang]}` : ''}`,
    seeds: gray.seed ? { brand: accent.hex, neutral: gray.seed } : { brand: accent.hex },
  };
  if (Object.keys(tokens).length > 0) input.tokens = { ...tokens };
  return input;
}

export function buildDesignerTheme(state: DesignerState, lang: DocsLang = 'it'): Theme {
  return createTheme(toThemeInput(state, lang));
}

const PANEL_COMMENT: Localized = {
  it: '/* Pannelli traslucidi: ricetta CSS opzionale, non è un token della libreria. */',
  en: '/* Translucent panels: optional CSS recipe, not a library token. */',
};

const PANEL_CSS = `.app-panel {
  background-color: color-mix(in srgb, var(--dc-color-surface-default) 72%, transparent);
  backdrop-filter: blur(16px) saturate(1.4);
}`;

/** Copyable TypeScript configuration. Scale and panel background are CSS recipes, not theme tokens. */
export function designerSnippet(state: DesignerState, lang: DocsLang = 'it'): string {
  const { schemaVersion: _version, ...rest } = toThemeInput(state, lang);
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
    notes.push(
      lang === 'en'
        ? `/* Scale ${state.scale}%: not a token. If needed, apply it to the app container: zoom: ${state.scale / 100}; */`
        : `/* Scala ${state.scale}%: non è un token. Se serve, applica al contenitore dell’app: zoom: ${state.scale / 100}; */`,
    );
  }
  if (state.panel === 'translucent') notes.push(`${PANEL_COMMENT[lang]}\n${PANEL_CSS}`);
  return `import { createTheme, ThemeProvider } from '@dev-community/ui';

export const theme = createTheme(${body});

// <ThemeProvider ${provider}>…</ThemeProvider>
${notes.length ? `\n${notes.join('\n\n')}\n` : ''}`;
}
