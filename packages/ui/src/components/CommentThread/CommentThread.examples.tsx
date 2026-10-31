import { useState } from 'react';
import { CommentThread, type CommentThreadItem } from '@dev-community/ui';

const initial: CommentThreadItem[] = [
  { id: 'one', author: 'Sara', content: 'Come possiamo migliorare la guida?', replies: [{ id: 'two', author: 'Luca', content: 'Aggiungiamo un esempio.' }] },
];

export function Discussion() {
  const [comments, setComments] = useState(initial);
  const [counter, setCounter] = useState(1);
  return <CommentThread aria-label="Commenti" comments={comments} onReply={(parent, text) => {
    const reply = { id: `reply-${counter}`, author: 'Tu', content: text };
    const addReply = (items: readonly CommentThreadItem[]): CommentThreadItem[] => items.map((item) => item.id === parent.id
      ? { ...item, replies: [...(item.replies ?? []), reply] }
      : { ...item, replies: item.replies ? addReply(item.replies) : undefined });
    setComments((current) => addReply(current));
    setCounter((current) => current + 1);
  }} mentionSuggestions={[{ id: 'sara', label: 'Sara', handle: 'sara' }]} />;
}
