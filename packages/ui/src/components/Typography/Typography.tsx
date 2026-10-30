import { createElement, forwardRef, Fragment, type HTMLAttributes, type LiHTMLAttributes, type ReactNode } from 'react';
import { Link as RACLink, composeRenderProps, type LinkProps as RACLinkProps } from 'react-aria-components';
import { ExternalLink } from 'lucide-react';
import { useMessages } from '../../i18n/LocaleProvider';
import { cx } from '../../utils';
import styles from './Typography.module.css';

export type TypographyRole =
  | 'display'
  | 'headline-lg'
  | 'headline-md'
  | 'headline-sm'
  | 'title-lg'
  | 'title-md'
  | 'title-sm'
  | 'body-lg'
  | 'body-md'
  | 'body-sm'
  | 'label-lg'
  | 'label-md'
  | 'label-sm';

export type TextTone = 'primary' | 'secondary' | 'muted' | 'link' | 'danger' | 'success' | 'warning' | 'inherit';
export type TextWeight = 'regular' | 'medium' | 'semibold' | 'bold';

/* ------------------------------------------------------------------ Text */

export interface TextProps extends HTMLAttributes<HTMLElement> {
  /** Typography role from the type scale. @default 'body-md' */
  variant?: TypographyRole;
  /** @default 'primary' */
  tone?: TextTone;
  weight?: TextWeight;
  /** @default 'p' */
  as?: 'p' | 'span' | 'div' | 'strong' | 'em' | 'small' | 'label';
  /** Single-line ellipsis. The full text is lost visually: for important content use `Truncate`. */
  truncate?: boolean;
  align?: 'start' | 'center' | 'end';
  /** Associates a `<label>` with a control (only when `as="label"`). */
  htmlFor?: string;
}

/** Body and UI text using the semantic type scale. */
export const Text = forwardRef<HTMLElement, TextProps>(function Text(
  { variant = 'body-md', tone = 'primary', weight, as = 'p', truncate, align, className, ...rest },
  ref,
) {
  return createElement(as, {
    ref,
    'data-variant': variant,
    'data-tone': tone,
    'data-weight': weight,
    'data-truncate': truncate || undefined,
    'data-align': align,
    className: cx(styles.text, className),
    ...rest,
  });
});

/* ------------------------------------------------------------------ Heading */

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  /** Semantic level (document outline). */
  level: 1 | 2 | 3 | 4 | 5 | 6;
  /** Visual size, independent from the level. Defaults by level (1 → headline-lg … 6 → title-sm). */
  size?: Extract<TypographyRole, 'display' | `headline-${string}` | `title-${string}`>;
  tone?: TextTone;
  align?: 'start' | 'center' | 'end';
  /** Two-tone gradient fill (brand → tertiary). Decorative emphasis only; falls back to solid text in forced-colors. @default false */
  gradient?: boolean;
}

const defaultHeadingSize = {
  1: 'headline-lg',
  2: 'headline-md',
  3: 'headline-sm',
  4: 'title-lg',
  5: 'title-md',
  6: 'title-sm',
} as const;

/** Semantic heading (`h1`–`h6`) whose visual size can differ from its level. */
export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(function Heading(
  { level, size, tone = 'primary', align, gradient = false, className, ...rest },
  ref,
) {
  return createElement(`h${level}`, {
    ref,
    'data-variant': size ?? defaultHeadingSize[level],
    'data-tone': tone,
    'data-align': align,
    'data-gradient': gradient || undefined,
    className: cx(styles.text, styles.heading, className),
    ...rest,
  });
});

/* ------------------------------------------------------------------ Link */

export interface LinkProps extends RACLinkProps {
  /** `inline` = underlined inside text; `standalone` = no underline until hover (navigation lists). @default 'inline' */
  variant?: 'inline' | 'standalone';
  /** Opens in a new tab with `rel="noopener noreferrer"`, an icon and localized hidden text. */
  external?: boolean;
}

