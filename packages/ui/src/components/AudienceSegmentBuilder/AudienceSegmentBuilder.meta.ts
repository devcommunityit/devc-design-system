import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['AudienceSegmentBuilder', 'AudienceSegmentBuilderProps', 'AudienceField', 'AudienceFilter'],
  name: 'AudienceSegmentBuilder',
  slug: 'audience-segment-builder',
  category: 'community',
  summary: 'Editor controllato di filtri per definire un segmento audience.',
  whenToUse: ['Comporre criteri audience che restano gestiti dall’app consumer.'],
  whenNotToUse: ['Salvare segmenti o interrogare un pubblico: la persistenza è esterna.'],
  props: [
    { name: 'filters / fields / operators', type: 'AudienceFilter[] / AudienceField[] / AudienceField[]', description: 'Valori e scelte controllate.', required: true },
    { name: 'onFilterChange', type: '(id, patch) => void', description: 'Aggiorna un filtro esistente.', required: true },
    { name: 'onAddFilter / onRemoveFilter', type: '() => void / (id) => void', description: 'Richieste di modifica al consumer.', required: true },
    { name: 'fieldLabel / operatorLabel / valueLabel', type: 'ReactNode', description: 'Etichette personalizzabili dei controlli.' },
  ],
  inherits: 'Attributi HTML di <section>.',
  keyboard: [{ keys: 'Tab, Invio, Spazio, frecce', action: 'Modifica i campi tramite Select, TextField e Button.' }],
  accessibility: ['Ogni input ha un’etichetta visibile.', 'Le selezioni sono fornite dai componenti accessibili del sistema.'],
  responsive: ['I campi vengono impilati su viewport stretti.'],
  customization: ['Composto con Select, TextField e Button; token --dc-*.'],
  commonMistakes: ['Aspettarsi che i filtri siano salvati o eseguiti dalla componente.'],
  examples: [{ name: 'Basic', title: 'Filtri segmento' }],
  status: { implemented: true, documented: true, tests: ['components/AudienceSegmentBuilder/AudienceSegmentBuilder.test.tsx'], limits: ['Nessuna persistenza o valutazione dei segmenti.'] },
};
