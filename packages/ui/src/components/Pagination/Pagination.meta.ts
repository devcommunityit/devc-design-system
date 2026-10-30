import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['Pagination', 'getPaginationItems'],
  name: 'Pagination',
  slug: 'pagination',
  category: 'navigation',
  summary: 'Navigazione tra pagine di risultati con pagina corrente, precedente/successiva ed ellissi.',
  whenToUse: ['Elenchi lunghi in cui l’utente vuole tornare a una posizione precisa.', 'Risultati paginati lato server.'],
  whenNotToUse: ['Feed continui: valuta “Mostra altri”.', 'Poche voci che stanno in una pagina.'],
  props: [
    { name: 'totalPages', type: 'number', required: true, description: 'Numero di pagine.' },
    { name: 'page / defaultPage', type: 'number', default: '1', description: 'Pagina corrente (1-based) controllata / iniziale.' },
    { name: 'onPageChange', type: '(page: number) => void', description: 'Richiesta di cambio pagina.' },
    { name: 'siblingCount', type: 'number', default: '1', description: 'Pagine vicine mostrate attorno alla corrente.' },
    { name: 'showFirstLast', type: 'boolean', default: 'false', description: 'Pulsanti prima/ultima pagina.' },
    { name: 'getPageHref', type: '(page: number) => string', description: 'Rende link reali (SEO, apertura in nuova scheda).' },
    { name: 'size', type: "'sm' | 'md'", default: "'md'", description: 'Dimensione dei controlli.' },
  ],
  inherits: 'Attributi HTML di <nav>.',
  keyboard: [{ keys: 'Tab / Enter / Space', action: 'Ogni pagina è un pulsante o un link standard.' }],
  accessibility: [
    'Landmark nav con nome traducibile.',
    'Pagina corrente con aria-current="page".',
    'Ogni controllo ha un nome completo (“Pagina 3”, “Pagina successiva”); le ellissi sono nascoste.',
  ],
  responsive: ['Sotto 420 px di contenitore restano solo precedente/successiva e “Pagina x di y” (container query).'],
  customization: ['Pagina corrente: action.secondary e border.selected.'],
  commonMistakes: [
    'Passare page fuori intervallo: viene limitata, ma correggi lo stato del consumer.',
    'Dimenticare di riportare focus/scroll all’inizio della lista dopo il cambio pagina.',
  ],
  examples: [
    { name: 'Uncontrolled', title: 'Non controllata' },
    { name: 'Controlled', title: 'Controllata con prima/ultima' },
    { name: 'WithLinks', title: 'Con link' },
  ],
  status: { implemented: true, documented: true, tests: ['components/Pagination/Pagination.test.tsx'], limits: [] },
};
