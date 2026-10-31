import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx, type CSSVariables } from '../../utils';
import { Skeleton } from './Skeleton';
import { SkeletonAnimationContext, useSkeletonAnimation, type SkeletonAnimation } from './SkeletonContext';
import styles from './SkeletonPresets.module.css';

/** Props shared by every skeleton preset. */
export interface SkeletonPresetProps extends HTMLAttributes<HTMLDivElement> {
  /** Loading effect for the whole preset. Inherited from SkeletonGroup when omitted. */
  animation?: SkeletonAnimation;
}

// Deterministic patterns (no Math.random): server and client markup must match.
const LINE_WIDTHS = ['100%', '96%', '92%', '98%', '90%', '94%'];
const TITLE_WIDTHS = ['55%', '70%', '45%', '62%', '50%', '66%'];
const SUBTITLE_WIDTHS = ['35%', '45%', '30%', '40%', '38%', '28%'];
const LABEL_WIDTHS = ['30%', '40%', '25%', '35%', '45%'];
const CELL_WIDTHS = ['70%', '50%', '85%', '40%', '60%', '75%', '55%'];
const BAR_HEIGHTS = [55, 80, 40, 95, 65, 30, 75, 50, 85, 45, 70, 60];
const AVATAR_SIZES = { xs: '1.5rem', sm: '2rem', md: '2.5rem', lg: '3rem', xl: '4rem' } as const;
const CONTROL_HEIGHT = 'var(--dc-density-control-height-md)';
const CONTROL_HEIGHT_SM = 'var(--dc-density-control-height-sm)';

const pick = <T,>(list: readonly T[], i: number): T => list[i % list.length] as T;
const count = (n: number) => Array.from({ length: Math.max(0, Math.floor(n)) }, (_, i) => i);

interface RootProps extends SkeletonPresetProps {
  part: string;
  children?: ReactNode;
}

const Root = forwardRef<HTMLDivElement, RootProps>(function Root({ part, animation, className, children, ...rest }, ref) {
  const anim = useSkeletonAnimation(animation);
  return (
    <div ref={ref} aria-hidden="true" data-skeleton={part} data-animation={anim} className={cx(styles[part], className)} {...rest}>
      <SkeletonAnimationContext.Provider value={anim}>{children}</SkeletonAnimationContext.Provider>
    </div>
  );
});

/* ---------------------------------------------------------------- Text */

export interface SkeletonTextProps extends SkeletonPresetProps {
  /** Paragraph lines; the last one is shorter. @default 3 */
  lines?: number;
  /** Adds a heading line above the paragraph. @default false */
  heading?: boolean;
}

/** Paragraph placeholder with an optional heading. */
export const SkeletonText = forwardRef<HTMLDivElement, SkeletonTextProps>(function SkeletonText(
  { lines = 3, heading = false, ...rest },
  ref,
) {
  return (
    <Root ref={ref} part="text" {...rest}>
      {heading && <Skeleton className={styles.heading} width="45%" />}
      {count(lines).map((i) => (
        <Skeleton key={i} width={lines > 1 && i === lines - 1 ? '62%' : pick(LINE_WIDTHS, i)} />
      ))}
    </Root>
  );
});

/* -------------------------------------------------------------- Avatar */

export type SkeletonAvatarSize = keyof typeof AVATAR_SIZES;

export interface SkeletonAvatarProps extends SkeletonPresetProps {
  /** Same scale as Avatar. @default 'md' */
  size?: SkeletonAvatarSize;
  /** Text lines beside the avatar ("media object"); 0 renders the circle only. @default 0 */
  lines?: number;
}

function MediaLines({ lines, offset = 0 }: { lines: number; offset?: number }) {
  return (
    <div className={styles.mediaText}>
      {count(lines).map((i) => (
        <Skeleton key={i} className={i > 0 ? styles.small : undefined} width={pick(i === 0 ? TITLE_WIDTHS : SUBTITLE_WIDTHS, i + offset)} />
      ))}
    </div>
  );
}

/** Avatar placeholder, optionally with name/subtitle lines beside it. */
export const SkeletonAvatar = forwardRef<HTMLDivElement, SkeletonAvatarProps>(function SkeletonAvatar(
  { size = 'md', lines = 0, ...rest },
  ref,
) {
  return (
    <Root ref={ref} part="avatar" data-size={size} {...rest}>
      <Skeleton shape="circle" width={AVATAR_SIZES[size]} />
      {lines > 0 && <MediaLines lines={lines} />}
    </Root>
  );
});

/* ---------------------------------------------------------------- Card */

