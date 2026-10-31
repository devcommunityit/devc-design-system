import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['UsageMeter', 'UsageMeterProps'],
  name: 'UsageMeter',
  slug: 'usage-meter',
  category: 'community',
  summary: 'Contenitore contestuale per visualizzare utilizzo e quota con il Meter esistente.',
  whenToUse: ['Mostrare l’uso di una quota come membri, invii o spazio.'],
  whenNotToUse: ['Rappresentare un task in corso: usa Progress.'],
  props: [
    { name: 'label', type: 'ReactNode', description: 'Nome della quota.', required: true },
    { name: 'value / limit', type: 'number', description: 'Uso attuale e capacità massima.', required: true },
    { name: 'unit', type: 'string', description: 'Unità mostrata accanto ai valori.' },
    { name: 'thresholds', type: '{ warning?: number; danger?: number }', description: 'Soglie per i toni del Meter.' },
  ],
  inherits: 'Attributi HTML di <div>.',
  keyboard: [],
  accessibility: ['Riutilizza Meter con role="meter" e value text leggibile.', 'Descrizioni aggiuntive sono collegate dal Meter.'],
  responsive: ['Occupa la larghezza del contenitore.'],
  customization: ['Composto con Meter; token --dc-* per il contenitore.'],
  commonMistakes: ['Usare il componente per rappresentare un caricamento.'],
  examples: [{ name: 'Basic', title: 'Quota membri' }],
  status: { implemented: true, documented: true, tests: ['components/UsageMeter/UsageMeter.test.tsx'], limits: ['La quota deve essere fornita e aggiornata dal chiamante.'] },
};
