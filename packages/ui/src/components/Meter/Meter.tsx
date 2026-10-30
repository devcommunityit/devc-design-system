import { forwardRef, useId, type ReactNode } from 'react';
import { Label, Meter as RACMeter, composeRenderProps, type MeterProps as RACMeterProps } from 'react-aria-components';
import { cx } from '../../utils';
import type { ProgressTone } from '../Progress/Progress';
import styles from './Meter.module.css';

export interface MeterThresholds {
  /** From this value (inclusive) the tone becomes `warning`. */
  warning?: number;
  /** From this value (inclusive) the tone becomes `danger`. */
  danger?: number;
}

export interface MeterProps extends Omit<RACMeterProps, 'children'> {
  /** Visible label; otherwise pass `aria-label`. */
  label?: ReactNode;
  /** Show the formatted value (`valueLabel` or Intl percentage). @default true */
  showValue?: boolean;
  /** Fixed tone, or computed from `thresholds` when omitted. @default 'brand' */
  tone?: ProgressTone;
  /** Ascending thresholds (e.g. used storage): above them the tone switches to warning/danger. */
  thresholds?: MeterThresholds;
  /** Help text under the bar (e.g. "4.2 GB free"). */
  description?: ReactNode;
  /** @default 'md' */
  size?: 'sm' | 'md' | 'lg';
}

function resolveTone(value: number, tone: ProgressTone | undefined, thresholds: MeterThresholds | undefined): ProgressTone {
  if (tone) return tone;
  if (thresholds?.danger !== undefined && value >= thresholds.danger) return 'danger';
  if (thresholds?.warning !== undefined && value >= thresholds.warning) return 'warning';
  return thresholds ? 'success' : 'brand';
}

/**
 * Scalar measurement within a known range (`role="meter"`): quota, storage, password strength, capacity.
 * Unlike Progress it does not represent a task advancing over time. The tone is a visual aid only:
 * always make the value or label convey the meaning in text too (`valueLabel`, `description`).
 */
export const Meter = forwardRef<HTMLDivElement, MeterProps>(function Meter(
  { label, showValue = true, tone, thresholds, description, size = 'md', value = 0, className, 'aria-describedby': describedBy, ...rest },
  ref,
) {
  const resolved = resolveTone(value, tone, thresholds);
  const descriptionId = useId();
  return (
    <RACMeter
      ref={ref}
      value={value}
      data-tone={resolved}
      data-size={size}
      aria-describedby={cx(describedBy, description ? descriptionId : undefined) || undefined}
      className={composeRenderProps(className, (cn) => cx(styles.meter, cn))}
      {...rest}
    >
      {({ percentage, valueText }) => (
        <>
          {label || showValue ? (
            <div className={styles.header}>
              {label ? <Label className={styles.label}>{label}</Label> : <span />}
              {showValue ? <span className={styles.value}>{valueText}</span> : null}
            </div>
          ) : null}
          <div className={styles.track}>
            <div className={styles.fill} style={{ inlineSize: `${percentage}%` }} />
          </div>
          {description ? (
            <div id={descriptionId} className={styles.description}>
              {description}
            </div>
          ) : null}
        </>
      )}
    </RACMeter>
  );
});
