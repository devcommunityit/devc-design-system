import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx, useControllableState } from '../../utils';
import { Swatch, type SwatchKind } from '../charts-internal/Swatch';
import styles from './ChartLegend.module.css';

export interface ChartLegendItem {
  id: string;
  label: ReactNode;
  /** 0-based series index: picks `--dc-color-data-N` (cycling 1–6), dash pattern, marker shape and texture. */
  colorIndex: number;
  /** Optional value shown after the label (e.g. "1.240 · 32%"). */
  value?: ReactNode;
}

const NO_IDS: string[] = [];

export interface ChartLegendProps extends HTMLAttributes<HTMLUListElement> {
  items: ChartLegendItem[];
  /** Key style: line + marker (line charts) or textured square (bars, slices). @default 'line' */
  swatch?: SwatchKind;
  /** Render each item as a toggle button (aria-pressed = visible) that hides/shows its series. */
  isToggleable?: boolean;
  /** Hidden item ids (controlled). */
  hiddenItems?: string[];
  /** Initially hidden item ids (uncontrolled). @default [] */
  defaultHiddenItems?: string[];
  onHiddenItemsChange?: (hiddenItems: string[]) => void;
}

/** Legend for the charts. Series are told apart by color, dash pattern/marker shape or texture. */
export const ChartLegend = forwardRef<HTMLUListElement, ChartLegendProps>(function ChartLegend(
  { items, swatch = 'line', isToggleable = false, hiddenItems, defaultHiddenItems = NO_IDS, onHiddenItemsChange, className, ...rest },
  ref,
) {
  const [hidden, setHidden] = useControllableState(hiddenItems, defaultHiddenItems, onHiddenItemsChange, 'hiddenItems');
  const toggle = (id: string) => setHidden(hidden.includes(id) ? hidden.filter((h) => h !== id) : [...hidden, id]);
  return (
    <ul ref={ref} className={cx(styles.legend, className)} data-toggleable={isToggleable || undefined} {...rest}>
      {items.map((item) => {
        const isHidden = hidden.includes(item.id);
        const content = (
          <>
            <Swatch index={item.colorIndex} kind={swatch} />
            <span className={styles.label}>{item.label}</span>
            {item.value !== undefined && item.value !== null ? <span className={styles.value}>{item.value}</span> : null}
          </>
        );
        return (
          <li key={item.id} className={styles.item} data-hidden={isHidden || undefined}>
            {isToggleable ? (
              <button type="button" className={styles.button} aria-pressed={!isHidden} onClick={() => toggle(item.id)}>
                {content}
              </button>
            ) : (
              <span className={styles.static}>{content}</span>
            )}
          </li>
        );
      })}
    </ul>
  );
});
