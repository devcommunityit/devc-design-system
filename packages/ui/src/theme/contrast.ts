/** WCAG 2.x relative luminance and contrast ratio for sRGB hex colors. */

function channel(c: number): number {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

export function hexToRgb(hex: string): [number, number, number] | null {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim());
  if (!m || !m[1]) return null;
  let h = m[1];
  if (h.length === 3) h = h.split('').map((x) => x + x).join('');
  const n = Number.parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function relativeLuminance(hex: string): number | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  const [r, g, b] = rgb;
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/** Returns the WCAG contrast ratio (1–21) or null if a color cannot be parsed. */
export function contrastRatio(foreground: string, background: string): number | null {
  const l1 = relativeLuminance(foreground);
  const l2 = relativeLuminance(background);
  if (l1 === null || l2 === null) return null;
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

export type ContrastLevel = 'AAA' | 'AA' | 'AA-large' | 'fail';

/** Classifies a text contrast ratio. `AA-large` means only large text (≥ 24px or 18.66px bold) passes. */
export function contrastLevel(ratio: number): ContrastLevel {
  if (ratio >= 7) return 'AAA';
  if (ratio >= 4.5) return 'AA';
  if (ratio >= 3) return 'AA-large';
  return 'fail';
}
