import { forwardRef, type HTMLAttributes } from 'react';
import { useMessages } from '../../i18n/LocaleProvider';
import { cx } from '../../utils';
import styles from './SeoPreview.module.css';

export interface SeoPreviewProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title: string;
  url: string;
  description: string;
  siteName?: string;
}

/** Editorial preview only: does not change document metadata or predict search rankings. */
export const SeoPreview = forwardRef<HTMLElement, SeoPreviewProps>(function SeoPreview(
  { title, url, description, siteName, className, ...rest },
  ref,
) {
  const t = useMessages();
  return (
    <figure ref={ref} aria-label={t.seoPreview} {...rest} className={cx(styles.preview, className)}>
      {siteName ? <div className={styles.site}>{siteName}</div> : null}
      <div className={styles.url}><bdi dir="ltr">{url}</bdi></div>
      <div className={styles.title}>{title}</div>
      <div className={styles.description}>{description}</div>
    </figure>
  );
});
