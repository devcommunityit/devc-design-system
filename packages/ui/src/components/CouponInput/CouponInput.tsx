import { useId, type FormEvent, type HTMLAttributes, type ReactNode } from 'react';
import { Button } from '../Button/Button';
import { TextField } from '../TextField/TextField';
import styles from './CouponInput.module.css';

export type CouponStatus = 'idle' | 'applied' | 'error';

export interface CouponInputProps extends Omit<HTMLAttributes<HTMLFormElement>, 'onSubmit' | 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  onApply: (value: string) => void;
  label: ReactNode;
  applyLabel: ReactNode;
  status: CouponStatus;
  message?: ReactNode;
  placeholder?: string;
}

export function CouponInput({
  value, onChange, onApply, label, applyLabel, status, message, placeholder, className, ...rest
}: CouponInputProps) {
  const id = useId();
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onApply(value);
  };
  return (
    <form className={[styles.form, className].filter(Boolean).join(' ')} onSubmit={submit} data-status={status} {...rest}>
      <TextField id={id} label={label} value={value} onChange={onChange} placeholder={placeholder} />
      <Button type="submit" variant="secondary">{applyLabel}</Button>
      {message ? <p className={styles.message} role={status === 'error' ? 'alert' : 'status'}>{message}</p> : null}
    </form>
  );
}
