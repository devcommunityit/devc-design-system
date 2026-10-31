import type { ReactNode } from 'react';
import { Radio, RadioGroup } from '../RadioGroup/RadioGroup';
import styles from './Poll.module.css';

export interface PollOption {
  id: string;
  label: ReactNode;
  description?: ReactNode;
}

export interface PollProps {
  title: string;
  options: readonly PollOption[];
  value: string | null;
  onChange: (value: string | null) => void;
  description?: ReactNode;
}

/** Controlled poll choice UI; it neither submits a vote nor computes results. */
export function Poll({ title, options, value, onChange, description }: PollProps) {
  return (
    <section className={styles.poll} aria-label={title}>
      <RadioGroup className={styles.options} label={title} description={description} value={value} onChange={onChange}>
        {options.map((option) => (
          <Radio key={option.id} value={option.id} description={option.description}>
            {option.label}
          </Radio>
        ))}
      </RadioGroup>
    </section>
  );
}
