import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['Agenda', 'AgendaProps', 'AgendaItem', 'AgendaItemProps'],
  name: 'Agenda',
  slug: 'agenda',
  category: 'community',
  summary: 'Vista agenda per eventi: elenco semantico con orari, dettagli e azioni componibili.',
  whenToUse: ['Mostrare gli eventi di una giornata o un programma in ordine di agenda.', 'Comporre le righe evento usando contenuti e azioni personalizzati.'],
  whenNotToUse: ['Navigare tra date o selezionare un giorno: usa un componente calendario.', 'Confrontare eventi come card editoriali: usa EventCard.'],
  props: [
    { name: 'title', type: 'ReactNode', required: true, description: 'Titolo della sezione agenda, usato anche per etichettarla.' },
    { name: 'children', type: 'ReactNode', description: 'Elementi AgendaItem da mostrare come elenco.' },
    { name: 'emptyState', type: 'ReactNode', description: 'Contenuto mostrato quando non ci sono elementi.' },
    { name: 'headingLevel', type: '1 | 2 | 3 | 4 | 5 | 6', default: '2', description: 'Livello semantico del titolo della sezione.' },
  ],
  inherits: 'Attributi HTML di <section> (eccetto title); ref inoltrato alla section.',
  keyboard: [
    { keys: 'Tab', action: 'Raggiunge i link e i controlli inseriti negli elementi agenda.' },
    { keys: 'Enter', action: 'Attiva un link o un controllo standard dell’elemento.' },
  ],
  accessibility: [
    'La section è etichettata dal titolo e gli eventi sono contenuti in una lista ordinata.',
    'Gli orari usano <time>; passa i valori ISO tramite startDateTime/endDateTime per fornire date macchina leggibili.',
    'Le azioni sono slot di contenuto, senza controlli interattivi annidati creati dal componente.',
  ],
  responsive: ['Le righe passano a una colonna su contenitori stretti; i dettagli e le azioni possono andare a capo.'],
  customization: ['`className` sul root e sulle righe; colori, superfici e spaziature usano i token `--dc-*`.'],
  commonMistakes: [
    'Usare AgendaItem al di fuori di Agenda: è un elemento <li> e richiede un elenco contenitore.',
    'Passare valori leggibili a schermo come `startDateTime`; il testo visibile va in `startTime`.',
  ],
  examples: [
    { name: 'Basic', title: 'Programma giornaliero', description: 'Eventi ordinati con orario, link, luogo e azione.' },
    { name: 'Empty', title: 'Stato vuoto', description: 'Messaggio quando l’agenda non contiene eventi.' },
  ],
  status: {
    implemented: true,
    documented: true,
    tests: ['components/Agenda/Agenda.test.tsx'],
    limits: ['L’ordinamento degli eventi e il raggruppamento per data restano responsabilità del chiamante.'],
  },
};
