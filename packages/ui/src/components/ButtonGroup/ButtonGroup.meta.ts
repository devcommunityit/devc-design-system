import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['ButtonGroup'],
  name: 'ButtonGroup',
  slug: 'button-group',
  category: 'actions',
  summary: 'Raggruppa pulsanti correlati, separati o uniti in un controllo segmentato.',
  whenToUse: ['Azioni affini sullo stesso oggetto (duplica, archivia, elimina).', 'Scelte rapide di formato in una barra.'],
  whenNotToUse: ['Per una selezione persistente: usa ToggleGroup.', 'Per molte azioni: usa DropdownMenu.'],
  props: [
    { name: 'attached', type: 'boolean', default: 'false', description: 'Unisce i pulsanti condividendo i bordi.' },
    { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Direzione.' },
    { name: 'aria-label', type: 'string', description: 'Nome del gruppo (consigliato).' },
  ],
  inherits: 'Attributi HTML di <div>.',
  keyboard: [{ keys: 'Tab', action: 'Ogni pulsante è un tab stop indipendente.' }],
  accessibility: ['role="group" con nome accessibile.', 'Non introduce navigazione con frecce: è un semplice raggruppamento.'],
  responsive: ['Senza attached i pulsanti vanno a capo; con attached usa etichette brevi o orientation="vertical" su mobile.'],
  customization: ['Gap: token space.2. Selettore .dc-button-group-group[data-attached][data-orientation].'],
  commonMistakes: ['Usarlo per stati selezionati: i pulsanti non espongono aria-pressed.'],
  examples: [
    { name: 'Basic', title: 'Base' },
    { name: 'Attached', title: 'Segmentato' },
    { name: 'Vertical', title: 'Verticale' },
  ],
  status: { implemented: true, documented: true, tests: ['components/Toggle/Toggle.test.tsx'], limits: [] },
};