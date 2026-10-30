import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['Container'],
  name: 'Container',
  slug: 'container',
  category: 'layout',
  summary: 'Centra il contenuto con una larghezza massima a token e un padding laterale fluido (mobile-first).',
  whenToUse: ['Contenuto principale delle pagine pubbliche e dei portali.', 'Testi lunghi: size="prose" limita la lunghezza della riga (~70 caratteri).'],
  whenNotToUse: ['Dentro Card o Dialog che hanno già padding: usa disableGutters o nessun Container.'],
  props: [
    { name: 'size', type: "'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'prose' | 'full'", default: "'xl'", description: 'Larghezza massima (token container.*).' },
    { name: 'as', type: "'div' | 'main' | 'section' | 'article' | 'header' | 'footer'", default: "'div'", description: 'Elemento semantico.' },
    { name: 'disableGutters', type: 'boolean', default: 'false', description: 'Rimuove il padding laterale.' },
  ],
  inherits: 'Attributi HTML globali ed eventi; ref all’elemento.',
  keyboard: [],
  accessibility: ['Nessun ruolo aggiunto; usa as="main" una sola volta per pagina (AppShell lo fa già).'],
  responsive: ['Il padding laterale cresce con il viewport (space.4 → space.8); a 320 px il contenuto non va in overflow.'],
  customization: ['Larghezze: token --dc-container-*. Selettore .dc-layout-container[data-size].'],
  commonMistakes: ['Annidare più Container: la larghezza efficace è quella del più stretto e il padding si somma.'],
  examples: [
    { name: 'Sizes', title: 'Dimensioni' },
    { name: 'WithoutGutters', title: 'Senza padding laterale' },
  ],
  status: { implemented: true, documented: true, tests: ['components/Layout/Layout.test.tsx'], limits: [] },
};