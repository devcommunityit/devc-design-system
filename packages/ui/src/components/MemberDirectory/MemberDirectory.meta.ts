import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['MemberDirectory', 'MemberDirectoryProps', 'MemberDirectoryMember'],
  name: 'MemberDirectory',
  slug: 'member-directory',
  category: 'community',
  summary: 'Directory filtrabile che compone le card profilo esistenti.',
  whenToUse: ['Mostrare una raccolta ricercabile di membri della community.'],
  whenNotToUse: ['Per una singola persona usa ProfileCard; per un elenco compatto usa una tabella.'],
  props: [
    { name: 'aria-label', type: 'string', required: true, description: 'Nome accessibile della directory.' },
    { name: 'searchLabel', type: 'string', required: true, description: 'Etichetta del campo di ricerca.' },
    { name: 'members', type: 'readonly MemberDirectoryMember[]', required: true, description: 'Membri visualizzati tramite ProfileCard.' },
    { name: 'query', type: 'string', required: true, description: 'Valore controllato usato per filtrare i membri.' },
    { name: 'onQueryChange', type: '(query: string) => void', required: true, description: 'Richiesta di aggiornamento della ricerca.' },
    { name: 'heading', type: 'ReactNode', description: 'Titolo facoltativo della directory.' },
    { name: 'emptyState', type: 'ReactNode', description: 'Contenuto mostrato quando non ci sono corrispondenze.' },
  ],
  keyboard: [{ keys: 'Tab', action: 'Raggiunge la ricerca e poi i link e le azioni dei profili.' }],
  accessibility: ['La sezione ha un nome accessibile e il campo di ricerca usa l’etichetta visibile.'],
  responsive: ['La griglia si adatta alla larghezza disponibile e resta a colonna singola nei contenitori stretti.'],
  customization: ['Le card sono istanze di ProfileCard; colori e spaziature usano i token --dc-*.'],
  commonMistakes: ['Il componente filtra solo il testo locale: la ricerca remota resta responsabilità del consumer.'],
  examples: [{ name: 'Basic', title: 'Directory' }],
  status: { implemented: true, documented: true, tests: ['components/MemberDirectory/MemberDirectory.test.tsx'], limits: ['I campi non testuali in jobTitle non partecipano alla ricerca.'] },
};
