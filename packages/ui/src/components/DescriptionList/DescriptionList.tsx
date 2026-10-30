import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils';
import styles from './DescriptionList.module.css';

export interface DescriptionItem {
  /** Stable key; defaults to the index. */
  id?: string;
  term: ReactNode;
  /** `null`/`undefined`/empty string render the `emptyValue` placeholder. */
  description: ReactNode;
}

export interface DescriptionListProps extends HTMLAttributes<HTMLDListElement> {
  items: DescriptionItem[];
  /**
   * `stacked`: term above description. `inline`: term and description side by side
   * (stacks automatically on narrow containers). `grid`: responsive multi-column cards. @default 'inline'
   */
  layout?: 'stacked' | 'inline' | 'grid';
  /** Placeholder for missing values. @default '—' */
  emptyValue?: ReactNode;
  /** Show separators between rows. @default true */
  dividers?: boolean;
}

function isEmpty(value: ReactNode): boolean {
  return value === null || value === undefined || value === false || value === '';
}

/** Key/value pairs rendered with a native <dl>. */
export const DescriptionList = forwardRef<HTMLDListElement, DescriptionListProps>(function DescriptionList(
  { items, layout = 'inline', emptyValue = '—', dividers = true, className, ...rest },
  ref,
) {
  return (
    <dl ref={ref} data-layout={layout} data-dividers={dividers || undefined} className={cx(styles.list, className)} {...rest}>
      {items.map((item, i) => {
        const empty = isEmpty(item.description);
        return (
          <div key={item.id ?? i} className={styles.row}>
            <dt className={styles.term}>{item.term}</dt>
            <dd className={styles.description} data-empty={empty || undefined}>
              {empty ? emptyValue : item.description}
            </dd>
          </div>
        );
      })}
    </dl>
  );
});