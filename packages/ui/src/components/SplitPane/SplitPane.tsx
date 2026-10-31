import { forwardRef, useId, useRef, type CSSProperties, type HTMLAttributes, type KeyboardEvent as ReactKeyboardEvent, type PointerEvent, type ReactNode } from 'react';
import { useMessages } from '../../i18n/LocaleProvider';
import { useControllableState } from '../../utils';
import styles from './SplitPane.module.css';

/* eslint-disable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex -- role=separator implements the keyboard-operable splitter pattern. */

type SplitPaneStyle = CSSProperties & { '--dc-split-size': string };
type DragStart = { coordinate: number; size: number };

export interface SplitPaneProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  primary: ReactNode;
  secondary: ReactNode;
  orientation?: 'vertical' | 'horizontal';
  primarySize?: number;
  defaultPrimarySize?: number;
  minPrimarySize?: number;
  maxPrimarySize?: number;
  step?: number;
  primaryLabel?: string;
  secondaryLabel?: string;
  separatorLabel?: string;
  onPrimarySizeChange?: (size: number) => void;
}

/** Two resizable panels with pointer and keyboard-operable separator. Sizes are percentages. */
export const SplitPane = forwardRef<HTMLDivElement, SplitPaneProps>(function SplitPane(
  {
    primary,
    secondary,
    orientation = 'vertical',
    primarySize: controlledSize,
    defaultPrimarySize = 50,
    minPrimarySize = 20,
    maxPrimarySize = 80,
    step = 5,
    primaryLabel,
    secondaryLabel,
    separatorLabel,
    onPrimarySizeChange,
    className,
    style,
    ...rest
  },
  ref,
) {
  const id = useId();
  const t = useMessages().components;
  const [size, setSize] = useControllableState(controlledSize, defaultPrimarySize, onPrimarySizeChange, 'primarySize');
  const dragStart = useRef<DragStart | null>(null);
  const boundedSize = Math.min(maxPrimarySize, Math.max(minPrimarySize, size));
  const coordinate = (event: PointerEvent<HTMLDivElement>) => (orientation === 'vertical' ? event.clientX : event.clientY);
  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    dragStart.current = { coordinate: coordinate(event), size: boundedSize };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragStart.current) return;
    const root = event.currentTarget.parentElement;
    if (!root) return;
    const rect = root.getBoundingClientRect();
    const total = orientation === 'vertical' ? rect.width : rect.height;
    if (total <= 0) return;
    const direction = orientation === 'vertical' && getComputedStyle(root).direction === 'rtl' ? -1 : 1;
    const next = dragStart.current.size + ((coordinate(event) - dragStart.current.coordinate) / total) * 100 * direction;
    setSize(Math.round(Math.min(maxPrimarySize, Math.max(minPrimarySize, next))));
  };
  const onKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    const root = event.currentTarget.parentElement;
    const rtl = orientation === 'vertical' && root !== null && getComputedStyle(root).direction === 'rtl';
    const negative = orientation === 'vertical' ? (rtl ? 'ArrowRight' : 'ArrowLeft') : 'ArrowUp';
    const positive = orientation === 'vertical' ? (rtl ? 'ArrowLeft' : 'ArrowRight') : 'ArrowDown';
    let next = boundedSize;
    if (event.key === negative) next -= event.shiftKey ? step * 2 : step;
    else if (event.key === positive) next += event.shiftKey ? step * 2 : step;
    else if (event.key === 'Home') next = minPrimarySize;
    else if (event.key === 'End') next = maxPrimarySize;
    else return;
    event.preventDefault();
    setSize(Math.min(maxPrimarySize, Math.max(minPrimarySize, next)));
  };

  return (
    <div
      ref={ref}
      className={[styles.root, className].filter(Boolean).join(' ')}
      data-orientation={orientation}
      style={{ ...style, '--dc-split-size': `${boundedSize}%` } as SplitPaneStyle}
      {...rest}
    >
      <section id={`${id}-primary`} className={styles.primary} aria-label={primaryLabel ?? t.splitPrimary}>{primary}</section>
      <div
        className={styles.separator}
        role="separator"
        aria-label={separatorLabel ?? t.splitResize}
        aria-controls={`${id}-primary`}
        aria-orientation={orientation}
        aria-valuemin={minPrimarySize}
        aria-valuemax={maxPrimarySize}
        aria-valuenow={Math.round(boundedSize)}
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={(event) => {
          dragStart.current = null;
          if (event.currentTarget.hasPointerCapture?.(event.pointerId)) event.currentTarget.releasePointerCapture?.(event.pointerId);
        }}
        onPointerCancel={() => { dragStart.current = null; }}
        onKeyDown={onKeyDown}
      />
      <section className={styles.secondary} aria-label={secondaryLabel ?? t.splitSecondary}>{secondary}</section>
    </div>
  );
});
