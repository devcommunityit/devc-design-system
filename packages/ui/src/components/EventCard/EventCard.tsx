import { forwardRef, useId, useMemo, type HTMLAttributes, type ReactNode, type Ref } from 'react';
import { Link as RACLink } from 'react-aria-components';
import { Clock, MapPin, MonitorPlay } from 'lucide-react';
import { useLocale, useMessages } from '../../i18n/LocaleProvider';
import { cx } from '../../utils';
import { Avatar, AvatarGroup } from '../Avatar/Avatar';
import { DateBadge, type DateBadgeValue } from '../DateBadge/DateBadge';
import { Meter } from '../Meter/Meter';
import { LoadingPlaceholder } from '../Skeleton/LoadingPlaceholder';
import { SkeletonCard } from '../Skeleton/SkeletonPresets';
import styles from './EventCard.module.css';

export type EventCardTone = 'brand' | 'violet' | 'cyan' | 'pink' | 'green';

export type EventCardMode = 'online' | 'hybrid' | 'inPerson';

export interface EventCardAttendee {
  name: string;
  src?: string;
}

export interface EventCardProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Shows a SkeletonCard skeleton of the same shape, marked `aria-busy`, while the data loads. @default false */
  isLoading?: boolean;
  /** Event title; with `href` it becomes the card link. */
  title: ReactNode;
  /** Destination of the event page: the whole card is clickable (stretched link), inner actions stay clickable. */
  href?: string;
  /** Heading level of the title. @default 3 */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  /** Event day, shown in a DateBadge on the cover. */
  date?: DateBadgeValue;
  /** Cover gradient. @default 'brand' */
  tone?: EventCardTone;
  /** Attendance mode, shown as a glass tag on the cover. */
  mode?: EventCardMode;
  /** Large faint decorative text on the cover (e.g. “AI”, “.NET”). Hidden from assistive technology. */
  watermark?: string;
  /** Tags/chips above the title (e.g. Badge or Tag elements). */
  tags?: ReactNode;
  /** Short description under the title. */
  description?: ReactNode;
  /** Place or “Streaming”; the icon follows `mode`. */
  location?: ReactNode;
  /** Time range, e.g. “18:30 – 21:00”. */
  time?: ReactNode;
  /** Seats already taken (requires `capacity`). */
  seatsTaken?: number;
  /** Total seats; when set a capacity meter is shown. */
  capacity?: number;
  /** Remaining seats at or below which the “last seats” warning appears. @default 5 */
  lowSeatsThreshold?: number;
  /** People attending, rendered with AvatarGroup. */
  attendees?: EventCardAttendee[];
  /** Max avatars before the “+N” counter. @default 3 */
  maxAttendees?: number;
  /** Accessible name of the attendee group, e.g. “Partecipanti”. */
  attendeesLabel?: string;
  /** Footer action, e.g. a Button “Iscriviti”. */
  action?: ReactNode;
}

const modeMessage = { online: 'eventModeOnline', hybrid: 'eventModeHybrid', inPerson: 'eventModeInPerson' } as const;

/**
 * Community event card: gradient cover with date and attendance mode, title, meta rows, capacity
 * meter, attendees and an action. With `href` the whole card links to the event page.
 */
