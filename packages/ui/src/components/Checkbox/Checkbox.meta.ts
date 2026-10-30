import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['Checkbox', 'CheckboxGroup'],
  name: 'Checkbox e CheckboxGroup',
  slug: 'checkbox',
  category: 'forms',
  summary:
    'Casella di selezione singola (consensi, opzioni booleane) o gruppo di caselle per scelte multiple con etichetta, descrizione e validazione comuni. Supporta lo stato indeterminato per “seleziona tutto”.',
  whenToUse: [
    'Scelte multiple indipendenti tra poche opzioni visibili (fino a ~7).',
    'Consensi espliciti che richiedono una conferma prima dell’invio.',
    'Selezione gerarchica con stato indeterminato.',
  ],
  whenNotToUse: [
    'Impostazioni con effetto immediato: usa Switch.',
    'Una sola scelta fra opzioni esclusive: usa RadioGroup.',
    'Molte opzioni o ricerca: usa MultiSelect.',
  ],
  props: [
    { name: 'children', type: 'ReactNode', description: 'Etichetta della casella (cliccabile).' },
    { name: 'isSelected / defaultSelected', type: 'boolean', description: 'Modalità controllata o non controllata.' },
    { name: 'onChange', type: '(isSelected: boolean) => void', description: 'Riceve il nuovo stato.' },
    { name: 'isIndeterminate', type: 'boolean', default: 'false', description: 'Stato misto (aria-checked="mixed"), di solito per “seleziona tutto”.' },
    { name: 'value', type: 'string', description: 'Valore inviato col form e usato dal CheckboxGroup.' },
    { name: 'description / errorMessage', type: 'ReactNode', description: 'Testo di aiuto e messaggio di errore collegati.' },
    { name: 'isDisabled / isReadOnly / isInvalid / isRequired', type: 'boolean', default: 'false', description: 'Stati del controllo.' },
    { name: 'CheckboxGroup: value / defaultValue / onChange', type: 'string[]', description: 'Valori selezionati del gruppo.' },
    { name: 'CheckboxGroup: label, description, errorMessage, validate', type: 'FieldBaseProps', description: 'Anatomia di campo e validazione per l’intero gruppo.' },
    { name: 'CheckboxGroup: orientation', type: "'vertical' | 'horizontal'", default: "'vertical'", description: 'Disposizione delle opzioni (in orizzontale vanno a capo).' },
  ],
  inherits: 'Props di react-aria-components CheckboxField/CheckboxGroup (name, form, onFocus, onBlur…).',
  keyboard: [
    { keys: 'Tab', action: 'Sposta il focus tra le caselle.' },
    { keys: 'Spazio', action: 'Seleziona o deseleziona.' },
  ],
  accessibility: [
    'Input checkbox nativo visivamente nascosto: semantica e invio nel form native.',
    'Il gruppo è annunciato con la sua etichetta; descrizione ed errore sono collegati.',
    'Lo stato indeterminato usa un’icona distinta (non solo colore).',
    'Area cliccabile estesa all’etichetta: target ≥ 24×24 px.',
  ],
  responsive: ['Le etichette lunghe vanno a capo allineate al testo, non sotto la casella.', 'In orizzontale le opzioni vanno a capo sulle viewport strette.'],
  customization: ['Dimensione da density; colori da color.action.primary e color.border.strong.', 'Stati via [data-selected], [data-indeterminate], [data-invalid], [data-disabled].'],
  commonMistakes: [
    'Usare una checkbox per azioni immediate (preferisci Switch).',
    'Omettere l’etichetta visibile: fornisci almeno aria-label.',
    'Gestire “seleziona tutto” senza isIndeterminate quando la selezione è parziale.',
  ],
  examples: [
    { name: 'Basic', title: 'Base' },
    { name: 'WithDescription', title: 'Con descrizione' },
    { name: 'States', title: 'Stati' },
    { name: 'SelectAll', title: 'Seleziona tutto (controllato, indeterminato)' },
    { name: 'GroupValidation', title: 'Gruppo con validazione' },
    { name: 'Terms', title: 'Consenso obbligatorio' },
  ],
  status: { implemented: true, documented: true, tests: ['components/Checkbox/Checkbox.test.tsx'], limits: [] },
  apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/',
};