export interface SkeletonCardProps extends SkeletonPresetProps {
  /** Shows a full-bleed media area on top. @default false */
  media?: boolean;
  /** CSS aspect ratio of the media area. @default '16 / 9' */
  mediaRatio?: string;
  /** Header with avatar + title/subtitle instead of a plain title. @default false */
  avatar?: boolean;
  /** Title line. @default true */
  heading?: boolean;
  /** Body text lines. @default 3 */
  lines?: number;
  /** Footer action buttons. @default 0 */
  actions?: number;
}

/** Card placeholder matching Card/ArticleCard/EventCard: media, header, text and actions. */
export const SkeletonCard = forwardRef<HTMLDivElement, SkeletonCardProps>(function SkeletonCard(
  { media = false, mediaRatio = '16 / 9', avatar = false, heading = true, lines = 3, actions = 0, ...rest },
  ref,
) {
  return (
    <Root ref={ref} part="card" {...rest}>
      {media && <Skeleton shape="rect" radius="none" height="auto" className={styles.cardMedia} style={{ aspectRatio: mediaRatio }} />}
      <div className={styles.cardBody}>
        {avatar ? (
          <div className={styles.media}>
            <Skeleton shape="circle" width={AVATAR_SIZES.md} />
            <MediaLines lines={2} />
          </div>
        ) : (
          heading && <Skeleton className={styles.title} width="60%" />
        )}
        {lines > 0 && (
          <div className={styles.lines}>
            {count(lines).map((i) => (
              <Skeleton key={i} width={lines > 1 && i === lines - 1 ? '62%' : pick(LINE_WIDTHS, i)} />
            ))}
          </div>
        )}
        {actions > 0 && (
          <div className={styles.actions}>
            {count(actions).map((i) => (
              <Skeleton key={i} shape="rect" radius="control" width="6rem" height={CONTROL_HEIGHT} />
            ))}
          </div>
        )}
      </div>
    </Root>
  );
});

/* ---------------------------------------------------------------- List */

export interface SkeletonListProps extends SkeletonPresetProps {
  /** Number of rows. @default 4 */
  rows?: number;
  /** Leading visual. @default 'avatar' */
  leading?: 'avatar' | 'icon' | 'none';
  /** Trailing action (button/badge) on each row. @default false */
  trailing?: boolean;
  /** Divider between rows. @default true */
  dividers?: boolean;
  /** `card` adds border and inner padding like PostList variant="card". @default 'plain' */
  variant?: 'plain' | 'card';
}

/** List placeholder (PostList, ListBox, DiscussionList): leading visual, two lines, optional action. */
export const SkeletonList = forwardRef<HTMLDivElement, SkeletonListProps>(function SkeletonList(
  { rows = 4, leading = 'avatar', trailing = false, dividers = true, variant = 'plain', ...rest },
  ref,
) {
  return (
    <Root ref={ref} part="list" data-variant={variant} data-dividers={dividers || undefined} {...rest}>
      {count(rows).map((i) => (
        <div key={i} className={styles.listRow} data-part="row">
          {leading === 'avatar' && <Skeleton shape="circle" width={AVATAR_SIZES.md} />}
          {leading === 'icon' && <Skeleton shape="rect" width="2rem" height="2rem" radius="md" className={styles.noShrink} />}
          <div className={styles.mediaText}>
            <Skeleton width={pick(TITLE_WIDTHS, i)} />
            <Skeleton className={styles.small} width={pick(SUBTITLE_WIDTHS, i)} />
          </div>
          {trailing && <Skeleton shape="rect" radius="control" width="4.5rem" height={CONTROL_HEIGHT_SM} className={styles.noShrink} />}
        </div>
      ))}
    </Root>
  );
});

/* --------------------------------------------------------------- Table */

export interface SkeletonTableProps extends SkeletonPresetProps {
  /** Body rows. @default 5 */
  rows?: number;
  /** Columns; the first one is wider. @default 4 */
  columns?: number;
  /** Header row. @default true */
  header?: boolean;
  /**
   * Narrow containers (< 30rem): `collapse` keeps the first two columns, `scroll` keeps all
   * columns and scrolls horizontally inside the table. @default 'collapse'
   */
  responsive?: 'collapse' | 'scroll';
}

