import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['Stack', 'Inline'],
  name: 'Stack e Inline',
  slug: 'stack',
  category: 'layout',
  summary:
    'Primitive di flusso: Stack impila gli elementi in verticale, Inline li dispone in orizzontale (seguendo la direzione di scrittura) andando a capo. La spaziatura usa sempre la scala dei token.',
  whenToUse: [
    'Distanziare in modo coerente elementi adiacenti senza margini manuali.',
    'Barre di azioni, gruppi di tag, righe titolo + azione.',
  ],
  whenNotToUse: [
    'Layout a colonne bidimensionali: usa Grid.',
    'Per raggruppare semanticamente pulsanti correlati: usa ButtonGroup.',
  ],
  props: [
    { name: 'gap', type: 'SpaceStep (0–24)', default: 'Stack 4, Inline 2', description: 'Passo della scala di spaziatura (--dc-space-N).' },
    { name: 'align', type: "'start' | 'center' | 'end' | 'stretch' | 'baseline'", default: "Inline 'center'", description: 'Allineamento sull’asse trasversale.' },
    { name: 'justify', type: "'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'", description: 'Distribuzione sull’asse principale.' },
    { name: 'wrap', type: 'boolean', default: 'true', description: 'Solo Inline: va a capo quando lo spazio non basta.' },
    { name: 'as', type: "'div' | 'section' | 'ul' | 'ol' | 'nav' | …", default: "'div'", description: 'Elemento semantico renderizzato.' },
  ],
  inherits: 'Attributi HTML globali (id, aria-*, data-*, style, className) ed eventi nativi; ref all’elemento renderizzato.',
  keyboard: [],
  accessibility: [
    'Non aggiunge ruoli: la semantica dipende da `as`. Con as="ul" i figli devono essere <li>.',
    'L’ordine visivo coincide con l’ordine del DOM (nessun riordino via CSS).',
  ],
  responsive: [
    'Inline va a capo per impostazione predefinita: nessun overflow orizzontale a 320 px.',
    'Usa proprietà logiche, quindi in RTL l’ordine si inverte automaticamente.',
  ],
  customization: ['Selettori: .dc-stack-stack, .dc-stack-inline; la spaziatura è nella variabile locale --_gap.'],
  commonMistakes: ['Aggiungere margini ai figli per “correggere” la spaziatura: modifica il gap.', 'Usare wrap={false} con contenuti lunghi su mobile.'],
  examples: [
    { name: 'VerticalStack', title: 'Stack verticale' },
    { name: 'InlineWrapping', title: 'Inline che va a capo' },
    { name: 'Justified', title: 'Titolo e azione distribuiti' },
    { name: 'SemanticElement', title: 'Elemento semantico (lista)' },
  ],
  status: { implemented: true, documented: true, tests: ['components/Layout/Layout.test.tsx'], limits: [] },
};