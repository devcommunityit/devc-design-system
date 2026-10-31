import { useId, type HTMLAttributes, type ReactNode } from 'react';
import { Button } from '../Button/Button';
import styles from './PlanSwitcher.module.css';

export interface PlanSwitcherOption {
  id: string;
  label: ReactNode;
  description?: ReactNode;
}

export interface PlanSwitcherProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  label: ReactNode;
  options: PlanSwitcherOption[];
  value: string;
  onChange: (value: string) => void;
}

export function PlanSwitcher({ label, options, value, onChange, className, ...rest }: PlanSwitcherProps) {
  const labelId = useId();
  return (
    <div className={[styles.root, className].filter(Boolean).join(' ')} {...rest}>
      <span id={labelId} className={styles.label}>{label}</span>
      <div className={styles.options} role="group" aria-labelledby={labelId}>
        {options.map((option) => (
          <Button
            key={option.id}
            variant={value === option.id ? 'secondary' : 'outline'}
            aria-pressed={value === option.id}
            onPress={() => onChange(option.id)}
          >
            <span className={styles.option}>
              <span>{option.label}</span>
              {option.description ? <span className={styles.description}>{option.description}</span> : null}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
}
