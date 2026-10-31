import { Hct, TonalPalette, argbFromHex, hexFromArgb } from '@material/material-color-utilities';

/**
 * Palette generation shared by the token build script and the runtime `createTheme`.
 * Uses HCT tonal palettes (Material Color Utilities): "tone" equals CIELAB L*,
 * so tone distance predicts contrast consistently across hues.
 * This file must only use erasable TypeScript syntax (it is executed by Node type stripping).
 */

export type PaletteName =
  | 'brand'
  | 'tertiary'
  | 'neutral'
  | 'neutral-variant'
  | 'danger'
  | 'warning'
  | 'success'
  | 'info'
  | 'data-2'
  | 'data-3'
  | 'data-4'
  | 'data-5'
  | 'data-6';

export const PALETTE_NAMES: readonly PaletteName[] = [
  'brand',
  'tertiary',
  'neutral',
  'neutral-variant',
  'danger',
  'warning',
  'success',
  'info',
  'data-2',
  'data-3',
  'data-4',
  'data-5',
  'data-6',
];

export interface PaletteRules {
  brand: { minChroma: number; maxChroma: number };
  /** Second accent hue (Material "tertiary"): brand hue rotated by `hueShift` degrees unless seeded. */
  tertiary: { hueShift: number; minChroma: number; maxChroma: number };
  neutral: { chromaFactor: number; maxChroma: number };
  'neutral-variant': { chromaFactor: number; maxChroma: number };
  /**
   * Categorical data-visualization hues: series 1 and 2 reuse brand and tertiary, series 3-6 rotate
   * the brand hue by `hueShifts` with a fixed chroma so every series has a similar visual weight.
   */
  data: { hueShifts: readonly [number, number, number, number]; chroma: number };
}

export interface PaletteSeeds {
  brand: string;
  /** Optional seed for the second accent; defaults to the brand hue rotated by `rules.tertiary.hueShift`. */
  tertiary?: string;
  danger: string;
  warning: string;
  success: string;
  info: string;
  /** Optional seed for neutrals; defaults to a low-chroma version of the brand hue. */
  neutral?: string;
}

export interface RoleSpec {
  palette: PaletteName;
  light: number;
  dark: number;
}

export type Scheme = 'light' | 'dark';

export type TonalPalettes = Record<PaletteName, (tone: number) => string>;

/** Minimum HCT hue distance between chart series 1 (brand) and 2 (tertiary). */
const MIN_DATA_HUE_DISTANCE = 30;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const HEX_RE = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;

export function isHexColor(value: string): boolean {
  return HEX_RE.test(value);
}

export function normalizeHex(value: string): string {
  const v = value.trim().toLowerCase();
  if (!HEX_RE.test(v)) throw new Error(`Invalid hex color: ${value}`);
  if (v.length === 4) {
    return `#${v[1]}${v[1]}${v[2]}${v[2]}${v[3]}${v[3]}`;
  }
  return v;
}

function paletteFromHex(hex: string, chroma?: (c: number) => number): TonalPalette {
  const hct = Hct.fromInt(argbFromHex(normalizeHex(hex)));
  const c = chroma ? chroma(hct.chroma) : hct.chroma;
  return TonalPalette.fromHueAndChroma(hct.hue, c);
}

export function createTonalPalettes(seeds: PaletteSeeds, rules: PaletteRules): TonalPalettes {
  const brand = paletteFromHex(seeds.brand, (c) => clamp(c, rules.brand.minChroma, rules.brand.maxChroma));
  const neutralSeed = seeds.neutral ?? seeds.brand;
  const neutral = paletteFromHex(neutralSeed, (c) =>
    seeds.neutral ? Math.min(c, rules.neutral.maxChroma) : Math.min(c * rules.neutral.chromaFactor, rules.neutral.maxChroma),
  );
  const neutralVariant = paletteFromHex(neutralSeed, (c) =>
    seeds.neutral
      ? Math.min(c * 2, rules['neutral-variant'].maxChroma)
      : Math.min(c * rules['neutral-variant'].chromaFactor, rules['neutral-variant'].maxChroma),
  );
  const tertiaryChroma = (c: number) => clamp(c, rules.tertiary.minChroma, rules.tertiary.maxChroma);
  const tertiary = seeds.tertiary
    ? paletteFromHex(seeds.tertiary, tertiaryChroma)
    : TonalPalette.fromHueAndChroma((brand.hue + rules.tertiary.hueShift + 360) % 360, tertiaryChroma(brand.chroma));
  const fixed = (hex: string) => paletteFromHex(hex);
  // Series 2 follows the tertiary accent, unless it shares the brand hue (single-colour themes): then rotate it so charts stay distinguishable.
  const hueDistance = Math.abs(((tertiary.hue - brand.hue + 540) % 360) - 180);
  const data2 = hueDistance < MIN_DATA_HUE_DISTANCE
    ? TonalPalette.fromHueAndChroma((brand.hue + rules.tertiary.hueShift + 360) % 360, rules.data.chroma)
    : tertiary;
  const dataHue = (i: 0 | 1 | 2 | 3) => TonalPalette.fromHueAndChroma((brand.hue + rules.data.hueShifts[i] + 360) % 360, rules.data.chroma);
  const palettes: Record<PaletteName, TonalPalette> = {
    brand,
    tertiary,
    neutral,
    'neutral-variant': neutralVariant,
    danger: fixed(seeds.danger),
    warning: fixed(seeds.warning),
    success: fixed(seeds.success),
    info: fixed(seeds.info),
    'data-2': data2,
    'data-3': dataHue(0),
    'data-4': dataHue(1),
    'data-5': dataHue(2),
    'data-6': dataHue(3),
  };
  const result = {} as TonalPalettes;
  for (const name of PALETTE_NAMES) {
    const palette = palettes[name];
    result[name] = (tone: number) => hexFromArgb(palette.tone(clamp(Math.round(tone), 0, 100)));
  }
  return result;
}

export function resolveRoles<R extends string>(
  palettes: TonalPalettes,
  roles: Record<R, RoleSpec>,
  scheme: Scheme,
): Record<R, string> {
  const out = {} as Record<R, string>;
  for (const role of Object.keys(roles) as R[]) {
    const spec = roles[role];
    out[role] = palettes[spec.palette](spec[scheme]);
  }
  return out;
}

/** Standard tones exported as primitive swatches; role tones are added by the generator. */
export const STANDARD_TONES: readonly number[] = [0, 5, 10, 15, 20, 25, 30, 35, 40, 50, 60, 70, 80, 90, 95, 98, 99, 100];
