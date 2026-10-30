import { X } from 'lucide-react';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { useMessages } from '../../i18n/LocaleProvider';
import { cx } from '../../utils';
import { FeedbackIcon, toneLabel, type FeedbackTone } from '../Alert/Alert';
import { IconButton } from '../IconButton/IconButton';
import styles from './Banner.module.css';

export interface BannerProps extends HTMLAttributes<HTMLDivElement> {
  /** `neutral` uses brand surfaces for announcements. @default 'info' */
  tone?: FeedbackTone | 'neutral';
  /** Link or button shown after the message. */
  action?: ReactNode;
  /** When set, a close button is shown; persist the dismissal yourself if needed. */
  onDismiss?: () => void;
  /** Sticks to the top of the scroll container. @default false */
  sticky?: boolean;
}

/**
 * Full-width, page-level message (maintenance, cookie notice, global announcement).
 * Not announced automatically: render it on page load or use Toast/Alert live for dynamic messages.
 */
export const Banner = forwardRef<HTMLDivElement, BannerProps>(function Banner(
  { tone = 'info', action, onDismiss, sticky = false, className, children, ...rest },
  ref,
) {
  const t = useMessages();
  return (
    <div ref={ref} data-tone={tone} data-sticky={sticky || undefined} className={cx(styles.banner, className)} {...rest}>
      <div className={styles.inner}>
        {tone !== 'neutral' ? <FeedbackIcon tone={tone} className={styles.icon} /> : null}
        <div className={styles.message}>
          {tone !== 'neutral' ? <span className={styles.srOnly}>{toneLabel(t, tone)}: </span> : null}
          {children}
        </div>
        {action ? <div className={styles.action}>{action}</div> : null}
      </div>
      {onDismiss ? <IconButton size="sm" label={t.dismiss} icon={<X />} className={styles.close} onPress={onDismiss} /> : null}
    </div>
  );
});