/** Table placeholder matching Table/DataTable cell padding (density-aware). */
export const SkeletonTable = forwardRef<HTMLDivElement, SkeletonTableProps>(function SkeletonTable(
  { rows = 5, columns = 4, header = true, responsive = 'collapse', style, ...rest },
  ref,
) {
  const cols = Math.max(1, Math.floor(columns));
  const vars: CSSVariables = {
    ...style,
    '--_cols': String(cols),
    '--_tpl': cols > 1 ? `minmax(0, 1.5fr) repeat(${cols - 1}, minmax(0, 1fr))` : 'minmax(0, 1fr)',
    '--_tpl-narrow': cols > 1 ? 'minmax(0, 1.5fr) minmax(0, 1fr)' : 'minmax(0, 1fr)',
  };
  const row = (r: number, isHeader: boolean) => (
    <div key={isHeader ? 'h' : r} className={styles.tableRow} data-part={isHeader ? 'header' : 'row'}>
      {count(cols).map((c) => (
        <div key={c} className={styles.tableCell} data-part="cell" data-extra={c >= 2 || undefined}>
          <Skeleton className={isHeader ? styles.small : undefined} width={isHeader ? pick(LABEL_WIDTHS, c + 2) : pick(CELL_WIDTHS, r * cols + c)} />
        </div>
      ))}
    </div>
  );
  return (
    <Root ref={ref} part="table" data-responsive={responsive} style={vars} {...rest}>
      <div className={styles.tableInner}>
        {header && row(0, true)}
        {count(rows).map((r) => row(r, false))}
      </div>
    </Root>
  );
});

/* ----------------------------------------------------------------- KPI */

export interface SkeletonKpiProps extends SkeletonPresetProps {
  /** Sparkline area under the value. @default false */
  sparkline?: boolean;
  /** Icon badge at the end of the label row. @default false */
  icon?: boolean;
}

function sparkPath(points: readonly number[], close: boolean): string {
  const step = 100 / (points.length - 1);
  const y = (p: number) => 100 - p;
  let d = `M0 ${y(points[0] ?? 50)}`;
  for (let i = 1; i < points.length; i++) {
    const x0 = (i - 1) * step;
    const x1 = i * step;
    d += ` C${x0 + step / 2} ${y(points[i - 1] ?? 50)} ${x1 - step / 2} ${y(points[i] ?? 50)} ${x1} ${y(points[i] ?? 50)}`;
  }
  return close ? `${d} L100 100 L0 100 Z` : d;
}

function Wave({ fill, className }: { fill?: boolean; className?: string }) {
  const anim = useSkeletonAnimation();
  const pts = BAR_HEIGHTS.slice(0, 8).map((h) => 10 + h * 0.8);
  return (
    <svg className={cx(styles.svg, className)} data-animation={anim} viewBox="0 0 100 100" preserveAspectRatio="none" focusable="false">
      {fill && <path className={styles.area} d={sparkPath(pts, true)} />}
      <path className={styles.line} d={sparkPath(pts, false)} />
    </svg>
  );
}

/** KpiCard placeholder: label, large value, trend chip and optional sparkline. */
export const SkeletonKpi = forwardRef<HTMLDivElement, SkeletonKpiProps>(function SkeletonKpi(
  { sparkline = false, icon = false, ...rest },
  ref,
) {
  return (
    <Root ref={ref} part="kpi" {...rest}>
      <div className={styles.kpiTop}>
        <Skeleton className={styles.kpiLabel} width="45%" />
        {icon && <Skeleton shape="circle" width={AVATAR_SIZES.md} />}
      </div>
      <Skeleton className={styles.value} width="55%" />
      <Skeleton shape="rect" radius="full" width="4.5rem" height="1.5rem" />
      {sparkline && <Wave className={styles.spark} />}
    </Root>
  );
});

/* --------------------------------------------------------------- Chart */

export type SkeletonChartVariant = 'bar' | 'line' | 'area' | 'donut';

export interface SkeletonChartProps extends SkeletonPresetProps {
  /** Chart shape to imitate. @default 'bar' */
  variant?: SkeletonChartVariant;
  /** Plot height (CSS length). @default '12rem' */
  height?: string;
  /** Bars for variant="bar" (max 12). @default 7 */
  bars?: number;
}

