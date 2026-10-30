import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['Section'],
  name: 'Section',
  slug: 'section',
  category: 'layout',
  summary: 'Elemento <section> con intestazione opzionale (titolo, descrizione, azioni), ritmo verticale e superficie.',
  whenToUse: ['Blocchi tematici di una pagina: impostazioni, gruppi di contenuti, sezioni di landing page.'],
  whenNotToUse: ['Contenuti indipendenti e riutilizzabili come una notizia: usa Card con as="article".'],
  props: [
    { name: 'title', type: 'ReactNode', description: 'Titolo visibile; dà anche il nome accessibile alla regione (aria-labelledby).' },
    { name: 'headingLevel', type: '2 | 3 | 4', default: '2', description: 'Livello del titolo, da scegliere secondo la struttura della pagina.' },
    { name: 'description', type: 'ReactNode', description: 'Testo di supporto sotto il titolo.' },
    { name: 'actions', type: 'ReactNode', description: 'Azioni allineate all’intestazione.' },
    { name: 'spacing', type: "'none' | 'sm' | 'md' | 'lg'", default: "'md'", description: 'Padding verticale.' },
    { name: 'surface', type: "'none' | 'subtle' | 'raised'", default: "'none'", description: 'Sfondo della sezione.' },
    { name: 'container', type: 'ContainerSize', description: 'Avvolge intestazione e contenuto in un Container: lo sfondo occupa tutta la larghezza e il testo resta allineato alla pagina. Ometti se la Section è già dentro un Container.' },
  ],
  inherits: 'Attributi HTML globali; ref al <section>.',
  keyboard: [],
  accessibility: [
    'Con un titolo la sezione diventa un landmark “region” con nome; senza titolo e senza aria-label resta un semplice raggruppamento.',
    'Scegli headingLevel in base alla gerarchia reale, non all’aspetto.',
  ],
  responsive: ['Le azioni vanno sotto il titolo quando lo spazio non basta.'],
  customization: ['Selettori .dc-layout-section[data-spacing][data-surface], .dc-layout-section-title.'],
  commonMistakes: ['Saltare livelli di heading (h2 → h4).'],
  examples: [
    { name: 'WithHeader', title: 'Con intestazione e azioni' },
    { name: 'Plain', title: 'Senza intestazione' },
  ],
  status: { implemented: true, documented: true, tests: ['components/Layout/Layout.test.tsx'], limits: [] },
};