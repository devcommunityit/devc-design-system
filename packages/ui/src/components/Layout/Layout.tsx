import { createElement, forwardRef, useId, type HTMLAttributes, type ReactNode } from 'react';
import { Separator, type SeparatorProps } from 'react-aria-components';
import { cx, type CSSVariables } from '../../utils';
import type { SpaceStep } from '../Stack/Stack';
import styles from './Layout.module.css';

/* ------------------------------------------------------------------ Container */

export type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'prose' | 'full';

export interface ContainerProps extends HTMLAttributes<HTMLElement> {
  /** Max inline size from the `container.*` tokens. @default 'xl' */
  size?: ContainerSize;
  /** Element to render. @default 'div' */
  as?: 'div' | 'main' | 'section' | 'article' | 'header' | 'footer';
  /** Remove the fluid inline padding. */
  disableGutters?: boolean;
}

/** Centers content with a max width and fluid side padding (mobile-first). */
export const Container = forwardRef<HTMLElement, ContainerProps>(function Container(
  { size = 'xl', as = 'div', disableGutters, className, ...rest },
  ref,
) {
  return createElement(as, {
    ref,
    'data-size': size,
    'data-gutters': disableGutters ? 'none' : undefined,
    className: cx(styles.container, className),
    ...rest,
  });
});

/* ------------------------------------------------------------------ Grid */

export type GridColumns = 1 | 2 | 3 | 4 | 5 | 6 | 12;
export interface ResponsiveColumns {
  base?: GridColumns;
  sm?: GridColumns;
  md?: GridColumns;
  lg?: GridColumns;
  xl?: GridColumns;
}

export interface GridProps extends HTMLAttributes<HTMLElement> {
  /** Fixed or responsive column count (`{ base: 1, md: 2, lg: 4 }`; breakpoints sm 640, md 768, lg 1024, xl 1280 px). @default 1 */
  columns?: GridColumns | ResponsiveColumns;
  /** Auto-fit as many columns as fit with this minimum width (e.g. `'16rem'`). Overrides `columns`. */
  minItemWidth?: string;
  /** Spacing step for row and column gap. @default 4 */
  gap?: SpaceStep;
  /** Row gap, if different from `gap`. */
  rowGap?: SpaceStep;
  /** @default 'div' */
  as?: 'div' | 'ul' | 'ol' | 'section';
}

const gridBreakpoints = ['base', 'sm', 'md', 'lg', 'xl'] as const;

/** CSS grid with responsive column counts or intrinsic auto-fit columns. */
export const Grid = forwardRef<HTMLElement, GridProps>(function Grid(
  { columns = 1, minItemWidth, gap = 4, rowGap, as = 'div', className, style, ...rest },
  ref,
) {
  const vars: CSSVariables = { '--_gap': `var(--dc-space-${gap})`, '--_row-gap': `var(--dc-space-${rowGap ?? gap})` };
  if (minItemWidth) {
    vars['--_min'] = minItemWidth;
  } else {
    const resolved: ResponsiveColumns = typeof columns === 'number' ? { base: columns } : columns;
    let last: GridColumns = 1;
    for (const bp of gridBreakpoints) {
      const value = resolved[bp];
      if (value !== undefined) last = value;
      vars[`--_cols-${bp}`] = String(last);
    }
  }
  return createElement(as, {
    ref,
    'data-mode': minItemWidth ? 'auto' : 'columns',
    className: cx(styles.grid, className),
    style: { ...vars, ...style },
    ...rest,
  });
});

export interface GridItemProps extends HTMLAttributes<HTMLElement> {
  /** Columns spanned; `'full'` spans the whole row. Below 640px a spanning item takes the full row. */
  span?: number | 'full';
  /** @default 'div' */
  as?: 'div' | 'li' | 'section' | 'article';
}

/** Optional grid child that spans several columns. */
export const GridItem = forwardRef<HTMLElement, GridItemProps>(function GridItem({ span, as = 'div', className, style, ...rest }, ref) {
  const vars: CSSVariables = span === undefined ? {} : { '--_span': span === 'full' ? '1 / -1' : `span ${span}` };
  return createElement(as, { ref, className: cx(styles.gridItem, className), style: { ...vars, ...style }, 'data-span': span, ...rest });
});

/* ------------------------------------------------------------------ Section */