/**
 * Real `<a href>` (RAC Link). Client-side routing works through RAC `RouterProvider`;
 * no router dependency. Without `href` it renders a `<span role="link">`: prefer Button for actions.
 */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { variant = 'inline', external, className, children, target, rel, ...rest },
  ref,
) {
  const messages = useMessages();
  return (
    <RACLink
      ref={ref}
      data-variant={variant}
      target={external ? '_blank' : target}
      rel={external ? cx('noopener noreferrer', rel) : rel}
      className={composeRenderProps(className, (cn) => cx(styles.link, cn))}
      {...rest}
    >
      {composeRenderProps(children, (content) => (
        <>
          {content}
          {external ? (
            <>
              <ExternalLink aria-hidden="true" className={styles.externalIcon} />
              <span className={styles.srOnly}> {messages.opensInNewTab}</span>
            </>
          ) : null}
        </>
      ))}
    </RACLink>
  );
});

/* ------------------------------------------------------------------ List */

export interface ListProps extends HTMLAttributes<HTMLUListElement | HTMLOListElement> {
  /** @default false */
  ordered?: boolean;
  /** `default` markers, `none` (keeps list semantics), `inline` (horizontal, wraps). @default 'default' */
  variant?: 'default' | 'none' | 'inline';
  /** Spacing step between items. @default 2 */
  gap?: 1 | 2 | 3 | 4;
  /** First number for ordered lists. */
  start?: number;
}

/** Semantic `<ul>`/`<ol>` with design-system spacing and markers. */
export const List = forwardRef<HTMLUListElement | HTMLOListElement, ListProps>(function List(
  { ordered, variant = 'default', gap = 2, className, ...rest },
  ref,
) {
  return createElement(ordered ? 'ol' : 'ul', {
    ref,
    'data-variant': variant,
    'data-gap': gap,
    // Safari drops list semantics when list-style is none; keep role explicit.
    role: variant === 'default' ? undefined : 'list',
    className: cx(styles.list, className),
    ...rest,
  });
});

export type ListItemProps = LiHTMLAttributes<HTMLLIElement>;

export const ListItem = forwardRef<HTMLLIElement, ListItemProps>(function ListItem({ className, ...rest }, ref) {
  return <li ref={ref} className={cx(styles.listItem, className)} {...rest} />;
});

/* ------------------------------------------------------------------ Quote */

export interface QuoteProps extends HTMLAttributes<HTMLElement> {
  /** Author / source shown in a `<figcaption>`. */
  attribution?: ReactNode;
  /** URL of the source (`cite` attribute). */
  cite?: string;
}

/**
 * `<blockquote>` inside a `<figure>`; the optional `attribution` is rendered as `<figcaption>`.
 * The ref and extra props go to the outer `<figure>`.
 */
export const Quote = forwardRef<HTMLElement, QuoteProps>(function Quote({ attribution, cite, className, children, ...rest }, ref) {
  return (
    <figure ref={ref} className={cx(styles.quoteFigure, className)} {...rest}>
      <blockquote cite={cite} className={styles.quote}>
        {children}
      </blockquote>
      {attribution ? <figcaption className={styles.quoteCaption}>{attribution}</figcaption> : null}
    </figure>
  );
});

/* ------------------------------------------------------------------ Code / Kbd */

export type CodeProps = HTMLAttributes<HTMLElement>;

/** Inline code (`<code>`). For multi-line snippets use CodeBlock. */
export const Code = forwardRef<HTMLElement, CodeProps>(function Code({ className, ...rest }, ref) {
  return <code ref={ref} className={cx(styles.code, className)} {...rest} />;
});

export interface KbdProps extends HTMLAttributes<HTMLElement> {
  /** Key combination, e.g. `['Ctrl', 'K']`; rendered as nested `<kbd>` elements. Alternatively pass children. */
  keys?: string[];
}

/** Keyboard key or shortcut (`<kbd>`). */
export const Kbd = forwardRef<HTMLElement, KbdProps>(function Kbd({ keys, className, children, ...rest }, ref) {
  if (keys?.length) {
    return (
      <kbd ref={ref} className={cx(styles.kbdCombo, className)} {...rest}>
        {keys.map((key, i) => (
          <Fragment key={`${key}-${i}`}>
            {i > 0 ? <span aria-hidden="true">+</span> : null}
            <kbd className={styles.kbd}>{key}</kbd>
          </Fragment>
        ))}
      </kbd>
    );
  }
  return (
    <kbd ref={ref} className={cx(styles.kbd, className)} {...rest}>
      {children}
    </kbd>
  );
});
