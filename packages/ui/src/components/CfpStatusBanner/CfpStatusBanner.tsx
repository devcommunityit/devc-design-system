import { useId, type HTMLAttributes, type ReactNode } from 'react';
import styles from './CfpStatusBanner.module.css';

export type CfpStatus = 'open' | 'upcoming' | 'closed' | 'paused';

export interface CfpStatusBannerProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  status: CfpStatus;
  title: ReactNode;
  description?: ReactNode;
  deadline?: string;
  action?: ReactNode;
}

const statusLabels: Record<CfpStatus, string> = {
  open: 'Call for proposals open',
  upcoming: 'Call for proposals opening soon',
  closed: 'Call for proposals closed',
  paused: 'Call for proposals paused',
};

export function CfpStatusBanner({ status, title, description, deadline, action, className, ...rest }: CfpStatusBannerProps) {
  const titleId = useId();
  return (
    <aside aria-labelledby={titleId} className={[styles.banner, className].filter(Boolean).join(' ')} data-status={status} {...rest}>
      <div className={styles.content}>
        <p className={styles.status}>{statusLabels[status]}</p>
        <h2 id={titleId} className={styles.title}>{title}</h2>
        {description ? <p className={styles.description}>{description}</p> : null}
        {deadline ? <p className={styles.deadline}>Deadline: <time dateTime={deadline}>{deadline}</time></p> : null}
      </div>
      {action ? <div className={styles.action}>{action}</div> : null}
    </aside>
  );
}
