import type { ReactNode } from 'react';
import { Radio, RadioGroup } from '../RadioGroup/RadioGroup';
import styles from './NpsWidget.module.css';

export interface NpsWidgetProps {
  label: string;
  value: number | null;
  onChange: (value: number | null) => void;
  lowLabel: ReactNode;
  highLabel: ReactNode;
}

/** Controlled 0–10 recommendation rating; it does not calculate an NPS score. */
export function NpsWidget({ label, value, onChange, lowLabel, highLabel }: NpsWidgetProps) {
  return (
    <div className={styles.widget}>
      <RadioGroup
        label={label}
        orientation="horizontal"
        value={value === null ? null : String(value)}
        onChange={(next) => onChange(next === null ? null : Number(next))}
      >
        {Array.from({ length: 11 }, (_, score) => (
          <Radio key={score} value={String(score)} aria-label={String(score)}>
            {score}
          </Radio>
        ))}
      </RadioGroup>
      <div className={styles.scaleLabels}>
        <span>{lowLabel}</span>
        <span>{highLabel}</span>
      </div>
    </div>
  );
}
