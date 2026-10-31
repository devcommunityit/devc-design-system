import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['StreakCounter', 'StreakCounterProps'],
  name: 'StreakCounter',
  slug: 'streak-counter',
  category: 'community',
  summary: 'Mostra il conteggio corrente di giorni consecutivi e, facoltativamente, il record personale.',
  whenToUse: ['Mostrare una serie giornaliera o un record già calcolato dall’applicazione.'],
  whenNotToUse: ['Calcolare, incrementare o persistere una serie di attività.'],
  props: [
    { name: 'days', type: 'number', required: true, description: 'Numero corrente di giorni consecutivi.' },
    { name: 'label', type: 'ReactNode', default: "'Current streak'", description: 'Titolo accessibile del conteggio.' },
    { name: 'dayLabel / daysLabel', type: 'string', default: "'day' / 'days'", description: 'Etichette singolare e plurale localizzabili.' },
    { name: 'longestStreak', type: 'number', description: 'Record personale facoltativo.' },
    { name: 'longestLabel', type: 'ReactNode', default: "'Longest streak'", description: 'Etichetta localizzabile del record.' },
    { name: 'headingLevel', type: '2 | 3 | 4 | 5 | 6', default: '3', description: 'Livello del titolo.' },
  ],
  inherits: 'Attributi HTML di <section>.',
  keyboard: [],
  accessibility: [
    'Il titolo è un’intestazione e i conteggi sono testo visibile, non affidati al solo colore o all’icona.',
    'I numeri sono formattati secondo la locale attiva; le etichette singolare/plurale sono configurabili.',
  ],
  responsive: ['Il contenitore si restringe al genitore e i valori restano leggibili.'],
  customization: ['Usa i token --dc-*; className e attributi HTML sono inoltrati alla sezione.'],
  commonMistakes: ['Usare il componente per tracciare eventi o gestire una serie: i valori sono forniti dall’applicazione.'],
  examples: [
    { name: 'Basic', title: 'Serie e record' },
    { name: 'SingularAndZero', title: 'Singolare e zero' },
  ],
  status: { implemented: true, documented: true, tests: ['components/StreakCounter/StreakCounter.test.tsx'], limits: ['Non traccia, calcola o persiste le serie.'] },
};
