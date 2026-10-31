import { useId, type FormEvent, type HTMLAttributes, type ReactNode } from 'react';
import styles from './CheckInScanner.module.css';

export interface CheckInScannerProps extends Omit<HTMLAttributes<HTMLElement>, 'title' | 'onSubmit'> {
  title: ReactNode;
  code: string;
  onCodeChange: (code: string) => void;
  onCheckIn: (code: string) => void;
  scannerViewport?: ReactNode;
  codeLabel?: string;
  submitLabel?: string;
  disabled?: boolean;
}

export function CheckInScanner({
  title,
  code,
  onCodeChange,
  onCheckIn,
  scannerViewport,
  codeLabel = 'Ticket code',
  submitLabel = 'Check in',
  disabled = false,
  className,
  ...rest
}: CheckInScannerProps) {
  const titleId = useId();
  const inputId = useId();
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!disabled && code.trim()) onCheckIn(code.trim());
  };

  return (
    <section aria-labelledby={titleId} className={[styles.scanner, className].filter(Boolean).join(' ')} {...rest}>
      <h2 id={titleId} className={styles.title}>{title}</h2>
      {scannerViewport ? <div className={styles.viewport}>{scannerViewport}</div> : null}
      <form className={styles.form} onSubmit={handleSubmit}>
        <label htmlFor={inputId}>{codeLabel}</label>
        <div className={styles.controls}>
          <input
            id={inputId}
            autoComplete="off"
            value={code}
            onChange={(event) => onCodeChange(event.currentTarget.value)}
            disabled={disabled}
          />
          <button type="submit" disabled={disabled || !code.trim()}>{submitLabel}</button>
        </div>
      </form>
    </section>
  );
}
