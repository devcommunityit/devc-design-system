import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['VisuallyHidden'],
  name: 'VisuallyHidden',
  slug: 'visually-hidden',
  category: 'typography',
  summary: 'Testo disponibile alle tecnologie assistive ma non visibile.',
  whenToUse: ['Contesto aggiuntivo per screen reader (unità, stato).', 'Skip link visibili solo al focus (isFocusable).'],
  whenNotToUse: ['Nascondere informazioni utili a tutti: rendile visibili.', 'Dare un nome a un controllo: preferisci label o aria-label.'],
  props: [{ name: 'isFocusable', type: 'boolean', default: 'false', description: 'Diventa visibile quando un discendente riceve il focus.' }],
  inherits: 'Attributi HTML di <span>.',
  keyboard: [],
  accessibility: ['Tecnica clip/1px compatibile con zoom e forced-colors.'],
  responsive: [],
  customization: ['className/style.'],
  commonMistakes: ['Usarlo su contenuto focalizzabile senza isFocusable: il focus diventa invisibile.'],
  examples: [
    { name: 'Basic', title: 'Contesto aggiuntivo' },
    { name: 'SkipLink', title: 'Skip link' },
  ],
  status: { implemented: true, documented: true, tests: [], limits: ['Coperto indirettamente dai test di Skeleton, DataTable e Statistic.'] },
};