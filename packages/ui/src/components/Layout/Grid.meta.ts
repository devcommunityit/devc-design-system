import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['Grid', 'GridItem'],
  name: 'Grid',
  slug: 'grid',
  category: 'layout',
  summary:
    'Griglia CSS con numero di colonne responsive (breakpoint sm 640, md 768, lg 1024, xl 1280 px) oppure colonne intrinseche “auto-fit” con larghezza minima.',
  whenToUse: ['Dashboard di KPI, gallerie di card, layout principale + pannello laterale.'],
  whenNotToUse: ['Liste monodimensionali: usa Stack/Inline.', 'Dati tabellari: usa Table o DataTable.'],
  props: [
    { name: 'columns', type: 'GridColumns | { base?, sm?, md?, lg?, xl? }', default: '1', description: 'Colonne fisse o per breakpoint (mobile-first: ogni valore vale fino al successivo).' },
    { name: 'minItemWidth', type: 'string', description: 'Lunghezza CSS minima per colonna in modalità auto-fit; ha precedenza su columns.' },
    { name: 'gap / rowGap', type: 'SpaceStep', default: '4', description: 'Spaziatura tra celle.' },
    { name: 'as', type: "'div' | 'ul' | 'ol' | 'section'", default: "'div'", description: 'Elemento semantico (con ul/ol usa GridItem as="li").' },
    { name: 'GridItem.span', type: "number | 'full'", description: 'Colonne occupate; sotto 640 px un elemento con span occupa tutta la riga.' },
  ],
  inherits: 'Attributi HTML globali; ref all’elemento.',
  keyboard: [],
  accessibility: ['L’ordine di lettura segue il DOM: non usare la griglia per riordinare visivamente contenuti significativi.'],
  responsive: [
    'Le media query usano valori letterali in px (le custom properties non sono ammesse nelle condizioni).',
    'La modalità auto-fit si adatta al contenitore senza breakpoint.',
  ],
  customization: ['Variabili locali --_cols-{base,sm,md,lg,xl}, --_min, --_gap; selettore .dc-layout-grid[data-mode].'],
  commonMistakes: ['Impostare columns={4} senza base: su mobile le 4 colonne diventano troppo strette. Usa { base: 1, md: 2, lg: 4 }.'],
  examples: [
    { name: 'ResponsiveColumns', title: 'Colonne responsive' },
    { name: 'AutoFit', title: 'Auto-fit con larghezza minima' },
    { name: 'Spanning', title: 'Elementi su più colonne' },
  ],
  status: { implemented: true, documented: true, tests: ['components/Layout/Layout.test.tsx'], limits: [] },
};