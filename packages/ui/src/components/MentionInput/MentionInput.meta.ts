import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['MentionInput', 'MentionTextarea', 'MentionInputProps', 'MentionTextareaProps', 'MentionFieldProps', 'MentionSuggestion'],
  name: 'MentionInput',
  slug: 'mention-input',
  category: 'forms',
  summary: 'Campo singolo o multilinea con suggerimenti @mention e #hashtag, inseribili da tastiera o puntatore.',
  whenToUse: ['Commenti, discussioni e messaggi che supportano menzioni.'],
  whenNotToUse: ['Testo senza menzioni: usa Textarea.'],
  props: [
    { name: 'label', type: 'string', required: true, description: 'Etichetta associata al campo.' },
    { name: 'suggestions', type: 'readonly MentionSuggestion[]', required: true, description: 'Persone candidate, fornite dal consumer.' },
    { name: 'value / defaultValue', type: 'string', description: 'Testo controllato o iniziale.' },
    { name: 'onChange', type: '(value: string) => void', description: 'Riceve il testo aggiornato.' },
    { name: 'onMentionSelect', type: '(suggestion) => void', description: 'Notifica la selezione di una menzione.' },
    { name: 'hashtagSuggestions / onHashtagSelect', type: 'readonly MentionSuggestion[] / (suggestion) => void', description: 'Abilita suggerimenti locali per hashtag e notifica la selezione.' },
  ],
  keyboard: [{ keys: 'Freccia su/giù', action: 'Sposta la selezione tra i suggerimenti.' }, { keys: 'Invio', action: 'Inserisce la menzione selezionata.' }, { keys: 'Esc', action: 'Chiude i suggerimenti.' }],
  accessibility: ['Campo con etichetta e lista di suggerimenti: combobox per la riga singola, textbox multilinea per la textarea.', 'Lo stato della lista e l’opzione attiva sono esposti tramite ARIA.'],
  responsive: ['La lista dei suggerimenti usa la larghezza del campo e ha altezza massima con scorrimento.'],
  customization: ['Personalizza bordi, superfici e focus ring con token --dc-color-* e CSS Modules.'],
  commonMistakes: ['Passa handle stabili e univoci; il componente non effettua ricerche remote.'],
  examples: [{ name: 'DiscussionComment', title: 'Commento con menzioni' }, { name: 'MultilineHashtags', title: 'Testo multilinea e hashtag' }],
  status: { implemented: true, documented: true, tests: ['components/MentionInput/MentionInput.test.tsx'], limits: ['I suggerimenti sono forniti dal consumer; non effettua ricerche remote o crea nuovi handle.'] },
};
