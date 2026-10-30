import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['NativeSelect'],
  name: 'NativeSelect',
  slug: 'native-select',
  category: 'forms',
  summary: '<select> nativo con lo stile e l’anatomia di campo del sistema. Usa il selettore del sistema operativo, ideale su mobile e in form SSR senza JavaScript.',
  whenToUse: ['Liste brevi e semplici, soprattutto su mobile.', 'Form che devono funzionare prima dell’hydration.'],
  whenNotToUse: ['Opzioni ricche, ricerca o selezione multipla: usa Select, Combobox o MultiSelect.'],
  props: [
    { name: 'label', type: 'ReactNode', required: true, description: 'Etichetta visibile.' },
    { name: 'options', type: 'NativeSelectOption[]', description: '{ value, label, disabled? }; in alternativa children <option>/<optgroup>.' },
    { name: 'placeholder', type: 'string', description: 'Prima opzione vuota (disabilitata se isRequired).' },
    { name: 'value / defaultValue / onChange', type: 'string / ChangeEvent', description: 'API nativa di React.' },
    { name: 'isInvalid / errorMessage / description', type: 'boolean / ReactNode', description: 'Errore e aiuto collegati.' },
    { name: 'isRequired / isDisabled', type: 'boolean', description: 'Mappati su required/disabled nativi.' },
    { name: 'wrapperProps', type: 'HTMLAttributes<HTMLDivElement>', description: 'Props del contenitore del campo.' },
  ],
  inherits: 'Attributi nativi di <select> (name, autoComplete, form…), tranne multiple.',
  keyboard: [{ keys: 'Frecce / lettere', action: 'Comportamento nativo del browser.' }],
  accessibility: ['Semantica e tastiera interamente native.', 'Errori collegati con aria-describedby e aria-invalid.'],
  responsive: ['Su mobile apre il selettore del sistema operativo.'],
  customization: ['Freccia decorativa sostituibile via CSS; posizione logica (RTL).'],
  commonMistakes: ['Usare il placeholder come etichetta.'],
  examples: [
    { name: 'Basic', title: 'Base' },
    { name: 'Controlled', title: 'Controllato' },
    { name: 'Groups', title: 'Gruppi di opzioni' },
    { name: 'States', title: 'Stati' },
  ],
  status: { implemented: true, documented: true, tests: ['components/NativeSelect/NativeSelect.test.tsx'], limits: ['Lo stile del menu aperto dipende dal browser/OS.'] },
};