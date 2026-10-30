import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['EmptyState'],
  name: 'EmptyState',
  slug: 'empty-state',
  category: 'feedback',
  summary: 'Spiega perché non ci sono contenuti (nessun dato, nessun risultato, errore, primo utilizzo) e cosa fare.',
  whenToUse: ['Liste, tabelle e dashboard vuote.', 'Ricerche senza risultati.'],
  whenNotToUse: ['Errori di campo: usa il messaggio di errore del campo.'],
  props: [
    { name: 'title', type: 'ReactNode', required: true, description: 'Titolo (heading).' },
    { name: 'description', type: 'ReactNode', description: 'Spiegazione e prossimo passo.' },
    { name: 'icon', type: 'ReactNode', description: 'Icona o illustrazione decorativa.' },
    { name: 'actions', type: 'ReactNode', description: 'Azioni principali.' },
    { name: 'headingLevel', type: '1–6', default: '2', description: 'Livello coerente con la struttura della pagina.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Spaziature e scala del titolo.' },
  ],
  inherits: 'Attributi HTML di <div>.',
  keyboard: [],
  accessibility: ['Titolo come heading reale; icona aria-hidden.'],
  responsive: ['Centrato, larghezza massima leggibile, azioni che vanno a capo.'],
  customization: ['className/style.'],
  commonMistakes: ['Messaggi generici (“Nessun dato”) senza indicare cosa fare.'],
  examples: [
    { name: 'NoData', title: 'Nessun dato' },
    { name: 'NoResults', title: 'Nessun risultato' },
    { name: 'Sizes', title: 'Dimensioni e testi lunghi', description: 'Varianti sm, md e lg; l’ultima ha contenuto in inglese e una descrizione lunga.' },
    { name: 'ErrorWithRetry', title: 'Errore con nuovo tentativo', description: 'Caricamento simulato in locale: il primo tentativo fallisce, “Riprova” porta allo stato vuoto.' },
  ],
  status: { implemented: true, documented: true, tests: ['components/Alert/Feedback.test.tsx'], limits: [] },
};