/** Chart placeholder (BarChart, LineChart, DonutChart…): axes with bars, a wavy line, an area or a ring. */
export const SkeletonChart = forwardRef<HTMLDivElement, SkeletonChartProps>(function SkeletonChart(
  { variant = 'bar', height = '12rem', bars = 7, style, ...rest },
  ref,
) {
  const vars: CSSVariables = { ...style, '--_plot-h': height };
  let body: ReactNode;
  if (variant === 'donut') {
    body = (
      <div className={styles.donutWrap}>
        <span className={styles.donut} data-part="ring" />
        <div className={styles.legend}>
          {count(4).map((i) => (
            <div key={i} className={styles.legendItem}>
              <Skeleton shape="circle" width="0.75rem" />
              <Skeleton className={styles.small} width={pick(TITLE_WIDTHS, i)} />
            </div>
          ))}
        </div>
      </div>
    );
  } else {
    body = (
      <div className={styles.plotWrap}>
        <div className={styles.yAxis}>
          {count(4).map((i) => (
            <Skeleton key={i} className={styles.tick} width="1.75rem" />
          ))}
        </div>
        <div className={styles.plot}>
          {variant === 'bar' ? (
            count(Math.min(12, bars)).map((i) => (
              <Skeleton key={i} shape="rect" radius="sm" className={styles.bar} data-part="bar" height={`${pick(BAR_HEIGHTS, i)}%`} />
            ))
          ) : (
            <Wave fill={variant === 'area'} className={styles.plotSvg} />
          )}
        </div>
      </div>
    );
  }
  return (
    <Root ref={ref} part="chart" data-variant={variant} style={vars} {...rest}>
      {body}
    </Root>
  );
});

/* ---------------------------------------------------------------- Form */

export interface SkeletonFormProps extends SkeletonPresetProps {
  /** Single-line fields (label + input). @default 3 */
  fields?: number;
  /** Adds a multi-line field (textarea). @default false */
  textarea?: boolean;
  /** Submit button at the end. @default true */
  action?: boolean;
}

/** Form placeholder using density tokens for field gap, form gap and control height. */
export const SkeletonForm = forwardRef<HTMLDivElement, SkeletonFormProps>(function SkeletonForm(
  { fields = 3, textarea = false, action = true, ...rest },
  ref,
) {
  const field = (i: number, height: string) => (
    <div key={i} className={styles.field} data-part="field">
      <Skeleton className={styles.label} width={pick(LABEL_WIDTHS, i)} />
      <Skeleton shape="rect" radius="control" height={height} />
    </div>
  );
  return (
    <Root ref={ref} part="form" {...rest}>
      {count(fields).map((i) => field(i, CONTROL_HEIGHT))}
      {textarea && field(fields, '6rem')}
      {action && <Skeleton shape="rect" radius="control" width="8rem" height={CONTROL_HEIGHT} />}
    </Root>
  );
});

/* ---------------------------------------------------------------- Page */

export interface SkeletonPageProps extends SkeletonPresetProps {
  /** Cards in the grid. @default 6 */
  cards?: number;
  /** Toolbar with search field and buttons. @default true */
  toolbar?: boolean;
}

/** Full-page placeholder: page header, toolbar and a responsive grid of cards. */
export const SkeletonPage = forwardRef<HTMLDivElement, SkeletonPageProps>(function SkeletonPage(
  { cards = 6, toolbar = true, ...rest },
  ref,
) {
  return (
    <Root ref={ref} part="page" {...rest}>
      <div className={styles.pageHeader}>
        <Skeleton className={styles.pageTitle} width="40%" />
        <Skeleton width="65%" />
      </div>
      {toolbar && (
        <div className={styles.toolbar}>
          <Skeleton shape="rect" radius="control" height={CONTROL_HEIGHT} className={styles.search} />
          <Skeleton shape="rect" radius="control" width="6rem" height={CONTROL_HEIGHT} className={styles.noShrink} />
          <Skeleton shape="rect" radius="control" width="6rem" height={CONTROL_HEIGHT} className={styles.noShrink} />
        </div>
      )}
      <div className={styles.grid}>
        {count(cards).map((i) => (
          <SkeletonCard key={i} media lines={2} />
        ))}
      </div>
    </Root>
  );
});

/* ------------------------------------------------------------- Profile */

export interface SkeletonProfileProps extends SkeletonPresetProps {
  /** Tag chips under the role. @default 3 */
  tags?: number;
  /** Stat columns (talks, followers…). @default 3 */
  stats?: number;
  /** Action buttons at the bottom. @default 1 */
  actions?: number;
}

