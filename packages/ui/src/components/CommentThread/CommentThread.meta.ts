import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['CommentThread', 'type CommentThreadProps', 'type CommentThreadItem'],
  name: 'CommentThread',
  slug: 'comment-thread',
  category: 'community',
  summary: 'Discussione con commenti annidati, risposte e reazioni controllate.',
  whenToUse: ['Mostrare una conversazione e consentire risposte ai singoli commenti.'],
  whenNotToUse: ['Per un indice di discussioni usa DiscussionList.'],
  props: [
    { name: 'aria-label', type: 'string', required: true, description: 'Nome della discussione.' },
    { name: 'comments', type: 'readonly CommentThreadItem[]', required: true, description: 'Commenti e risposte annidate con id univoci.' },
    { name: 'onReply / onLike', type: 'funzioni', description: 'Azioni delegate al consumer.' },
    { name: 'mentionSuggestions / hashtagSuggestions', type: 'readonly MentionSuggestion[]', description: 'Suggerimenti per il campo di risposta.' },
    { name: 'renderActions / emptyState', type: 'funzione / ReactNode', description: 'Azioni aggiuntive e stato vuoto.' },
  ],
  keyboard: [{ keys: 'Tab / Invio / Spazio', action: 'Attiva risposte e reazioni; le menzioni sono navigabili con le frecce.' }],
  accessibility: ['Le risposte sono liste annidate; ogni azione identifica il commento e la reazione espone aria-pressed.'],
  responsive: ['Contenuti e azioni vanno a capo; il rientro delle risposte è limitato.'],
  customization: ['Contenuto e azioni sono forniti dal consumer.'],
  commonMistakes: ['Aggiorna il modello dei commenti dopo le callback; il componente non salva né modera i dati.'],
  examples: [{ name: 'Discussion', title: 'Discussione' }],
  status: { implemented: true, documented: true, tests: ['components/CommentThread/CommentThread.test.tsx'], limits: ['Nessuna persistenza, moderazione o rete integrata.'] },
};
