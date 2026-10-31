import type { HTMLAttributes, ReactNode } from 'react';
import { Meter } from '../Meter/Meter';
import styles from './UsageMeter.module.css';

export interface UsageMeterProps extends HTMLAttributes<HTMLDivElement> {
  label: ReactNode;
  value: number;
  limit: number;
  unit?: string;
  description?: ReactNode;
  thresholds?: { warning?: number; danger?: number };
}

export function UsageMeter({ label, value, limit, unit, description, thresholds, className, ...rest }: UsageMeterProps) {
  const safeLimit = Math.max(0, limit);
  const valueLabel = `${value}${unit ? ` ${unit}` : ''} / ${safeLimit}${unit ? ` ${unit}` : ''}`;
  return (
    <div className={[styles.meter, className].filter(Boolean).join(' ')} {...rest}>
      <Meter
        label={label}
        value={value}
        minValue={0}
        maxValue={safeLimit || 1}
        formatOptions={{ style: 'decimal', maximumFractionDigits: 0 }}
        valueLabel={valueLabel}
        description={description}
        thresholds={thresholds}
        aria-valuetext={valueLabel}
      />
    </div>
  );
}
