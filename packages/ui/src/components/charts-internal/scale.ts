/** Linear scales and "nice" axis ticks for the SVG charts (internal, not exported publicly). */

export interface NiceDomain {
  min: number;
  max: number;
  step: number;
  ticks: number[];
}

/** Rounds `range` to 1, 2, 5 or 10 × 10^n (Heckbert's "nice numbers"). */
export function niceNumber(range: number, round: boolean): number {
  if (range <= 0 || !Number.isFinite(range)) return 1;
  const exponent = Math.floor(Math.log10(range));
  const fraction = range / 10 ** exponent;
  let nice: number;
  if (round) nice = fraction < 1.5 ? 1 : fraction < 3 ? 2 : fraction < 7 ? 5 : 10;
  else nice = fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 5 ? 5 : 10;
  return nice * 10 ** exponent;
}

function decimalsOf(step: number): number {
  return Math.max(0, -Math.floor(Math.log10(step)));
}

/**
 * Expands [min, max] to round boundaries and returns about `count` evenly spaced ticks.
 * Equal or non-finite bounds still produce a usable domain.
 */
export function niceTicks(min: number, max: number, count = 5): NiceDomain {
  let lo = Number.isFinite(min) ? min : 0;
  let hi = Number.isFinite(max) ? max : 1;
  if (lo > hi) [lo, hi] = [hi, lo];
  if (lo === hi) {
    const original = lo;
    const pad = Math.abs(lo) * 0.1 || 1;
    lo -= pad;
    hi += pad;
    if (original >= 0 && lo < 0) lo = 0;
  }
  const range = niceNumber(hi - lo, false);
  const step = niceNumber(range / Math.max(1, count - 1), true);
  const decimals = decimalsOf(step);
  const niceMin = Number((Math.floor(lo / step) * step).toFixed(decimals));
  const niceMax = Number((Math.ceil(hi / step) * step).toFixed(decimals));
  const ticks: number[] = [];
  for (let i = 0; niceMin + i * step <= niceMax + step / 2; i++) ticks.push(Number((niceMin + i * step).toFixed(decimals)));
  return { min: niceMin, max: niceMax, step, ticks };
}

/** Maps a value from `domain` to `range` linearly. A zero-width domain maps to the range start. */
export function scaleLinear(domain: readonly [number, number], range: readonly [number, number]): (value: number) => number {
  const [d0, d1] = domain;
  const [r0, r1] = range;
  const span = d1 - d0;
  return (value) => (span === 0 ? r0 : r0 + ((value - d0) / span) * (r1 - r0));
}

/** Rough text width in px for SVG layout (no DOM measuring, SSR-safe). */
export function estimateTextWidth(text: string, fontSize = 12): number {
  return Math.ceil(text.length * fontSize * 0.6);
}

/** Smallest and largest finite values (ignores null); falls back to [0, 0]. */
export function extent(values: ReadonlyArray<number | null | undefined>): [number, number] {
  let lo = Infinity;
  let hi = -Infinity;
  for (const v of values) {
    if (typeof v !== 'number' || !Number.isFinite(v)) continue;
    if (v < lo) lo = v;
    if (v > hi) hi = v;
  }
  return lo === Infinity ? [0, 0] : [lo, hi];
}
