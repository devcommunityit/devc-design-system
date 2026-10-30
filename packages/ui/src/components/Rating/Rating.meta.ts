import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['Rating'],
  name: 'Rating',
  slug: 'rating',
  category: 'forms',
  summary: 'Valutazione a stelle costruita su un gruppo di radio: frecce per scegliere, nome localizzato per ogni stella (“4 su 5”), anteprima al passaggio del puntatore.',
  whenToUse: ['Feedback su servizi, prodotti, risposte di assistenza.', 'Visualizzazione di una valutazione in sola lettura.'],
  whenNotToUse: ['Valori continui o con decimali: usa Slider.', 'Scelte con significato diverso dall’ordine: usa RadioGroup con etichette.'],
  props: [
    { name: 'value / defaultValue', type: 'number | null', default: '— / null', description: 'Valore controllato / iniziale (1…max).' },
    { name: 'onChange', type: '(value: number) => void', description: 'Nuova valutazione.' },
    { name: 'max', type: 'number', default: '5', description: 'Numero di stelle.' },
    { name: 'showValue', type: 'boolean', default: 'false', description: 'Mostra “4/5” accanto alle stelle (decorativo: il valore è già nel radio selezionato).' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Dimensione delle stelle.' },
    { name: 'label / description / errorMessage', type: 'ReactNode', description: 'Parti del campo.' },
    { name: 'isReadOnly / isDisabled / isRequired / isInvalid', type: 'boolean', description: 'Stati del campo.' },
    { name: 'name', type: 'string', description: 'Nome dei radio per l’invio nativo.' },
  ],
  inherits: 'Props di react-aria-components RadioGroup (tranne orientation, value, onChange).',
  keyboard: [
    { keys: 'Tab', action: 'Raggiunge la stella selezionata (o la prima).' },
    { keys: '← / → / ↑ / ↓', action: 'Seleziona la stella precedente/successiva; segue la direzione di lettura in RTL.' },
  ],
  accessibility: [
    'radiogroup nativo: ogni stella è un input radio con nome “n su max” (messages.ratingValue).',
    'Selezione resa con stelle piene/vuote (forma), non solo con il colore; in forced-colors usa colori di sistema.',
    'L’anteprima al passaggio del puntatore non cambia il valore e si annulla con la tastiera.',
  ],
  responsive: ['Con max elevato e size="lg" le stelle vanno a capo; ogni target resta di almeno 24 × 24 px.'],
  customization: ['Selettori [data-size], [data-filled] sulle stelle.'],
  commonMistakes: ['Usare il colore come unica indicazione del valore.', 'Mostrare una media decimale con Rating in sola lettura: arrotonda e mostra il valore in testo.'],
  examples: [
    { name: 'Basic', title: 'Non controllato' },
    { name: 'Controlled', title: 'Controllato con descrizione' },
    { name: 'SizesAndStates', title: 'Dimensioni e stati (English)' },
  ],
  status: {
    implemented: true,
    documented: true,
    tests: ['components/Rating/Rating.test.tsx'],
    limits: ['Solo valori interi: niente mezze stelle.', 'Una volta scelta, la valutazione non si può azzerare (semantica radio): offri un pulsante “Rimuovi” se serve.'],
  },
  apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/radio/',
};
