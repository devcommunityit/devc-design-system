import { forwardRef, type ReactNode } from 'react';
import { Label, ProgressBar, composeRenderProps, type ProgressBarProps } from 'react-aria-components';
import { useMessages } from '../../i18n/LocaleProvider';
import { cx } from '../../utils';
import styles from './Progress.module.css';

export type ProgressTone = 'brand' | 'success' | 'warning' | 'danger';

interface ProgressCommonProps extends Omit<ProgressBarProps, 'children'> {
  /** Visible label. Without it, the localized "Progress" label is used as accessible name (override with aria-label). */
  label?: ReactNode;
  /** Show the formatted value (percentage or valueLabel). @default true when determinate */
  showValue?: boolean;
  /** @default 'brand' */
  tone?: ProgressTone;
  /** @default 'md' */
  size?: 'sm' | 'md' | 'lg';
}

export type ProgressProps = ProgressCommonProps;

/**
 * Linear progress bar. Omit `value` (or set `isIndeterminate`) for unknown duration.
 * Values are formatted with Intl according to the locale (`formatOptions`, `valueLabel`).
 */
export const Progress = forwardRef<HTMLDivElement, ProgressProps>(function Progress(
  { label, showValue, tone = 'brand', size = 'md', className, isIndeterminate, value, ...rest },
  ref,
) {
  const t = useMessages();
  const indeterminate = isIndeterminate ?? value === undefined;
  const ariaLabel = rest['aria-label'] ?? (label ? undefined : t.progress);
  return (
    <ProgressBar
      ref={ref}
      {...rest}
      aria-label={ariaLabel}
      value={value}
      isIndeterminate={indeterminate}
      data-tone={tone}
      data-size={size}
      className={composeRenderProps(className, (cn) => cx(styles.progress, cn))}
    >
      {({ percentage, valueText, isIndeterminate: ind }) => (
        <>
          {label || (showValue ?? !ind) ? (
            <div className={styles.header}>
              {label ? <Label className={styles.label}>{label}</Label> : <span />}
              {(showValue ?? !ind) && !ind ? <span className={styles.value}>{valueText}</span> : null}
            </div>
          ) : null}
          <div className={styles.track}>
            <div className={styles.fill} style={ind ? undefined : { inlineSize: `${percentage ?? 0}%` }} />
          </div>
        </>
      )}
    </ProgressBar>
  );
});

export interface CircularProgressProps extends Omit<ProgressCommonProps, 'label' | 'size'> {
  /** Diameter. @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** Accessible label (no visible label slot: put text next to it if needed). */
  'aria-label'?: string;
}

/** Circular progress indicator; shows the percentage in the center for md/lg sizes when determinate. */
export const CircularProgress = forwardRef<HTMLDivElement, CircularProgressProps>(function CircularProgress(
  { showValue, tone = 'brand', size = 'md', className, isIndeterminate, value, ...rest },
  ref,
) {
  const t = useMessages();
  const indeterminate = isIndeterminate ?? value === undefined;
  return (
    <ProgressBar
      ref={ref}
      {...rest}
      aria-label={rest['aria-label'] ?? (rest['aria-labelledby'] ? undefined : t.progress)}
      value={value}
      isIndeterminate={indeterminate}
      data-tone={tone}
      data-size={size}
      className={composeRenderProps(className, (cn) => cx(styles.circular, cn))}
    >
      {({ percentage, valueText, isIndeterminate: ind }) => (
        <>
          <svg viewBox="0 0 36 36" className={styles.ring} aria-hidden="true">
            <circle className={styles.ringTrack} cx="18" cy="18" r="15.9155" />
            <circle
              className={styles.ringFill}
              cx="18"
              cy="18"
              r="15.9155"
              pathLength={100}
              strokeDasharray={ind ? '25 75' : `${percentage ?? 0} 100`}
            />
          </svg>
          {(showValue ?? size !== 'sm') && !ind ? (
            <span className={styles.ringValue} aria-hidden="true">
              {valueText}
            </span>
          ) : null}
        </>
      )}
    </ProgressBar>
  );
});