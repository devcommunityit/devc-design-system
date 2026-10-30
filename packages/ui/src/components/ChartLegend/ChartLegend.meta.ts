import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['ChartLegend'],
  name: 'ChartLegend',
  slug: 'chart-legend',
  category: 'charts',
  summary: 'Legenda dei grafici: chiave di colore con tratteggio/marker o texture, valore opzionale e, se richiesto, pulsanti per mostrare/nascondere le serie.',
  whenToUse: [
    'Già inclusa in LineChart, BarChart e DonutChart; usala da sola per visualizzazioni personalizzate che usano gli stessi colori dati.',
    'Filtrare le serie visibili con pulsanti toggle (isToggleable).',
  ],
  whenNotToUse: ['Per filtri complessi o multi-selezione di molte voci: usa Checkbox o un ToggleButtonGroup.', 'Per etichettare un solo valore: scrivi il testo direttamente.'],
  props: [
    { name: 'items', type: '{ id: string; label: ReactNode; colorIndex: number; value?: ReactNode }[]', required: true, description: 'Voci; colorIndex (da 0) sceglie colore --dc-color-data-N, tratteggio, marker e texture.' },
    { name: 'swatch', type: "'line' | 'fill'", default: "'line'", description: 'Chiave a linea con marker (grafici a linee) o quadrato con texture (barre, fette).' },
    { name: 'isToggleable', type: 'boolean', default: 'false', description: 'Ogni voce diventa un <button> con aria-pressed (premuto = serie visibile).' },
    { name: 'hiddenItems / defaultHiddenItems', type: 'string[]', description: 'Id delle voci nascoste (controllato / non controllato).' },
    { name: 'onHiddenItemsChange', type: '(ids: string[]) => void', description: 'Chiamata a ogni toggle.' },
  ],
  inherits: 'Attributi HTML di <ul>; il ref punta alla lista.',
  keyboard: [
    { keys: 'Tab', action: 'Sposta il focus tra i pulsanti della legenda (solo con isToggleable).' },
    { keys: 'Enter / Spazio', action: 'Mostra o nasconde la serie.' },
  ],
  accessibility: [
    'Lista semantica <ul>/<li>; le chiavi grafiche sono decorative (aria-hidden), il nome è il testo della voce.',
    'I toggle sono veri <button> con aria-pressed; lo stato nascosto è visibile anche senza colore (testo barrato, bordo tratteggiato, chiave attenuata).',
    'Target dei pulsanti ≥ 24 px (altezza controllo sm della densità).',
  ],
  responsive: ['Le voci vanno a capo e le etichette lunghe si spezzano.'],
  customization: ['Selettori stabili: .dc-chart-legend-legend[data-toggleable], .dc-chart-legend-item[data-hidden], .dc-chart-legend-button.'],
  commonMistakes: ['Usare colorIndex diversi da quelli del grafico associato: la legenda non corrisponde più ai dati.', 'Nascondere tutte le serie senza un modo evidente per ripristinarle.'],
  examples: [
    { name: 'Static', title: 'Statica' },
    { name: 'WithValues', title: 'Con valori' },
    { name: 'Toggleable', title: 'Toggle controllati' },
  ],
  status: {
    implemented: true,
    documented: true,
    tests: ['components/ChartLegend/ChartLegend.test.tsx', 'components/LineChart/LineChart.test.tsx', 'components/BarChart/BarChart.test.tsx'],
    limits: ['aria-pressed indica "serie visibile": il significato è implicito nel contesto del grafico, non annunciato con un testo dedicato.'],
  },
};
