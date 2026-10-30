import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['DescriptionList'],
  name: 'DescriptionList',
  slug: 'description-list',
  category: 'data',
  summary: 'Coppie termine/valore su <dl> nativo per schede dettaglio e riepiloghi.',
  whenToUse: ['Pagine dettaglio, riepiloghi d’ordine, metadati.'],
  whenNotToUse: ['Dati confrontabili su più righe: usa Table.'],
  props: [
    { name: 'items', type: 'DescriptionItem[]', required: true, description: '{ id?, term, description }.' },
    { name: 'layout', type: "'stacked' | 'inline' | 'grid'", default: "'inline'", description: 'stacked: termine sopra il valore; inline: termine e valore affiancati; grid: colonne in base allo spazio (container query).' },
    { name: 'emptyValue', type: 'ReactNode', default: "'—'", description: 'Mostrato quando description è null, undefined o stringa vuota.' },
    { name: 'dividers', type: 'boolean', default: 'true', description: 'Separatori tra le coppie.' },
  ],
  inherits: 'Attributi HTML di <dl>.',
  keyboard: [],
  accessibility: ['Semantica nativa dt/dd.', 'Valori mancanti esplicitati con testo, mai lasciati vuoti.'],
  responsive: ['inline torna impilato sotto la larghezza minima del contenitore; grid adatta le colonne al contenitore.'],
  customization: ['className/style; token di tipografia label e body.'],
  commonMistakes: ['Usare emptyValue “—” senza contesto in moduli critici: preferisci un testo esplicito come “Non indicato”.'],
  examples: [
    { name: 'Stacked', title: 'Impilato' },
    { name: 'Inline', title: 'Affiancato con separatori' },
    { name: 'GridLayout', title: 'Griglia' },
  ],
  status: { implemented: true, documented: true, tests: ['components/Data.test.tsx'], limits: [] },
};