/** ProfileCard placeholder: top band, large avatar, name, role, tags, stats and actions (centered). */
export const SkeletonProfile = forwardRef<HTMLDivElement, SkeletonProfileProps>(function SkeletonProfile(
  { tags = 3, stats = 3, actions = 1, ...rest },
  ref,
) {
  return (
    <Root ref={ref} part="profile" {...rest}>
      <Skeleton shape="rect" radius="none" height="4.5rem" className={styles.profileBand} data-part="band" />
      <Skeleton shape="circle" width={AVATAR_SIZES.xl} className={styles.profileAvatar} />
      <Skeleton className={styles.title} width="55%" />
      <Skeleton className={styles.small} width="70%" />
      {tags > 0 && (
        <div className={styles.chips}>
          {count(tags).map((i) => (
            <Skeleton key={i} shape="rect" radius="full" width={pick(['4rem', '5.5rem', '3.5rem', '4.5rem'], i)} height="1.5rem" />
          ))}
        </div>
      )}
      {stats > 0 && (
        <div className={styles.profileStats}>
          {count(stats).map((i) => (
            <div key={i} className={styles.profileStat}>
              <Skeleton className={styles.small} width="70%" />
              <Skeleton className={styles.label} width="50%" />
            </div>
          ))}
        </div>
      )}
      {actions > 0 && (
        <div className={styles.actions}>
          {count(actions).map((i) => (
            <Skeleton key={i} shape="rect" radius="control" width="7rem" height={CONTROL_HEIGHT_SM} />
          ))}
        </div>
      )}
    </Root>
  );
});

/* ------------------------------------------------------------ Comments */

export interface SkeletonCommentProps extends SkeletonPresetProps {
  /** Top-level comments. @default 3 */
  rows?: number;
  /** Indented replies under the first comment. @default 0 */
  replies?: number;
  /** Text lines per comment. @default 2 */
  lines?: number;
  /** Row of small actions (reply, like) under each comment. @default true */
  actions?: boolean;
}

/** Comment thread / activity feed placeholder: avatar, author and time, text and small actions; optional replies. */
export const SkeletonComment = forwardRef<HTMLDivElement, SkeletonCommentProps>(function SkeletonComment(
  { rows = 3, replies = 0, lines = 2, actions = true, ...rest },
  ref,
) {
  const comment = (i: number, isReply: boolean) => (
    <div key={`${isReply ? 'r' : 'c'}${i}`} className={styles.comment} data-part={isReply ? 'reply' : 'comment'} data-reply={isReply || undefined}>
      <Skeleton shape="circle" width={isReply ? AVATAR_SIZES.sm : AVATAR_SIZES.md} />
      <div className={styles.commentBody}>
        <div className={styles.commentHead}>
          <Skeleton width={pick(['7rem', '9rem', '6rem', '8rem'], i)} />
          <Skeleton className={styles.small} width="4rem" />
        </div>
        {count(lines).map((l) => (
          <Skeleton key={l} width={lines > 1 && l === lines - 1 ? pick(['55%', '70%', '40%'], i) : pick(LINE_WIDTHS, i + l)} />
        ))}
        {actions && (
          <div className={styles.commentActions}>
            <Skeleton className={styles.small} width="3rem" />
            <Skeleton className={styles.small} width="3.5rem" />
          </div>
        )}
      </div>
    </div>
  );
  return (
    <Root ref={ref} part="comments" {...rest}>
      {count(rows).map((i) => (
        <div key={i} className={styles.commentGroup}>
          {comment(i, false)}
          {i === 0 && count(replies).map((r) => comment(r + 1, true))}
        </div>
      ))}
    </Root>
  );
});

/* -------------------------------------------------------------- Kanban */

export interface SkeletonKanbanProps extends SkeletonPresetProps {
  /** Columns. @default 3 */
  columns?: number;
  /** Cards per column (varies slightly per column). @default 3 */
  cards?: number;
}

/** Board placeholder: columns with header and count, then cards with title, text and a footer. Columns scroll on narrow screens. */
export const SkeletonKanban = forwardRef<HTMLDivElement, SkeletonKanbanProps>(function SkeletonKanban(
  { columns = 3, cards = 3, ...rest },
  ref,
) {
  return (
    <Root ref={ref} part="kanban" {...rest}>
      {count(columns).map((c) => (
        <div key={c} className={styles.kanbanColumn} data-part="column">
          <div className={styles.kanbanHead}>
            <Skeleton className={styles.label} width={pick(['45%', '60%', '50%'], c)} />
            <Skeleton shape="rect" radius="full" width="1.75rem" height="1.25rem" />
          </div>
          {count(Math.max(1, cards - (c % 2))).map((k) => (
            <div key={k} className={styles.kanbanCard} data-part="card">
              <Skeleton width={pick(TITLE_WIDTHS, c + k)} />
              <Skeleton className={styles.small} width={pick(LINE_WIDTHS, c * 2 + k)} />
              <div className={styles.kanbanFoot}>
                <Skeleton shape="rect" radius="full" width="3.5rem" height="1.25rem" />
                <Skeleton shape="circle" width={AVATAR_SIZES.xs} />
              </div>
            </div>
          ))}
        </div>
      ))}
    </Root>
  );
});
