import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['ScrollArea'],
  name: 'ScrollArea',
  slug: 'scroll-area',
  category: 'layout',
  summary:
    'Contenitore con scorrimento nativo e scrollbar sottili a tema. Quando il contenuto trabocca ed è presente un nome accessibile, diventa una regione focalizzabile da tastiera.',
  whenToUse: ['Registri, liste lunghe in pannelli di altezza fissa, righe di filtri orizzontali su mobile.'],
  whenNotToUse: ['Per l’intera pagina: lascia scorrere il documento.', 'Tabelle: Table e DataTable gestiscono già l’overflow orizzontale.'],
  props: [
    { name: 'orientation', type: "'vertical' | 'horizontal' | 'both'", default: "'vertical'", description: 'Direzione di scorrimento.' },
    { name: 'maxHeight', type: 'string', description: 'Altezza massima (lunghezza CSS) oltre la quale scorre.' },
    { name: 'aria-label / aria-labelledby', type: 'string', description: 'Nome della regione; necessario perché diventi focalizzabile quando trabocca.' },
  ],
  inherits: 'Attributi HTML di <div>; ref al contenitore.',
  keyboard: [
    { keys: 'Tab', action: 'Porta il focus sulla regione (solo se il contenuto trabocca).' },
    { keys: 'Frecce / Pagina su-giù / Home / Fine', action: 'Scorrimento nativo del browser.' },
  ],
  accessibility: [
    'Nessuna emulazione delle scrollbar: lo scorrimento resta nativo (touch, rotella, tastiera, tecnologie assistive).',
    'La regione è focalizzabile solo quando serve, per non aggiungere tab stop inutili (WCAG 2.1.1).',
  ],
  responsive: ['La modalità orizzontale evita l’overflow globale su viewport stretti.'],
  customization: ['Colore scrollbar: token border.strong; selettore .dc-scroll-area-scroll-area[data-orientation][data-overflowing].'],
  commonMistakes: ['Omettere aria-label: la regione traboccante non sarebbe raggiungibile da tastiera.'],
  examples: [
    { name: 'VerticalLog', title: 'Registro verticale' },
    { name: 'Horizontal', title: 'Scorrimento orizzontale' },
  ],
  status: {
    implemented: true,
    documented: true,
    tests: ['components/Layout/Layout.test.tsx'],
    limits: ['Il rilevamento dell’overflow usa ResizeObserver; senza di esso la misura avviene solo al montaggio e al cambio dei figli.'],
  },
};