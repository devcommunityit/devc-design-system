import { useCallback, useEffect, useState, type CSSProperties } from 'react';

/** Inline style object that may also set CSS custom properties (e.g. `{ '--_gap': '4px' }`). */
export type CSSVariables = CSSProperties & { [name: `--${string}`]: string | number | undefined };

/** Joins class names, skipping falsy values. */
export function cx(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ');
}

/**
 * Controlled/uncontrolled state. The mode is fixed on first render: switching from
 * controlled to uncontrolled (or back) logs a development warning and is ignored.
 */
export function useControllableState<T>(
  value: T | undefined,
  defaultValue: T,
  onChange?: (value: T) => void,
  name = 'value',
): [T, (next: T) => void] {
  const [isControlled] = useState(value !== undefined);
  const [internal, setInternal] = useState(defaultValue);
  const switched = isControlled !== (value !== undefined);
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' && switched) {
      console.warn(`@devcommunityit/ui: a component changed "${name}" from ${isControlled ? 'controlled to uncontrolled' : 'uncontrolled to controlled'}. Keep it consistent for the component's lifetime.`);
    }
  }, [switched, isControlled, name]);
  const current = isControlled && value !== undefined ? value : internal;
  const setValue = useCallback(
    (next: T) => {
      if (!isControlled) setInternal(next);
      onChange?.(next);
    },
    [isControlled, onChange],
  );
  return [current, setValue];
}

/** Formats a byte count with Intl (e.g. "2.5 MB"). */
export function formatBytes(bytes: number, locale?: string): string {
  const units = ['byte', 'kilobyte', 'megabyte', 'gigabyte'] as const;
  let value = bytes;
  let i = 0;
  while (value >= 1024 && i < units.length - 1) {
    value /= 1024;
    i++;
  }
  return new Intl.NumberFormat(locale, { style: 'unit', unit: units[i], unitDisplay: 'short', maximumFractionDigits: value < 10 && i > 0 ? 1 : 0 }).format(value);
}
