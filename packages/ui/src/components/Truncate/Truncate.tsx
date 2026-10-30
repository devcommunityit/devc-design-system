import { forwardRef, useEffect, useId, useRef, useState, type HTMLAttributes } from 'react';
import { Button as RACButton } from 'react-aria-components';
import { useMessages } from '../../i18n/LocaleProvider';
import { cx, useControllableState, type CSSVariables } from '../../utils';
import styles from './Truncate.module.css';

export interface TruncateProps extends HTMLAttributes<HTMLDivElement> {
  /** Max visible lines before truncation. `1` = single-line ellipsis. @default 3 */
  lines?: number;
  /** Controlled expanded state. */
  isExpanded?: boolean;
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  /** Hide the toggle (e.g. when the full text is available elsewhere). @default false */
  hideToggle?: boolean;
}

/**
 * Clamps long text to a number of lines. When the text actually overflows, a real
 * "Show more / Show less" button reveals the full content (keyboard and touch; never hover-only).
 */
export const Truncate = forwardRef<HTMLDivElement, TruncateProps>(function Truncate(
  { lines = 3, isExpanded, defaultExpanded = false, onExpandedChange, hideToggle, className, style, children, ...rest },
  ref,
) {
  const messages = useMessages();
  const contentId = useId();
  const contentRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useControllableState(isExpanded, defaultExpanded, onExpandedChange, 'isExpanded');
  const [overflowing, setOverflowing] = useState(false);

  useEffect(() => {
    const el = contentRef.current;
    if (!el || expanded) return;
    const measure = () => setOverflowing(el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1);
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [expanded, children, lines]);

  const vars: CSSVariables = { '--_lines': String(lines) };
  const showToggle = !hideToggle && (overflowing || expanded);
  return (
    <div ref={ref} className={cx(styles.truncate, className)} style={{ ...vars, ...style }} {...rest}>
      <div
        ref={contentRef}
        id={contentId}
        className={styles.content}
        data-lines={lines === 1 ? 'single' : 'multi'}
        data-expanded={expanded || undefined}
      >
        {children}
      </div>
      {showToggle ? (
        <RACButton className={styles.toggle} aria-expanded={expanded} aria-controls={contentId} onPress={() => setExpanded(!expanded)}>
          {expanded ? messages.showLess : messages.showMore}
        </RACButton>
      ) : null}
    </div>
  );
});
