import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['CodeBlock', 'CodeBlockProps', 'CodeBlockVariant'],
  name: 'CodeBlock',
  slug: 'code-block',
  category: 'typography',
  summary: 'Blocco di codice su più righe con titolo, pulsante “a capo automatico” e copia negli appunti.',
  whenToUse: ['Documentazione, snippet di configurazione, output di comandi.'],
  whenNotToUse: ['Brevi frammenti nel testo: usa Code.'],
  props: [
    { name: 'code', type: 'string', required: true, description: 'Testo del codice (non viene interpretato come HTML).' },
    { name: 'language', type: 'string', description: 'Etichetta del linguaggio, mostrata e usata nel nome accessibile.' },
    { name: 'title', type: 'ReactNode', description: 'Titolo (es. nome file).' },
    { name: 'copyable', type: 'boolean', default: 'true', description: 'Mostra il pulsante Copia (navigator.clipboard).' },
    { name: 'defaultWrap', type: 'boolean', default: 'false', description: 'Stato iniziale dell’a capo automatico.' },
    { name: 'maxHeight', type: 'string', description: 'Altezza massima prima dello scorrimento.' },
    { name: 'onCopyCode', type: '(code: string) => void', description: 'Chiamata dopo una copia riuscita.' },
    {
      name: 'variant',
      type: "'default' | 'window'",
      default: "'default'",
      description: 'Aspetto: `window` mostra una finestra da editor scura con i tre pallini decorativi, ideale per landing e hero.',
    },
  ],
  inherits: 'Attributi HTML di <div>; ref al contenitore.',
  keyboard: [
    { keys: 'Tab', action: 'Raggiunge i pulsanti e poi l’area del codice (scorribile con le frecce).' },
    { keys: 'Enter / Spazio', action: 'Attiva “A capo automatico” o “Copia”.' },
  ],
  accessibility: [
    'L’area del codice è una regione con nome, focalizzabile per lo scorrimento da tastiera.',
    'L’esito della copia (riuscita o errore) è annunciato in una live region.',
    '“A capo automatico” è un toggle con aria-pressed.',
    'Nella variante window i tre pallini sono decorativi (aria-hidden).',
  ],
  responsive: ['Sotto 640 px l’etichetta “Copia” resta solo per i lettori di schermo; lo scorrimento orizzontale è locale al blocco.'],
  customization: [
    'Selettori .dc-code-block-code-block[data-wrap], .dc-code-block-code-block[data-variant="window"], .dc-code-block-pre, .dc-code-block-dots.',
  ],
  commonMistakes: ['Contare sulla copia in contesti non sicuri (http): l’API Clipboard può non essere disponibile e viene mostrato un errore.'],
  examples: [
    { name: 'Basic', title: 'Esempio base' },
    { name: 'LongLines', title: 'Righe lunghe e altezza massima' },
    { name: 'NotCopyable', title: 'Senza copia' },
    { name: 'Window', title: 'Finestra editor', description: 'Variante `window` con barra scura e pallini, come negli snippet delle landing.' },
  ],
  status: {
    implemented: true,
    documented: true,
    tests: ['components/Typography/Typography.test.tsx', 'components/CodeBlock/CodeBlock.test.tsx'],
    limits: ['Nessuna evidenziazione della sintassi integrata (per non aggiungere dipendenze); il consumer può pre-elaborare il codice.'],
  },
};