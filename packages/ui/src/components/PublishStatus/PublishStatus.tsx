import { forwardRef } from 'react';
import { useMessages } from '../../i18n/LocaleProvider';
import { Badge, type BadgeProps, type BadgeTone } from '../Badge/Badge';

export type PublicationStatus = 'draft' | 'published' | 'scheduled' | 'archived';
export interface PublishStatusProps extends Omit<BadgeProps, 'tone'> {
  status: PublicationStatus;
}

const TONES: Record<PublicationStatus, BadgeTone> = { draft: 'neutral', published: 'success', scheduled: 'info', archived: 'warning' };

/** A localized publication label, not a workflow engine or an authorization decision. */
export const PublishStatus = forwardRef<HTMLSpanElement, PublishStatusProps>(function PublishStatus(
  { status, children, dot = true, ...rest },
  ref,
) {
  const t = useMessages();
  const labels = { draft: t.publishDraft, published: t.publishPublished, scheduled: t.publishScheduled, archived: t.publishArchived };
  return <Badge ref={ref} {...rest} dot={dot} tone={TONES[status]} data-publish-status={status}>{children ?? labels[status]}</Badge>;
});