export interface SectionProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Visible heading; also names the region via aria-labelledby. */
  title?: ReactNode;
  /** Heading level of `title`. @default 2 */
  headingLevel?: 2 | 3 | 4;
  description?: ReactNode;
  /** Actions aligned with the header (buttons, links). */
  actions?: ReactNode;
  /** Vertical padding. @default 'md' */
  spacing?: 'none' | 'sm' | 'md' | 'lg';
  /** Background surface. @default 'none' */
  surface?: 'none' | 'subtle' | 'raised';
  /**
   * Wraps header and content in a `Container` of this size, so the surface can span the full
   * width while text stays aligned with the rest of the page. Omit when the Section is already
   * inside a Container.
   */
  container?: ContainerSize;
}

/** Semantic `<section>` with an optional header (title, description, actions) and vertical rhythm. */
export const Section = forwardRef<HTMLElement, SectionProps>(function Section(
  { title, headingLevel = 2, description, actions, spacing = 'md', surface = 'none', container, className, children, ...rest },
  ref,
) {
  const id = useId();
  const headingId = title ? `${id}-title` : undefined;
  const hasHeader = Boolean(title || description || actions);
  const content = (
    <>
      {hasHeader ? (
        <div className={styles.sectionHeader}>
          <div className={styles.sectionHeading}>
            {title ? createElement(`h${headingLevel}`, { id: headingId, className: styles.sectionTitle }, title) : null}
            {description ? <p className={styles.sectionDescription}>{description}</p> : null}
          </div>
          {actions ? <div className={styles.sectionActions}>{actions}</div> : null}
        </div>
      ) : null}
      {children}
    </>
  );
  return (
    <section
      ref={ref}
      aria-labelledby={rest['aria-label'] ? undefined : headingId}
      data-spacing={spacing}
      data-surface={surface}
      className={cx(styles.section, className)}
      {...rest}
    >
      {container ? (
        <Container size={container} className={styles.sectionContainer}>
          {content}
        </Container>
      ) : (
        content
      )}
    </section>
  );
});

/* ------------------------------------------------------------------ Spacer */

export interface SpacerProps extends HTMLAttributes<HTMLSpanElement> {
  /** Fixed size (spacing step). Without it the spacer grows to fill a flex container. */
  size?: SpaceStep;
  /** @default 'vertical' */
  axis?: 'vertical' | 'horizontal';
}

/** Empty, presentational space. Prefer `gap` on Stack/Inline/Grid; use Spacer to push items apart. */
export const Spacer = forwardRef<HTMLSpanElement, SpacerProps>(function Spacer({ size, axis = 'vertical', className, style, ...rest }, ref) {
  const vars: CSSVariables = size === undefined ? {} : { '--_size': `var(--dc-space-${size})` };
  return (
    <span
      ref={ref}
      aria-hidden="true"
      data-axis={axis}
      data-flex={size === undefined || undefined}
      className={cx(styles.spacer, className)}
      style={{ ...vars, ...style }}
      {...rest}
    />
  );
});

/* ------------------------------------------------------------------ Divider */

export interface DividerProps extends Omit<SeparatorProps, 'children' | 'style' | 'className'> {
  /** Optional text in the middle (horizontal only), e.g. "oppure". */
  label?: ReactNode;
  /** Spacing step around the line. @default 0 */
  spacing?: SpaceStep;
  className?: string;
  style?: CSSVariables;
}

/** Visual and semantic separator (`<hr>` / role="separator"). Supports horizontal and vertical orientation. */
export const Divider = forwardRef<HTMLElement, DividerProps>(function Divider(
  { label, spacing = 0, orientation = 'horizontal', className, style, ...rest },
  ref,
) {
  const vars: CSSVariables = { '--_spacing': `var(--dc-space-${spacing})`, ...style };
  if (label && orientation === 'horizontal') {
    return (
      <div className={cx(styles.dividerLabelled, className)} style={vars}>
        <Separator ref={ref} elementType="div" className={styles.dividerLine} {...rest} />
        <span className={styles.dividerText}>{label}</span>
        <span className={styles.dividerLine} aria-hidden="true" />
      </div>
    );
  }
  return (
    <Separator
      ref={ref}
      orientation={orientation}
      className={cx(styles.divider, className)}
      data-orientation={orientation}
      style={vars}
      {...rest}
    />
  );
});

/* ------------------------------------------------------------------ AspectRatio */

export interface AspectRatioProps extends HTMLAttributes<HTMLDivElement> {
  /** Width / height, e.g. `16 / 9`. @default 1 */
  ratio?: number;
}

/** Keeps a fixed aspect ratio; images, videos and iframes inside cover the box. */
export const AspectRatio = forwardRef<HTMLDivElement, AspectRatioProps>(function AspectRatio({ ratio = 1, className, style, ...rest }, ref) {
  const vars: CSSVariables = { '--_ratio': String(ratio) };
  return <div ref={ref} className={cx(styles.aspectRatio, className)} style={{ ...vars, ...style }} {...rest} />;
});
