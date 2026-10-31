import type { HTMLAttributes } from 'react';
import styles from './Confetti.module.css';

export interface ConfettiProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Number of deterministic decorative pieces to render, from 1 to 16. @default 12 */
  particleCount?: number;
}

/** CSS-only decorative confetti. It is hidden from assistive technology and reduced-motion users. */
export function Confetti({ particleCount = 12, className, ...rest }: ConfettiProps) {
  const count = Number.isFinite(particleCount) ? Math.min(16, Math.max(1, Math.floor(particleCount))) : 12;

  return (
    <span {...rest} aria-hidden="true" className={[styles.confetti, className].filter(Boolean).join(' ')}>
      {Array.from({ length: count }, (_, index) => <span key={index} className={styles.particle} />)}
    </span>
  );
}
