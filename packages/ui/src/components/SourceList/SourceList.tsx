import { forwardRef, useId, type HTMLAttributes, type ReactNode } from 'react';
import { useMessages } from '../../i18n/LocaleProvider';
import { cx } from '../../utils';
import { Link } from '../Typography/Typography';
import styles from './SourceList.module.css';

export interface SourceReference {
  id: string;
  title: string;
  href: string;
  description?: ReactNode;
}

export interface SourceListProps extends HTMLAttributes<HTMLElement> {
  sources: readonly SourceReference[];
  label?: ReactNode;
}

/** Source links supplied and verified by the consumer; no retrieval or trust scoring. */
export const SourceList = forwardRef<HTMLElement, SourceListProps>(function SourceList(
  { sources, label, className, ...rest },
  ref,
) {
  const t = useMessages();
  const labelId = useId();
  return (
    <section ref={ref} aria-labelledby={labelId} {...rest} className={cx(styles.sources, className)}>
      <div id={labelId} className={styles.label}>{label ?? t.aiSources}</div>
      <ol className={styles.list}>
        {sources.map((source) => (
          <li key={source.id}>
            <Link href={source.href}>{source.title}</Link>
            {source.description ? <div className={styles.description}>{source.description}</div> : null}
          </li>
        ))}
      </ol>
    </section>
  );
});
