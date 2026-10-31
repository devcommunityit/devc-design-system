import { useId, type HTMLAttributes, type ReactNode } from 'react';
import { Agenda, AgendaItem } from '../Agenda/Agenda';
import styles from './ScheduleGrid.module.css';

export interface ScheduleSession {
  id: string;
  title: ReactNode;
  startTime: string;
  endTime?: string;
  startDateTime?: string;
  endDateTime?: string;
  description?: ReactNode;
  href?: string;
  location?: ReactNode;
}

export interface ScheduleTrack {
  id: string;
  name: ReactNode;
  sessions: ScheduleSession[];
}

export interface ScheduleGridProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title: ReactNode;
  tracks: ScheduleTrack[];
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  emptyState?: ReactNode;
}

export function ScheduleGrid({ title, tracks, headingLevel = 2, emptyState = 'No sessions are scheduled.', className, ...rest }: ScheduleGridProps) {
  const titleId = useId();
  const Heading = `h${headingLevel}` as const;
  const trackHeadingLevel = Math.min(6, headingLevel + 1) as 2 | 3 | 4 | 5 | 6;
  const sessionHeadingLevel = Math.min(6, headingLevel + 2) as 2 | 3 | 4 | 5 | 6;
  return (
    <section aria-labelledby={titleId} className={[styles.grid, className].filter(Boolean).join(' ')} {...rest}>
      <Heading id={titleId} className={styles.title}>{title}</Heading>
      {tracks.length ? (
        <div className={styles.tracks}>
          {tracks.map((track) => (
            <Agenda className={styles.track} key={track.id} title={track.name} headingLevel={trackHeadingLevel} emptyState={emptyState}>
              {track.sessions.map((session) => (
                <AgendaItem
                  key={session.id}
                  title={session.title}
                  startTime={session.startTime}
                  endTime={session.endTime}
                  startDateTime={session.startDateTime}
                  endDateTime={session.endDateTime}
                  description={session.description}
                  href={session.href}
                  location={session.location}
                  headingLevel={sessionHeadingLevel}
                />
              ))}
            </Agenda>
          ))}
        </div>
      ) : <p className={styles.empty}>{emptyState}</p>}
    </section>
  );
}
