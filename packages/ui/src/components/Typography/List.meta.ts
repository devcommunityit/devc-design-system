import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['List', 'ListItem', 'Quote'],
  name: 'List e Quote',
  slug: 'list',
  category: 'typography',
  summary: 'Liste semantiche (<ul>/<ol>) con spaziatura a token e citazioni (<blockquote> in <figure> con attribuzione opzionale).',
  whenToUse: ['Elenchi puntati o numerati di contenuti; citazioni e testimonianze.'],
  whenNotToUse: ['Liste interattive selezionabili: usa ListBox.', 'Coppie termine/valore: usa DescriptionList.'],
  props: [
    { name: 'ordered', type: 'boolean', default: 'false', description: 'Renderizza <ol>.' },
    { name: 'variant', type: "'default' | 'none' | 'inline'", default: "'default'", description: 'Marcatori, nessun marcatore (mantiene la semantica) o orizzontale.' },
    { name: 'gap', type: '1 | 2 | 3 | 4', default: '2', description: 'Spaziatura tra elementi.' },
    { name: 'start', type: 'number', description: 'Numero iniziale per liste ordinate.' },
    { name: 'Quote.attribution', type: 'ReactNode', description: 'Autore o fonte, in <figcaption>.' },
    { name: 'Quote.cite', type: 'string', description: 'URL della fonte (attributo cite).' },
  ],
  inherits: 'Attributi HTML di ul/ol/li/figure; ref inoltrato.',
  keyboard: [],
  accessibility: ['Con variant none/inline viene impostato role="list" perché Safari rimuove la semantica di lista senza marcatori.'],
  responsive: ['La variante inline va a capo.'],
  customization: ['Selettori .dc-typography-list[data-variant], .dc-typography-quote.'],
  commonMistakes: ['Usare <br> per simulare elenchi.'],
  examples: [
    { name: 'Unordered', title: 'Non ordinata' },
    { name: 'Ordered', title: 'Ordinata' },
    { name: 'InlineList', title: 'In linea' },
    { name: 'Quotation', title: 'Citazione' },
  ],
  status: { implemented: true, documented: true, tests: ['components/Typography/Typography.test.tsx'], limits: [] },
};