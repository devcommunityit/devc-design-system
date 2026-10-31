import { useId, type HTMLAttributes, type ReactNode } from 'react';
import styles from './VenueCard.module.css';

export interface VenueCardProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  name: ReactNode;
  address: ReactNode;
  accessibility?: ReactNode;
  mapHref?: string;
  mapLinkLabel?: string;
  directions?: ReactNode;
}

export function VenueCard({ name, address, accessibility, mapHref, mapLinkLabel = 'Open map directions', directions, className, ...rest }: VenueCardProps) {
  const titleId = useId();
  return (
    <article aria-labelledby={titleId} className={[styles.card, className].filter(Boolean).join(' ')} {...rest}>
      <h2 id={titleId} className={styles.title}>{name}</h2>
      <address className={styles.address}>{address}</address>
      {directions ? <p className={styles.directions}>{directions}</p> : null}
      {accessibility ? <section className={styles.accessibility} aria-label="Accessibility information">{accessibility}</section> : null}
      {mapHref ? <a className={styles.mapLink} href={mapHref} target="_blank" rel="noreferrer">{mapLinkLabel}<span className={styles.srOnly}> (opens in a new tab)</span></a> : null}
    </article>
  );
}
