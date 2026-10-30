/** SVG path builders for the charts (internal). */

export type Point = readonly [number, number];

/** Splits a series into contiguous runs of points; `null` values break the line (gaps). */
export function segments(data: ReadonlyArray<number | null | undefined>, xAt: (i: number) => number, yAt: (v: number) => number): Point[][] {
  const runs: Point[][] = [];
  let current: Point[] = [];
  data.forEach((value, i) => {
    if (typeof value === 'number' && Number.isFinite(value)) {
      current.push([xAt(i), yAt(value)]);
    } else if (current.length) {
      runs.push(current);
      current = [];
    }
  });
  if (current.length) runs.push(current);
  return runs;
}

const r = (n: number) => Math.round(n * 100) / 100;

/** Straight polyline through each run (no curve interpolation). */
export function linePath(runs: readonly Point[][]): string {
  return runs
    .filter((run) => run.length > 1)
    .map((run) => run.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${r(x)},${r(y)}`).join(''))
    .join('');
}

/** Closed areas between each run and the baseline `baseY`. */
export function areaPath(runs: readonly Point[][], baseY: number): string {
  return runs
    .filter((run) => run.length > 1)
    .map((run) => {
      const first = run[0];
      const last = run[run.length - 1];
      if (!first || !last) return '';
      const top = run.map(([x, y]) => `L${r(x)},${r(y)}`).join('');
      return `M${r(first[0])},${r(baseY)}${top}L${r(last[0])},${r(baseY)}Z`;
    })
    .join('');
}

function polar(cx: number, cy: number, radius: number, angle: number): string {
  return `${r(cx + radius * Math.cos(angle))},${r(cy + radius * Math.sin(angle))}`;
}

function sector(cx: number, cy: number, inner: number, outer: number, a0: number, a1: number): string {
  const large = a1 - a0 > Math.PI ? 1 : 0;
  return (
    `M${polar(cx, cy, outer, a0)}A${r(outer)},${r(outer)} 0 ${large} 1 ${polar(cx, cy, outer, a1)}` +
    `L${polar(cx, cy, inner, a1)}A${r(inner)},${r(inner)} 0 ${large} 0 ${polar(cx, cy, inner, a0)}Z`
  );
}

/** Ring sector from angle a0 to a1 (radians, clockwise from 3 o'clock). A full turn draws a full ring. */
export function arcPath(cx: number, cy: number, inner: number, outer: number, a0: number, a1: number): string {
  if (a1 - a0 >= Math.PI * 2 - 1e-6) {
    return sector(cx, cy, inner, outer, a0, a0 + Math.PI) + sector(cx, cy, inner, outer, a0 + Math.PI, a0 + Math.PI * 2);
  }
  return sector(cx, cy, inner, outer, a0, a1);
}
