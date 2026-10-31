import type { ReactNode } from 'react';
import { Avatar } from '../Avatar/Avatar';
import styles from './Testimonial.module.css';

export interface TestimonialProps {
  quote: ReactNode;
  author: string;
  authorRole?: ReactNode;
  avatarSrc?: string;
  cite?: string;
}

/** A quotation with its attribution, rendered as a semantic figure. */
export function Testimonial({ quote, author, authorRole, avatarSrc, cite }: TestimonialProps) {
  return (
    <figure className={styles.testimonial}>
      <blockquote className={styles.quote} cite={cite}>
        {quote}
      </blockquote>
      <figcaption className={styles.attribution}>
        <Avatar name={author} src={avatarSrc} size="md" isDecorative />
        <span className={styles.author}>{author}</span>
        {authorRole ? <span className={styles.role}>{authorRole}</span> : null}
      </figcaption>
    </figure>
  );
}
