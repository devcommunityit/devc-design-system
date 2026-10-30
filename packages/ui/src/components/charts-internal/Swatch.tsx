import { useId } from 'react';
import { cx } from '../../utils';
import styles from './Chart.module.css';
import { markerPath, markerShape, patternFill, PatternDefs, seriesDash, seriesStyle, svgId } from './series';

export type SwatchKind = 'line' | 'fill';

export interface SwatchProps {
  /** 0-based series index (color, dash pattern, marker shape or texture). */
  index: number;
  kind?: SwatchKind;
  className?: string;
}

/** Decorative key of a series: line + marker for lines, textured square for bars/slices. */
export function Swatch({ index, kind = 'line', className }: SwatchProps) {
  const prefix = svgId(useId());
  const texture = patternFill(prefix, index);
  return (
    <svg aria-hidden="true" focusable="false" width={kind === 'line' ? 24 : 14} height={14} className={cx(styles.swatch, className)} style={seriesStyle(index)}>
      {kind === 'line' ? (
        <>
          <line x1={1} y1={7} x2={23} y2={7} className={styles.line} strokeDasharray={seriesDash(index)} />
          <path d={markerPath(markerShape(index), 12, 7, 3.5)} className={styles.marker} />
        </>
      ) : (
        <>
          {texture ? <PatternDefs prefix={prefix} indexes={[index]} className={styles.patternStroke} /> : null}
          <rect x={0.5} y={0.5} width={13} height={13} rx={2} className={styles.fill} />
          {texture ? <rect x={0.5} y={0.5} width={13} height={13} rx={2} fill={texture} className={styles.patternOverlay} /> : null}
        </>
      )}
    </svg>
  );
}
