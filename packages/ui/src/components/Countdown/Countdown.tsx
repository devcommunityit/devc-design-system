import { useEffect, useId, useState, type HTMLAttributes, type ReactNode } from 'react';
import styles from './Countdown.module.css';

export interface CountdownProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  targetDate: Date | string;
  label?: ReactNode;
  expiredContent?: ReactNode;
}

interface RemainingTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getRemaining(target: number, now: number): RemainingTime {
  const totalSeconds = Math.max(0, Math.floor((target - now) / 1000));
  return {
    days: Math.floor(totalSeconds / 86_400),
    hours: Math.floor((totalSeconds % 86_400) / 3_600),
    minutes: Math.floor((totalSeconds % 3_600) / 60),
    seconds: totalSeconds % 60,
  };
}

export function Countdown({ targetDate, label = 'Event starts in', expiredContent = 'This event has started.', className, ...rest }: CountdownProps) {
  const headingId = useId();
  const target = new Date(targetDate).getTime();
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const expired = !Number.isFinite(target) || target <= now;
  const remaining = getRemaining(target, now);
  const units: Array<[keyof RemainingTime, string]> = [
    ['days', 'Days'],
    ['hours', 'Hours'],
    ['minutes', 'Minutes'],
    ['seconds', 'Seconds'],
  ];

  return (
    <section aria-labelledby={headingId} className={[styles.countdown, className].filter(Boolean).join(' ')} {...rest}>
      <h2 id={headingId} className={styles.label}>{label}</h2>
      {expired ? (
        <p className={styles.expired}>{expiredContent}</p>
      ) : (
        <div className={styles.units} aria-label="Countdown">
          {units.map(([unit, unitLabel]) => (
            <div className={styles.unit} key={unit}>
              <span className={styles.value}>{String(remaining[unit]).padStart(2, '0')}</span>
              <span className={styles.unitLabel}>{unitLabel}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
