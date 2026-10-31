import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['WinnerReveal', 'WinnerRevealProps', 'RaffleWinner'],
  name: 'WinnerReveal',
  slug: 'winner-reveal',
  category: 'community',
  summary: 'Presenta un vincitore già fornito dall’applicazione oppure un messaggio di stato vuoto.',
  whenToUse: ['Mostrare in modo evidente il risultato di un’estrazione.', 'Affiancare RaffleDraw con i dettagli del vincitore.'],
  whenNotToUse: ['Scegliere o animare una selezione casuale.', 'Gestire dati di partecipanti o persistere l’esito.'],
  props: [
    { name: 'winner', type: 'RaffleWinner | null', required: true, description: 'Dati esterni del vincitore; null mostra lo stato vuoto.' },
    { name: 'heading', type: 'ReactNode', default: "'Winner'", description: 'Titolo della sezione.' },
    { name: 'headingLevel', type: '2 | 3 | 4 | 5 | 6', default: '3', description: 'Livello del titolo.' },
    { name: 'emptyMessage', type: 'ReactNode', description: 'Messaggio quando winner è null.' },
  ],
  inherits: 'Attributi HTML di <section>. RaffleWinner: id, name, entryNumber?, detail?, avatar?.',
  keyboard: [],
  accessibility: [
    'La sezione è nominata dall’intestazione e il messaggio vuoto usa role=status.',
    'L’avatar o l’icona sono decorativi; il nome del vincitore è testo.',
  ],
  responsive: ['I nomi e i dettagli lunghi vanno a capo senza restringere l’icona.'],
  customization: ['Usa i token --dc-* del tema; className e attributi HTML sono inoltrati.'],
  commonMistakes: ['Usare WinnerReveal come motore di estrazione: il vincitore deve essere passato dal chiamante.'],
  examples: [
    { name: 'Basic', title: 'Vincitore' },
    { name: 'Empty', title: 'Nessun risultato' },
  ],
  status: { implemented: true, documented: true, tests: ['components/WinnerReveal/WinnerReveal.test.tsx'], limits: ['Non seleziona né persiste vincitori.'] },
};
