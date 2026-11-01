import type { ReactNode } from 'react';
import styles from './SponsorWall.module.css';

export interface Sponsor {
  id: string;
  name: string;
  logo: ReactNode;
  href?: string;
  tier?: ReactNode;
}

export interface SponsorWallProps {
  'aria-label': string;
  sponsors: readonly Sponsor[];
  heading?: ReactNode;
}

/** A semantic list of sponsor marks and optional sponsor links. */
export function SponsorWall({ 'aria-label': ariaLabel, sponsors, heading }: SponsorWallProps) {
  return (
    <section className={styles.wall} aria-label={ariaLabel}>
      {heading ? <h2 className={styles.heading}>{heading}</h2> : null}
      <ul className={styles.list}>
        {sponsors.map((sponsor) => (
          <li className={styles.item} key={sponsor.id}>
            {sponsor.href ? (
              <a className={styles.link} href={sponsor.href}>
                <span className={styles.logo} aria-hidden="true">{sponsor.logo}</span>
                <span className={styles.name}>{sponsor.name}</span>
              </a>
            ) : (
              <div className={styles.mark}>
                <span className={styles.logo} aria-hidden="true">{sponsor.logo}</span>
                <span className={styles.name}>{sponsor.name}</span>
              </div>
            )}
            {sponsor.tier ? <span className={styles.tier}>{sponsor.tier}</span> : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
