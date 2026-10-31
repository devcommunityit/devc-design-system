import { useId, useState, type ReactNode } from 'react';
import { useMessages } from '../../i18n/LocaleProvider';
import { cx } from '../../utils';
import { Button } from '../Button';
import { MentionTextarea, type MentionSuggestion } from '../MentionInput';
import shared from '../composite/Composite.module.css';
import styles from './CommentThread.module.css';

export interface CommentThreadItem {
  id: string;
  author: string;
  content: ReactNode;
  date?: ReactNode;
  dateTime?: string;
  likes?: number;
  isLiked?: boolean;
  replies?: readonly CommentThreadItem[];
}

export interface CommentThreadProps {
  'aria-label': string;
  comments: readonly CommentThreadItem[];
  onReply?: (parent: CommentThreadItem, text: string) => void;
  onLike?: (comment: CommentThreadItem, isLiked: boolean) => void;
  renderActions?: (comment: CommentThreadItem) => ReactNode;
  mentionSuggestions?: readonly MentionSuggestion[];
  hashtagSuggestions?: readonly MentionSuggestion[];
  emptyState?: ReactNode;
  className?: string;
}

interface CommentNodeProps {
  item: CommentThreadItem;
  onReply?: CommentThreadProps['onReply'];
  onLike?: CommentThreadProps['onLike'];
  renderActions?: CommentThreadProps['renderActions'];
  mentionSuggestions?: readonly MentionSuggestion[];
  hashtagSuggestions?: readonly MentionSuggestion[];
}

function CommentNode({ item, onReply, onLike, renderActions, mentionSuggestions, hashtagSuggestions }: CommentNodeProps) {
  const t = useMessages();
  const id = useId();
  const [replying, setReplying] = useState(false);
  const [draft, setDraft] = useState('');
  const submit = () => {
    const text = draft.trim();
    if (!text || !onReply) return;
    onReply(item, text);
    setDraft('');
    setReplying(false);
  };
  return (
    <li>
      <article className={shared.panel} aria-labelledby={`${id}-author`}>
        <div className={shared.toolbar}>
          <strong id={`${id}-author`}>{item.author}</strong>
          {item.date ? <time className={shared.muted} dateTime={item.dateTime}>{item.date}</time> : null}
        </div>
        <div className={styles.content}>{item.content}</div>
        <div className={shared.actions}>
          {onLike ? (
            <Button type="button" size="sm" variant="ghost" aria-label={t.components.commentLike(item.author)} aria-pressed={item.isLiked ?? false} onPress={() => onLike(item, !(item.isLiked ?? false))}>
              {t.reactionLike}{item.likes !== undefined ? ` (${item.likes})` : ''}
            </Button>
          ) : item.likes !== undefined ? <span className={shared.muted}>{t.reactionLike}: {item.likes}</span> : null}
          {onReply ? <Button type="button" size="sm" variant="ghost" aria-label={t.components.replyTo(item.author)} aria-expanded={replying} onPress={() => setReplying((value) => !value)}>{t.components.reply}</Button> : null}
          {renderActions?.(item)}
        </div>
        {replying ? (
          <div className={styles.composer}>
            <MentionTextarea label={t.components.replyTo(item.author)} suggestions={mentionSuggestions ?? []} hashtagSuggestions={hashtagSuggestions} value={draft} onChange={setDraft} rows={3} />
            <Button type="button" size="sm" isDisabled={!draft.trim()} onPress={submit}>{t.components.sendReply}</Button>
          </div>
        ) : null}
      </article>
      {item.replies?.length ? (
        <ol className={cx(shared.list, styles.replies)}>
          {item.replies.map((reply) => <CommentNode key={reply.id} item={reply} onReply={onReply} onLike={onLike} renderActions={renderActions} mentionSuggestions={mentionSuggestions} hashtagSuggestions={hashtagSuggestions} />)}
        </ol>
      ) : null}
    </li>
  );
}

/** Nested, consumer-owned comments with optional reply and reaction actions. */
export function CommentThread({ 'aria-label': ariaLabel, comments, onReply, onLike, renderActions, mentionSuggestions, hashtagSuggestions, emptyState, className }: CommentThreadProps) {
  const t = useMessages();
  const seen = new Set<string>();
  const validate = (items: readonly CommentThreadItem[]) => {
    for (const item of items) {
      if (seen.has(item.id)) throw new Error(`CommentThread: duplicate comment id "${item.id}".`);
      seen.add(item.id);
      if (item.replies) validate(item.replies);
    }
  };
  validate(comments);
  return (
    <section className={cx(shared.root, className)} aria-label={ariaLabel}>
      {comments.length ? (
        <ol className={shared.list}>
          {comments.map((item) => <CommentNode key={item.id} item={item} onReply={onReply} onLike={onLike} renderActions={renderActions} mentionSuggestions={mentionSuggestions} hashtagSuggestions={hashtagSuggestions} />)}
        </ol>
      ) : <div className={shared.muted}>{emptyState ?? t.noResults}</div>}
    </section>
  );
}
