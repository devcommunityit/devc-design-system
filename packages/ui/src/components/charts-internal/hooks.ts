import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { useLocale } from '../../i18n/LocaleProvider';

/** Width used before the element is measured (SSR, jsdom, no ResizeObserver). */
export const FALLBACK_CHART_WIDTH = 560;

/**
 * Measures an element's content width with ResizeObserver. Browser APIs are only touched inside
 * the effect, so it is SSR-safe; without ResizeObserver the fallback width is kept.
 */
export function useElementWidth<T extends HTMLElement>(fallback = FALLBACK_CHART_WIDTH) {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(fallback);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const apply = (next: number) => {
      const rounded = Math.round(next);
      if (rounded > 0) setWidth((prev) => (prev === rounded ? prev : rounded));
    };
    apply(el.clientWidth);
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) apply(entry.contentRect.width);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return { ref, width };
}

/** Intl.NumberFormat for the current locale. */
export function useNumberFormatter(formatOptions?: Intl.NumberFormatOptions): Intl.NumberFormat {
  const { locale } = useLocale();
  return useMemo(() => new Intl.NumberFormat(locale, formatOptions), [locale, formatOptions]);
}

export interface ChartNavigationOptions {
  /** Wrap from the last item to the first (circular data such as a donut). */
  wrap?: boolean;
}

/**
 * Active-item state for a focusable plot: arrows/Home/End move, Escape clears. Keyboard moves
 * update `announcement` (for a polite live region); pointer hover only sets the active item.
 */
export function useChartNavigation(count: number, describe: (index: number) => string, { wrap = false }: ChartNavigationOptions = {}) {
  const [rawActive, setActive] = useState<number | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const active = rawActive !== null && rawActive < count ? rawActive : null;

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (count === 0) return;
    let next: number;
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        next = active === null ? 0 : active + 1 >= count ? (wrap ? 0 : count - 1) : active + 1;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        next = active === null ? count - 1 : active - 1 < 0 ? (wrap ? count - 1 : 0) : active - 1;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = count - 1;
        break;
      case 'Escape':
        if (active !== null) {
          event.preventDefault();
          setActive(null);
        }
        return;
      default:
        return;
    }
    event.preventDefault();
    setActive(next);
    setAnnouncement(describe(next));
  };

  return { active, setActive, onKeyDown, announcement };
}
