import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['EntryList', 'EntryListProps', 'RaffleEntry'],
  name: 'EntryList',
  slug: 'entry-list',
  category: 'community',
  summary: 'Elenco semantico e accessibile delle partecipazioni a un’estrazione, nell’ordine fornito.',
  whenToUse: ['Mostrare i partecipanti e i relativi numeri di ticket.', 'Evidenziare un vincitore già determinato dall’applicazione.'],
  whenNotToUse: ['Accettare iscrizioni o assegnare ticket.', 'Riordinare o selezionare vincitori in modo casuale.'],
  props: [
    { name: 'entries', type: 'RaffleEntry[]', required: true, description: 'Elementi da mostrare, nell’ordine fornito.' },
    { name: 'label', type: 'string', default: "'Raffle entries'", description: 'Nome accessibile della lista.' },
    { name: 'winnerLabel', type: 'ReactNode', default: "'Winner'", description: 'Testo visibile per una voce contrassegnata come vincitrice.' },
    { name: 'emptyMessage', type: 'ReactNode', description: 'Messaggio quando l’elenco è vuoto.' },
  ],
  inherits: 'Attributi HTML di <ul>. RaffleEntry: id, name, entryNumber?, detail?, avatar?, isWinner?.',
  keyboard: [],
  accessibility: [
    'Usa una lista ul/li con un nome accessibile configurabile.',
    'Il vincitore è indicato da testo oltre che dal colore.',
    'Gli avatar sono decorativi e nascosti agli screen reader.',
  ],
  responsive: ['I nomi e i dettagli lunghi vanno a capo; numeri e contrassegni restano distinti.'],
  customization: ['Usa i token --dc-* del tema; className e attributi HTML della lista sono inoltrati.'],
  commonMistakes: ['Usare l’elenco per gestire o persistere le partecipazioni: è un componente solo di presentazione.'],
  examples: [
    { name: 'Basic', title: 'Elenco partecipanti' },
    { name: 'WinnerAndEmpty', title: 'Vincitore e stato vuoto' },
  ],
  status: { implemented: true, documented: true, tests: ['components/EntryList/EntryList.test.tsx'], limits: ['Non gestisce iscrizioni né selezione casuale.'] },
};
