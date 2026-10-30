import { CircleAlert, CircleCheck, Info, TriangleAlert, X } from 'lucide-react';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { useMessages } from '../../i18n/LocaleProvider';
import type { Messages } from '../../i18n/messages';
import { cx } from '../../utils';
import { IconButton } from '../IconButton/IconButton';
import styles from './Alert.module.css';

export type FeedbackTone = 'info' | 'success' | 'warning' | 'danger';

const icons = { info: Info, success: CircleCheck, warning: TriangleAlert, danger: CircleAlert } as const;

/** Localized, screen-reader-only prefix for a tone (so meaning is not conveyed by color/icon only). */
export function toneLabel(t: Messages, tone: FeedbackTone): string {
  return tone === 'danger' ? t.error : t[tone];
}

export function FeedbackIcon({ tone, className }: { tone: FeedbackTone; className?: string }) {
  const Icon = icons[tone];
  return <Icon aria-hidden="true" className={className} />;
}

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** @default 'info' */
  tone?: FeedbackTone;
  /** @default 'soft' */
  variant?: 'soft' | 'outline';
  title?: ReactNode;
  /** Replace the tone icon (decorative). Pass `null` to hide it. */
  icon?: ReactNode;
  /** Buttons or links shown after the message. */
  actions?: ReactNode;
  /** When set, a close button is shown; you control the visibility. */
  onDismiss?: () => void;
  /**
   * Announce changes to assistive tech. `polite` → role=status, `assertive` → role=alert.
   * Use only for messages that appear dynamically. @default 'off'
   */
  live?: 'off' | 'polite' | 'assertive';
}

/** Inline contextual message (form summary, section notice). Meaning is conveyed by text, icon and a hidden tone label. */
export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  { tone = 'info', variant = 'soft', title, icon, actions, onDismiss, live = 'off', className, children, ...rest },
  ref,
) {
  const t = useMessages();
  const role = live === 'assertive' ? 'alert' : live === 'polite' ? 'status' : undefined;
  return (
    <div ref={ref} role={role} data-tone={tone} data-variant={variant} className={cx(styles.alert, className)} {...rest}>
      {icon === null ? null : <span className={styles.icon}>{icon ?? <FeedbackIcon tone={tone} />}</span>}
      <div className={styles.body}>
        {title ? (
          <div className={styles.title}>
            <span className={styles.srOnly}>{toneLabel(t, tone)}: </span>
            {title}
          </div>
        ) : (
          <span className={styles.srOnly}>{toneLabel(t, tone)}: </span>
        )}
        {children ? <div className={styles.content}>{children}</div> : null}
        {actions ? <div className={styles.actions}>{actions}</div> : null}
      </div>
      {onDismiss ? <IconButton size="sm" label={t.dismiss} icon={<X />} className={styles.close} onPress={onDismiss} /> : null}
    </div>
  );
});