export const EventCard = forwardRef<HTMLElement, EventCardProps>(function EventCard(
  {
    title,
    href,
    headingLevel = 3,
    date,
    tone = 'brand',
    mode,
    watermark,
    tags,
    description,
    location,
    time,
    seatsTaken,
    capacity,
    lowSeatsThreshold = 5,
    attendees,
    maxAttendees = 3,
    attendeesLabel,
    action,
    isLoading = false,
    className,
    ...rest
  },
  ref,
) {
  const t = useMessages();
  const { locale } = useLocale();
  const titleId = useId();
  const formatter = useMemo(() => new Intl.NumberFormat(locale), [locale]);
  const Heading = `h${headingLevel}` as const;

  const hasCapacity = typeof capacity === 'number' && Number.isFinite(capacity) && capacity > 0;
  const taken = Math.max(0, Number.isFinite(seatsTaken) ? (seatsTaken ?? 0) : 0);
  const remaining = hasCapacity ? Math.max(0, capacity - taken) : 0;
  const soldOut = hasCapacity && remaining === 0;
  const lowSeats = hasCapacity && !soldOut && remaining <= lowSeatsThreshold;
  const seatsText = hasCapacity ? t.eventSeats(formatter.format(taken), formatter.format(capacity)) : '';
  const seatsStatus = soldOut ? t.eventSoldOut : lowSeats ? t.eventSeatsLeft(remaining, formatter.format(remaining)) : null;
  const hasFooter = Boolean(attendees?.length) || Boolean(action);

  if (isLoading) {
    return (
      <LoadingPlaceholder ref={ref as Ref<HTMLDivElement>} className={className} {...rest}>
        <SkeletonCard media mediaRatio="2 / 1" lines={2} actions={1} />
      </LoadingPlaceholder>
    );
  }
  return (
    <article
      ref={ref}
      aria-labelledby={titleId}
      data-tone={tone}
      data-linked={href ? true : undefined}
      className={cx(styles.event, className)}
      {...rest}
    >
      <div className={styles.cover}>
        {date !== undefined ? <DateBadge date={date} className={styles.date} /> : <span />}
        {mode ? (
          <span className={styles.mode} data-mode={mode}>
            <span className={styles.modeDot} aria-hidden="true" />
            {t[modeMessage[mode]]}
          </span>
        ) : null}
        {watermark ? (
          <span className={styles.watermark} aria-hidden="true">
            {watermark}
          </span>
        ) : null}
      </div>
      <div className={styles.body}>
        {tags ? <div className={styles.tags}>{tags}</div> : null}
        <Heading id={titleId} className={styles.title}>
          {href ? (
            <RACLink href={href} className={styles.titleLink}>
              {title}
            </RACLink>
          ) : (
            title
          )}
        </Heading>
        {description ? <div className={styles.description}>{description}</div> : null}
        {location || time ? (
          <div className={styles.meta}>
            {location ? (
              <span className={styles.metaItem}>
                {mode === 'online' ? <MonitorPlay aria-hidden="true" /> : <MapPin aria-hidden="true" />}
                {location}
              </span>
            ) : null}
            {time ? (
              <span className={styles.metaItem}>
                <Clock aria-hidden="true" />
                {time}
              </span>
            ) : null}
          </div>
        ) : null}
        {hasCapacity ? (
          <div className={styles.capacity}>
            <Meter
              aria-labelledby={titleId}
              value={Math.min(taken, capacity)}
              maxValue={capacity}
              valueLabel={seatsStatus ? `${seatsText} · ${seatsStatus}` : seatsText}
              showValue={false}
              size="sm"
              tone={soldOut ? 'danger' : lowSeats ? 'warning' : 'brand'}
              className={styles.meter}
            />
            <div className={styles.seats} data-status={soldOut ? 'sold-out' : lowSeats ? 'low' : undefined}>
              <span>{seatsText}</span>
              {seatsStatus ? <span className={styles.seatsStatus}>{seatsStatus}</span> : null}
            </div>
          </div>
        ) : null}
        {hasFooter ? (
          <div className={styles.footer}>
            {attendees?.length ? (
              <AvatarGroup size="sm" max={maxAttendees} aria-label={attendeesLabel} className={styles.attendees}>
                {attendees.map((person, i) => (
                  <Avatar key={`${person.name}-${i}`} name={person.name} src={person.src} />
                ))}
              </AvatarGroup>
            ) : (
              <span />
            )}
            {action ? <div className={styles.action}>{action}</div> : null}
          </div>
        ) : null}
      </div>
    </article>
  );
});
