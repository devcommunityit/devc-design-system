import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['Fieldset'],
  name: 'Fieldset',
  slug: 'fieldset',
  category: 'forms',
  summary: 'Raggruppa campi correlati con <fieldset> e <legend> nativi, una descrizione e un errore che riguarda l’intero gruppo.',
  whenToUse: ['Sezioni di form (indirizzo, dati di fatturazione).', 'Errori che dipendono da più campi (intervalli di date).'],
  whenNotToUse: ['Gruppi di checkbox o radio: CheckboxGroup e RadioGroup includono già etichetta di gruppo.', 'Separazione puramente visiva: usa Section o Divider.'],
  props: [
    { name: 'legend', type: 'ReactNode', required: true, description: 'Titolo del gruppo, annunciato entrando nei campi.' },
    { name: 'description', type: 'ReactNode', description: 'Testo collegato al fieldset con aria-describedby.' },
    { name: 'errorMessage / isInvalid', type: 'ReactNode / boolean', description: 'Errore di gruppo, mostrato e collegato solo se isInvalid.' },
    { name: 'legendVariant', type: "'title' | 'label'", default: "'title'", description: 'Stile della legenda: titolo di sezione o etichetta di campo.' },
    { name: 'disabled', type: 'boolean', description: 'Disabilita nativamente i discendenti.' },
  ],
  inherits: 'Attributi nativi di <fieldset> (name, form, disabled…).',
  keyboard: [{ keys: '—', action: 'Nessuna interazione propria.' }],
  accessibility: ['Semantica nativa: la legenda dà il contesto ai campi.', 'L’errore di gruppo è collegato al fieldset; marca invalidi anche i singoli campi coinvolti.'],
  responsive: ['I campi interni usano Stack/Inline con wrap per adattarsi.'],
  customization: ['Bordo assente di default; spaziatura da density.form-gap.'],
  commonMistakes: ['Contare su disabled per lo stile: i controlli react-aria non lo rilevano, passa anche isDisabled.', 'Annidare fieldset senza necessità: rende verbosi gli annunci.'],
  examples: [
    { name: 'Basic', title: 'Indirizzo' },
    { name: 'GroupError', title: 'Errore di gruppo' },
    { name: 'Disabled', title: 'Disabilitato' },
  ],
  status: {
    implemented: true,
    documented: true,
    tests: ['components/Fieldset/Fieldset.test.tsx'],
    limits: ['disabled nativo non aggiorna gli stati visivi dei controlli react-aria: passa isDisabled anche ai campi.'],
  },
};