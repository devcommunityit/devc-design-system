import { forwardRef, type AnchorHTMLAttributes, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils';
import styles from './Card.module.css';

export interface CardProps extends HTMLAttributes<HTMLElement> {
  /** Semantic element. Use `article` for self-contained content, `li` inside lists. @default 'div' */
  as?: 'div' | 'article' | 'section' | 'li';
  /** @default 'outlined' */
  variant?: 'outlined' | 'elevated' | 'filled' | 'accent';
  /** Inner padding. @default 'md' */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Visually marks the card as selected (pair with a selected control or text). */
  isSelected?: boolean;
}

/**
 * Surface grouping related content. Not clickable by itself: to make the whole card
 * open a destination, put a `CardLink` inside (its hit area stretches to the card).
 */
export const Card = forwardRef<HTMLElement, CardProps>(function Card(
  { as = 'div', variant = 'outlined', padding = 'md', isSelected, className, ...rest },
  ref,
) {
  const setRef = (node: HTMLElement | null) => {
    if (typeof ref === 'function') ref(node);
    else if (ref) ref.current = node;
  };
  const shared = {
    ref: setRef,
    'data-variant': variant,
    'data-padding': padding,
    'data-selected': isSelected || undefined,
    className: cx(styles.card, className),
    ...rest,
  };
  if (as === 'article') return <article {...shared} />;
  if (as === 'section') return <section {...shared} />;
  if (as === 'li') return <li {...shared} />;
  return <div {...shared} />;
});

export interface CardHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title: ReactNode;
  /** Heading level of the title. @default 3 */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  subtitle?: ReactNode;
  /** Leading visual, e.g. Avatar or icon. */
  media?: ReactNode;
  /** Trailing actions (menu, icon button). Keep them outside CardLink. */
  actions?: ReactNode;
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(function CardHeader(
  { title, headingLevel = 3, subtitle, media, actions, className, ...rest },
  ref,
) {
  const H = `h${headingLevel}` as const;
  return (
    <div ref={ref} className={cx(styles.header, className)} {...rest}>
      {media ? <div className={styles.media}>{media}</div> : null}
      <div className={styles.headings}>
        <H className={styles.title}>{title}</H>
        {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
      </div>
      {actions ? <div className={styles.actions}>{actions}</div> : null}
    </div>
  );
});

export const CardBody = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function CardBody({ className, ...rest }, ref) {
  return <div ref={ref} className={cx(styles.body, className)} {...rest} />;
});

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  /** @default 'end' */
  justify?: 'start' | 'end' | 'between';
}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(function CardFooter({ justify = 'end', className, ...rest }, ref) {
  return <div ref={ref} data-justify={justify} className={cx(styles.footer, className)} {...rest} />;
});

export interface CardImageProps extends HTMLAttributes<HTMLDivElement> {
  /** Width / height ratio. @default 16 / 9 */
  ratio?: number;
}

/** Full-bleed media slot at the top of a card (put an <img> with meaningful alt or alt="" inside). */
export const CardImage = forwardRef<HTMLDivElement, CardImageProps>(function CardImage({ ratio = 16 / 9, className, style, ...rest }, ref) {
  return <div ref={ref} className={cx(styles.image, className)} style={{ aspectRatio: String(ratio), ...style }} {...rest} />;
});

/** Native link whose hit area covers the whole card. Other interactive elements in the card stay clickable above it. */
export const CardLink = forwardRef<HTMLAnchorElement, AnchorHTMLAttributes<HTMLAnchorElement>>(function CardLink({ className, children, ...rest }, ref) {
  return (
    <a ref={ref} className={cx(styles.link, className)} {...rest}>
      {children}
    </a>
  );
});