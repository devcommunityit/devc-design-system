import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['PlanSwitcher', 'PlanSwitcherProps', 'PlanSwitcherOption'],
  name: 'PlanSwitcher',
  slug: 'plan-switcher',
  category: 'community',
  summary: 'Controllo segmentato per scegliere un piano o una cadenza.',
  whenToUse: ['Offrire una scelta compatta tra alternative di piano.'],
  whenNotToUse: ['Confrontare prezzi e funzionalità insieme: usa PricingTable.'],
  props: [
    { name: 'label', type: 'ReactNode', description: 'Etichetta del gruppo.', required: true },
    { name: 'options', type: 'PlanSwitcherOption[]', description: 'Alternative disponibili.', required: true },
    { name: 'value', type: 'string', description: 'Id selezionato controllato.', required: true },
    { name: 'onChange', type: '(value: string) => void', description: 'Notifica una selezione.', required: true },
  ],
  inherits: 'Attributi HTML di <div>.',
  keyboard: [{ keys: 'Tab, Invio, Spazio', action: 'Raggiunge e seleziona un’opzione.' }],
  accessibility: ['Il gruppo ha un nome accessibile.', 'La scelta è esposta con aria-pressed e resta controllata dal chiamante.'],
  responsive: ['Le opzioni vanno a capo quando lo spazio è limitato.'],
  customization: ['Usa Button e token --dc-*.'],
  commonMistakes: ['Aspettarsi che il valore cambi senza aggiornare la prop value.'],
  examples: [{ name: 'Basic', title: 'Cambio cadenza' }],
  status: { implemented: true, documented: true, tests: ['components/PlanSwitcher/PlanSwitcher.test.tsx'], limits: ['Non avvia un acquisto.'] },
};
