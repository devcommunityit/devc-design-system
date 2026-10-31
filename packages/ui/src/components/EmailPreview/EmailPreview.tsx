import { useId, type HTMLAttributes, type ReactNode } from 'react';
import { EmailBuilder, type EmailPreviewDevice } from '../EmailBuilder/EmailBuilder';
import type { EmailDocument } from '../EmailBuilder/emailDocument';
import styles from './EmailPreview.module.css';

export interface EmailPreviewProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title: ReactNode;
  document: EmailDocument;
  previewDevice: EmailPreviewDevice;
  onPreviewDeviceChange: (device: EmailPreviewDevice) => void;
  subject?: ReactNode;
  preheader?: ReactNode;
  sender?: ReactNode;
  senderLabel?: ReactNode;
  subjectLabel?: ReactNode;
  preheaderLabel?: ReactNode;
}

export function EmailPreview({
  title, document, previewDevice, onPreviewDeviceChange, subject, preheader, sender,
  senderLabel = 'From', subjectLabel = 'Subject', preheaderLabel = 'Preheader', className, ...rest
}: EmailPreviewProps) {
  const titleId = useId();
  return (
    <section className={[styles.preview, className].filter(Boolean).join(' ')} aria-labelledby={titleId} {...rest}>
      <h2 id={titleId} className={styles.title}>{title}</h2>
      {subject || preheader || sender ? (
        <dl className={styles.metadata}>
          {sender ? <div><dt>{senderLabel}</dt><dd>{sender}</dd></div> : null}
          {subject ? <div><dt>{subjectLabel}</dt><dd>{subject}</dd></div> : null}
          {preheader ? <div><dt>{preheaderLabel}</dt><dd>{preheader}</dd></div> : null}
        </dl>
      ) : null}
      <EmailBuilder
        className={styles.builder}
        value={document}
        isReadOnly
        mode="preview"
        previewDevice={previewDevice}
        onPreviewDeviceChange={onPreviewDeviceChange}
        label={title}
      />
    </section>
  );
}
