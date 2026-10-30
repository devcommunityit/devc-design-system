import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { useMessages } from '../../i18n/LocaleProvider';
import { cx } from '../../utils';
import styles from './ChatMessage.module.css';

export interface ChatMessageProps extends HTMLAttributes<HTMLElement> {
  speaker?: 'user' | 'assistant' | 'system';
  author?: ReactNode;
  avatar?: ReactNode;
  status?: 'complete' | 'streaming' | 'error';
  statusText?: ReactNode;
  footer?: ReactNode;
}

/** Presentation only: render text or trusted React content, not unvalidated model HTML. */
export const ChatMessage = forwardRef<HTMLElement, ChatMessageProps>(function ChatMessage(
  { speaker = 'assistant', author, avatar, status = 'complete', statusText, footer, children, className, ...rest },
  ref,
) {
  const t = useMessages();
  const names = { user: t.aiUser, assistant: t.aiAssistant, system: t.aiSystem };
  return (
    <article ref={ref} aria-label={names[speaker]} {...rest} className={cx(styles.message, className)} data-speaker={speaker} data-status={status}>
      <div className={styles.header}>
        {avatar ? <span className={styles.avatar} aria-hidden="true">{avatar}</span> : null}
        <span className={styles.author}>{author ?? names[speaker]}</span>
      </div>
      <div className={styles.content} aria-busy={status === 'streaming'}>{children}</div>
      {status !== 'complete' ? (
        <div className={styles.status} role={status === 'error' ? 'alert' : 'status'}>
          {statusText ?? (status === 'error' ? t.error : t.aiGenerating)}
        </div>
      ) : null}
      {footer ? <div className={styles.footer}>{footer}</div> : null}
    </article>
  );
});
