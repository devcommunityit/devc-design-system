import { AlertCircle, Check, Clock3, LoaderCircle, Wrench } from 'lucide-react';
import type { HTMLAttributes, ReactNode } from 'react';
import { useMessages } from '../../i18n/LocaleProvider';
import { Button } from '../Button';
import styles from './AIToolCall.module.css';

export type AIToolCallStatus = 'running' | 'completed' | 'failed' | 'approval';

export interface AIToolCallProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title: string;
  status: AIToolCallStatus;
  description?: ReactNode;
  details?: ReactNode;
  statusLabels?: Partial<Record<AIToolCallStatus, string>>;
  approveLabel?: string;
  rejectLabel?: string;
  detailsLabel?: string;
  onApprove?: () => void;
  onReject?: () => void;
}

const statusIcons = {
  running: LoaderCircle,
  completed: Check,
  failed: AlertCircle,
  approval: Clock3,
} satisfies Record<AIToolCallStatus, typeof Check>;

/** Displays the lifecycle and optional approval actions for an AI tool invocation. */
export function AIToolCall({
  title,
  status,
  description,
  details,
  statusLabels,
  approveLabel,
  rejectLabel,
  detailsLabel,
  onApprove,
  onReject,
  className,
  ...rest
}: AIToolCallProps) {
  const t = useMessages().components;
  const defaultStatusLabels: Record<AIToolCallStatus, string> = {
    running: t.toolRunning, completed: t.toolCompleted, failed: t.toolFailed, approval: t.toolApproval,
  };
  const StatusIcon = statusIcons[status];
  const statusText = statusLabels?.[status] ?? defaultStatusLabels[status];
  return (
    <article
      className={[styles.call, className].filter(Boolean).join(' ')}
      data-status={status}
      aria-label={`${title}: ${statusText}`}
      {...rest}
    >
      <header className={styles.header}>
        <span className={styles.toolIcon} aria-hidden="true"><Wrench /></span>
        <h3 className={styles.title}>{title}</h3>
        <span className={styles.status} data-status={status} role={status === 'failed' ? 'alert' : 'status'} aria-live="polite">
          <StatusIcon aria-hidden="true" className={status === 'running' ? styles.spinning : undefined} />
          {statusText}
        </span>
      </header>
      {description ? <div className={styles.description}>{description}</div> : null}
      {details ? (
        <details className={styles.details}>
          <summary>{detailsLabel ?? t.details}</summary>
          <div className={styles.detailContent}>{details}</div>
        </details>
      ) : null}
      {status === 'approval' && (onApprove || onReject) ? (
        <div className={styles.actions}>
          {onReject ? <Button variant="outline" onPress={onReject}>{rejectLabel ?? t.toolReject}</Button> : null}
          {onApprove ? <Button onPress={onApprove}>{approveLabel ?? t.toolApprove}</Button> : null}
        </div>
      ) : null}
    </article>
  );
}
