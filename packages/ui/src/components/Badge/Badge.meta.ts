import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['Badge'],
  name: 'Badge',
  slug: 'badge',
  category: 'data',
  summary: 'Etichetta breve e non interattiva per stati, categorie o conteggi.',
  whenToUse: ['Stato di un elemento (Pagato, Scaduto).', 'Conteggi accanto a tab o voci di menu.'],
  whenNotToUse: ['Elementi rimovibili o selezionabili: usa Tag.', 'Messaggi che richiedono azione: usa Alert o Banner.'],
  props: [
    { name: 'tone', type: "'neutral' | 'brand' | 'info' | 'success' | 'warning' | 'danger'", default: "'neutral'", description: 'Ruolo semantico del colore.' },
    { name: 'variant', type: "'soft' | 'solid' | 'outline'", default: "'soft'", description: 'Enfasi visiva.' },
    { name: 'size', type: "'sm' | 'md'", default: "'md'", description: 'Dimensione.' },
    { name: 'icon', type: 'ReactNode', description: 'Icona decorativa iniziale.' },
    { name: 'dot', type: 'boolean', default: 'false', description: 'Pallino di stato decorativo.' },
  ],
  inherits: 'Attributi HTML di <span>.',
  keyboard: [],
  accessibility: [
    'Non è focalizzabile né interattivo.',
    'Il significato deve essere nel testo: colore, pallino e icona sono decorativi.',
    'Per un conteggio isolato aggiungi contesto (es. aria-label sul contenitore o testo nascosto: “4 notifiche”).',
  ],
  responsive: ['Testo su una riga con ellissi se lo spazio è insufficiente.'],
  customization: ['Colori: feedback-*-surface/-foreground/-border; selettori .dc-badge-badge[data-tone][data-variant].'],
  commonMistakes: ['Usare solo il colore per distinguere stati.', 'Rendere cliccabile un Badge: usa Button o Tag.'],
  examples: [
    { name: 'Tones', title: 'Toni' },
    { name: 'Variants', title: 'Varianti, pallino e icona' },
    { name: 'SizesAndLongLabels', title: 'Dimensioni, testi lunghi e lingue', description: 'Confronto sm/md, un’etichetta lunga che va a capo e testi in inglese marcati con lang="en".' },
    { name: 'LiveCount', title: 'Contatore controllato', description: 'Il conteggio è nello stato dell’esempio: tono e formato “99+” cambiano con il valore.' },
  ],
  status: { implemented: true, documented: true, tests: ['components/Badge/Badge.test.tsx'], limits: [] },
};
