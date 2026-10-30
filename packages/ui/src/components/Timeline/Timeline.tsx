import { forwardRef, type HTMLAttributes, type LiHTMLAttributes, type ReactNode } from 'react';
import { useMessages } from '../../i18n/LocaleProvider';
import { cx } from '../../utils';
import { toneLabel, type FeedbackTone } from '../Alert';
import styles from './Timeline.module.css';

export type TimelineProps = HTMLAttributes<HTMLOListElement>;

/** Chronological list of events (ordered list). Newest-first or oldest-first is up to you: say which in a heading. */
export const Timeline = forwardRef<HTMLOListElement, TimelineProps>(function Timeline({ className, ...rest }, ref) {
  return <ol ref={ref} className={cx(styles.timeline, className)} {...rest} />;
});

export interface TimelineItemProps extends Omit<LiHTMLAttributes<HTMLLIElement>, 'title'> {
  title: ReactNode;
  /** Visible, already formatted time label (e.g. via Intl.DateTimeFormat). */
  time?: ReactNode;
  /** Machine-readable ISO value for <time dateTime>. */
  dateTime?: string;
  /** Marker tone; non-neutral tones also add hidden text so meaning is not color-only. @default 'neutral' */
  tone?: 'neutral' | FeedbackTone;
  /** Custom marker icon (decorative). */
  icon?: ReactNode;
  children?: ReactNode;
}

export const TimelineItem = forwardRef<HTMLLIElement, TimelineItemProps>(function TimelineItem(
  { title, time, dateTime, tone = 'neutral', icon, children, className, ...rest },
  ref,
) {
  const t = useMessages();
  return (
    <li ref={ref} data-tone={tone} data-has-icon={icon ? true : undefined} className={cx(styles.item, className)} {...rest}>
      <span className={styles.marker} aria-hidden="true">
        {icon}
      </span>
      <div className={styles.content}>
        <div className={styles.header}>
          <span className={styles.title}>
            {tone !== 'neutral' ? <span className={styles.srOnly}>{toneLabel(t, tone)}: </span> : null}
            {title}
          </span>
          {time ? (
            <time className={styles.time} dateTime={dateTime}>
              {time}
            </time>
          ) : null}
        </div>
        {children ? <div className={styles.body}>{children}</div> : null}
      </div>
    </li>
  );
});