import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['Timeline', 'TimelineItem'],
  name: 'Timeline',
  slug: 'timeline',
  category: 'data',
  summary: 'Sequenza cronologica di eventi su elenco ordinato.',
  whenToUse: ['Storico di ordini, ticket, attività.'],
  whenNotToUse: ['Processi a passi da completare: usa Stepper.'],
  props: [
    { name: 'TimelineItem.title', type: 'ReactNode', required: true, description: 'Descrizione dell’evento.' },
    { name: 'time / dateTime', type: 'ReactNode / string', description: 'Etichetta visibile e valore ISO per <time datetime>.' },
    { name: 'tone', type: "'neutral' | 'info' | 'success' | 'warning' | 'danger'", default: "'neutral'", description: 'Tono dell’indicatore, con testo nascosto equivalente.' },
    { name: 'icon', type: 'ReactNode', description: 'Icona decorativa nell’indicatore.' },
    { name: 'children', type: 'ReactNode', description: 'Dettagli aggiuntivi.' },
  ],
  inherits: 'Attributi HTML di <ol> e <li>.',
  keyboard: [],
  accessibility: ['Elenco ordinato nativo; dai un aria-label a Timeline se ci sono più timeline.', 'Il tono è comunicato anche come testo per screen reader, non solo col colore.'],
  responsive: ['Colonna singola con testo che va a capo.'],
  customization: ['className/style; token feedback per i toni.'],
  commonMistakes: ['Fornire solo date relative (“2 giorni fa”) senza dateTime.'],
  examples: [
    { name: 'Basic', title: 'Storico ordine' },
    { name: 'WithIcons', title: 'Icone ed errori' },
    { name: 'Controlled', title: 'Eventi controllati e ordinamento', description: 'Gli eventi sono nello stato dell’esempio: si aggiungono con un pulsante e l’ordine si inverte con lo Switch.' },
    { name: 'LongAndMissing', title: 'Testi lunghi e data mancante', description: 'Titoli lunghi che vanno a capo, un evento senza orario e uno in inglese con lang="en".' },
  ],
  status: { implemented: true, documented: true, tests: ['components/Data.test.tsx'], limits: [] },
};
