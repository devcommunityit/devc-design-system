import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['AspectRatio'],
  name: 'AspectRatio',
  slug: 'aspect-ratio',
  category: 'layout',
  summary: 'Mantiene un rapporto larghezza/altezza fisso; immagini, video e iframe interni coprono il riquadro.',
  whenToUse: ['Anteprime di media, mappe, video incorporati, copertine di card.'],
  whenNotToUse: ['Contenuti testuali di altezza variabile: rischiano di essere tagliati.'],
  props: [{ name: 'ratio', type: 'number', default: '1', description: 'Rapporto larghezza / altezza, es. 16 / 9.' }],
  inherits: 'Attributi HTML di <div>; ref al <div>.',
  keyboard: [],
  accessibility: ['Le immagini interne richiedono comunque un alt appropriato; iframe richiedono title.'],
  responsive: ['La larghezza è fluida; l’altezza deriva dal rapporto (proprietà CSS aspect-ratio).'],
  customization: ['Variabile locale --_ratio; selettore .dc-layout-aspect-ratio.'],
  commonMistakes: ['Inserire testo lungo che viene tagliato su viewport stretti.'],
  examples: [{ name: 'Ratios', title: 'Rapporti comuni' }],
  status: { implemented: true, documented: true, tests: ['components/Layout/Layout.test.tsx'], limits: [] },
};