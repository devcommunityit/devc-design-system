import { type CSSProperties } from 'react';
import type { CSSVariables } from '../../utils';

/** A data series shared by LineChart and BarChart. `null` values are gaps (no point/bar). */
export interface ChartSeries {
  /** Stable id, used for legend toggling (`hiddenSeries`). */
  id: string;
  /** Visible name (legend, readout, data table). */
  label: string;
  /** One value per category, in the same order as `categories`. */
  data: Array<number | null>;
}

/** Number of categorical data colors in the theme (`--dc-color-data-1` … `-6`). */
export const DATA_COLOR_COUNT = 6;

function wrapIndex(index: number, size: number): number {
  return ((Math.trunc(index) % size) + size) % size;
}

/** `var(--dc-color-data-N)` for a 0-based series index, cycling through the 6 data roles. */
export function seriesColor(index: number): string {
  return `var(--dc-color-data-${wrapIndex(index, DATA_COLOR_COUNT) + 1})`;
}

/** Inline style exposing the series color as `--_series` (CSS can override it, e.g. in forced colors). */
export function seriesStyle(index: number, paint?: SeriesPaint): CSSProperties {
  const style: CSSVariables = { '--_series': seriesColor(index) };
  if (paint?.fill) style['--_paint'] = `url(#${paint.fill})`;
  if (paint?.area) style['--_area'] = `url(#${paint.area})`;
  return style;
}

/** Gradient ids used by the vivid appearance (`--_paint` for fills, `--_area` for areas). */
export interface SeriesPaint {
  fill?: string;
  area?: string;
}

export type GradientKind = 'fill' | 'area';
export type GradientDirection = 'vertical' | 'horizontal' | 'diagonal';

/** Id of the gradient of a series index, defined by `GradientDefs`. */
export function gradientId(prefix: string, kind: GradientKind, index: number): string {
  return `${prefix}-${kind === 'area' ? 'a' : 'g'}${wrapIndex(index, DATA_COLOR_COUNT)}`;
}

/** `seriesStyle` with the gradients of `GradientDefs` (only painted in the vivid appearance). */
export function vividSeriesStyle(prefix: string, index: number, kinds: readonly GradientKind[] = ['fill']): CSSProperties {
  return seriesStyle(index, {
    fill: kinds.includes('fill') ? gradientId(prefix, 'fill', index) : undefined,
    area: kinds.includes('area') ? gradientId(prefix, 'area', index) : undefined,
  });
}

export interface GradientDefsProps {
  prefix: string;
  /** Series indexes that need a gradient. */
  indexes: readonly number[];
  kind?: GradientKind;
  /**
   * `vertical`: bright at the top (columns, areas); `horizontal`: bright at the end (bars, rings);
   * `diagonal`: slices. @default 'vertical'
   */
  direction?: GradientDirection;
  /** Class names of the two stops (from Chart.module.css): base color and vivid end. */
  stopBaseClassName?: string;
  stopVividClassName?: string;
}

const DIRECTION: Record<GradientDirection, { x2: number; y2: number; reverse: boolean }> = {
  vertical: { x2: 0, y2: 1, reverse: true },
  horizontal: { x2: 1, y2: 0, reverse: false },
  diagonal: { x2: 1, y2: 1, reverse: true },
};

/**
 * One linear gradient per series index, from the data color to a mix with the accent color
 * (same lightness, so the contrast with the surface is kept). Stops read `--_series` from the
 * inline style of each gradient.
 */
export function GradientDefs({ prefix, indexes, kind = 'fill', direction = 'vertical', stopBaseClassName, stopVividClassName }: GradientDefsProps) {
  const { x2, y2, reverse } = DIRECTION[direction];
  const unique = [...new Set(indexes.map((i) => wrapIndex(i, DATA_COLOR_COUNT)))];
  return (
    <defs>
      {unique.map((i) => (
        <linearGradient key={i} id={gradientId(prefix, kind, i)} x1={0} y1={0} x2={x2} y2={y2} style={seriesStyle(i)}>
          <stop offset="0%" className={reverse ? stopVividClassName : stopBaseClassName} />
          <stop offset="100%" className={reverse ? stopBaseClassName : stopVividClassName} />
        </linearGradient>
      ))}
    </defs>
  );
}

const DASHES: ReadonlyArray<string | undefined> = [undefined, '6 4', '2 3', '10 4 2 4', '1 5', '12 6'];

/** stroke-dasharray per series index so lines differ without relying on color. */
export function seriesDash(index: number): string | undefined {
  return DASHES[wrapIndex(index, DASHES.length)];
}

export type MarkerShape = 'circle' | 'square' | 'triangle' | 'diamond';
const SHAPES: readonly MarkerShape[] = ['circle', 'square', 'triangle', 'diamond'];

export function markerShape(index: number): MarkerShape {
  return SHAPES[wrapIndex(index, SHAPES.length)] ?? 'circle';
}

/** SVG path data for a marker of radius `r` centered on (x, y). */
export function markerPath(shape: MarkerShape, x: number, y: number, r: number): string {
  switch (shape) {
    case 'square':
      return `M${x - r * 0.9},${y - r * 0.9}h${r * 1.8}v${r * 1.8}h${-r * 1.8}Z`;
    case 'triangle':
      return `M${x},${y - r * 1.15}L${x + r * 1.1},${y + r * 0.85}L${x - r * 1.1},${y + r * 0.85}Z`;
    case 'diamond':
      return `M${x},${y - r * 1.25}L${x + r * 1.25},${y}L${x},${y + r * 1.25}L${x - r * 1.25},${y}Z`;
    default:
      return `M${x - r},${y}a${r},${r} 0 1,0 ${r * 2},0a${r},${r} 0 1,0 ${-r * 2},0Z`;
  }
}

const PATTERNS: readonly string[] = [
  '',
  'M-1,1l2,-2M0,6l6,-6M5,7l2,-2',
  'M2.5,3a0.5,0.5 0 1,0 1,0a0.5,0.5 0 1,0 -1,0',
  'M0,3h6',
  'M-1,1l2,-2M0,6l6,-6M5,7l2,-2M-1,5l2,2M0,0l6,6M5,-1l2,2',
  'M3,0v6',
];

/** Makes a `useId` value safe inside `url(#…)` references. */
export function svgId(id: string): string {
  return id.replace(/[^a-zA-Z0-9_-]/g, '');
}

/** `url(#…)` of the texture for a series index; undefined for the first series (plain fill). */
export function patternFill(prefix: string, index: number): string | undefined {
  const i = wrapIndex(index, PATTERNS.length);
  return i === 0 ? undefined : `url(#${prefix}-p${i})`;
}

export interface PatternDefsProps {
  prefix: string;
  className?: string;
  /** Only define the texture of these series indexes (default: all). */
  indexes?: readonly number[];
}

/** `<defs>` with one 6×6 texture per series index (hatching, dots…), so fills differ without color. */
export function PatternDefs({ prefix, className, indexes }: PatternDefsProps) {
  const wanted = indexes ? new Set(indexes.map((i) => wrapIndex(i, PATTERNS.length))) : null;
  return (
    <defs>
      {PATTERNS.map((d, i) =>
        i === 0 || (wanted && !wanted.has(i)) ? null : (
          <pattern key={i} id={`${prefix}-p${i}`} width={6} height={6} patternUnits="userSpaceOnUse">
            <path d={d} className={className} />
          </pattern>
        ),
      )}
    </defs>
  );
}
