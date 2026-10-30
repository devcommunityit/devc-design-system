import { forwardRef, useEffect, useRef, useState, type HTMLAttributes } from 'react';
import { cx, type CSSVariables } from '../../utils';
import styles from './ScrollArea.module.css';

export interface ScrollAreaProps extends HTMLAttributes<HTMLDivElement> {
  /** Scroll direction. @default 'vertical' */
  orientation?: 'vertical' | 'horizontal' | 'both';
  /** Max block size before scrolling (any CSS length), e.g. `'20rem'`. */
  maxHeight?: string;
  /**
   * Accessible name. When the content overflows the region becomes keyboard-focusable
   * (`tabIndex=0`, `role="region"`) so keyboard users can scroll it (WCAG 2.1.1).
   */
  'aria-label'?: string;
}

/**
 * Native scroll container with themed, thin scrollbars. Keeps native scrolling (touch, wheel,
 * keyboard, screen readers): no custom scrollbar emulation.
 */
export const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(function ScrollArea(
  { orientation = 'vertical', maxHeight, className, style, children, ...rest },
  forwardedRef,
) {
  const innerRef = useRef<HTMLDivElement | null>(null);
  const [overflowing, setOverflowing] = useState(false);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const measure = () =>
      setOverflowing(el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1);
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    for (const child of Array.from(el.children)) observer.observe(child);
    return () => observer.disconnect();
  }, [children]);

  const setRef = (node: HTMLDivElement | null) => {
    innerRef.current = node;
    if (typeof forwardedRef === 'function') forwardedRef(node);
    else if (forwardedRef) forwardedRef.current = node;
  };

  const vars: CSSVariables = maxHeight ? { '--_max-block': maxHeight } : {};
  const focusable = overflowing && Boolean(rest['aria-label'] || rest['aria-labelledby']);
  return (
    <div
      ref={setRef}
      data-orientation={orientation}
      data-overflowing={overflowing || undefined}
      role={focusable ? 'region' : undefined}
      tabIndex={focusable ? 0 : undefined}
      className={cx(styles.scrollArea, className)}
      style={{ ...vars, ...style }}
      {...rest}
    >
      {children}
    </div>
  );
});
