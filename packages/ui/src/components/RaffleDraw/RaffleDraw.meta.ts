import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['RaffleDraw', 'RaffleDrawProps', 'RaffleWinner'],
  name: 'RaffleDraw',
  slug: 'raffle-draw',
  category: 'community',
  summary: 'Riepilogo visuale di un’estrazione con vincitore fornito dal chiamante, senza logica di selezione.',
  whenToUse: ['Mostrare l’esito di un’estrazione già determinato dall’applicazione.', 'Presentare il titolo del sorteggio e il numero di partecipanti.'],
  whenNotToUse: ['Selezionare casualmente un vincitore o gestire una procedura di estrazione.', 'Gestire iscrizioni, persistenza o stato di backend.'],
  props: [
    { name: 'title', type: 'ReactNode', required: true, description: 'Titolo dell’estrazione.' },
    { name: 'winner', type: 'RaffleWinner | null', required: true, description: 'Vincitore esterno; null mostra lo stato vuoto.' },
    { name: 'entryCount', type: 'number', description: 'Numero di partecipazioni idonee.' },
    { name: 'entryCountLabel', type: '(count: number) => ReactNode', description: 'Etichetta localizzabile con singolare e plurale.' },
    { name: 'description', type: 'ReactNode', description: 'Testo di contesto.' },
    { name: 'headingLevel', type: '2 | 3 | 4 | 5 | 6', default: '2', description: 'Livello del titolo; il titolo del vincitore usa il livello successivo.' },
    { name: 'emptyMessage', type: 'ReactNode', description: 'Testo personalizzato quando winner è null.' },
  ],
  inherits: 'Attributi HTML di <section>.',
  keyboard: [],
  accessibility: [
    'La sezione è nominata dal titolo e usa intestazioni in ordine gerarchico.',
    'Il vincitore è contenuto da WinnerReveal; lo stato senza vincitore è testo visibile.',
    'Nessuna animazione o selezione casuale viene avviata dal componente.',
  ],
  responsive: ['Il riepilogo si estende al contenitore e permette ai contenuti lunghi di andare a capo.'],
  customization: ['Usa i token --dc-* del tema; className e attributi HTML sono inoltrati alla sezione.'],
  commonMistakes: ['Aspettarsi che il componente estragga il vincitore: passare sempre il risultato determinato dall’applicazione.'],
  examples: [
    { name: 'Basic', title: 'Estrazione con vincitore' },
    { name: 'AwaitingWinner', title: 'In attesa del risultato' },
  ],
  status: { implemented: true, documented: true, tests: ['components/RaffleDraw/RaffleDraw.test.tsx'], limits: ['Non gestisce iscrizioni, casualità, persistenza o backend.'] },
};
