import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['DateTimePicker'],
  name: 'DateTimePicker',
  slug: 'date-time-picker',
  category: 'forms',
  summary:
    'Un unico campo per data e ora: segmenti digitabili e un solo popover con calendario, elenco orari, scorciatoie e pulsante “Adesso”.',
  whenToUse: [
    'Appuntamenti, prenotazioni, pubblicazioni programmate: data e ora in un solo campo.',
    'Slot orari a passo fisso (15/30/60 min) con orari non disponibili.',
  ],
  whenNotToUse: [
    'Solo data: usa DatePicker.',
    'Solo orario: usa TimePicker (con elenco) o TimeInput (solo segmenti).',
    'Intervalli di date: usa DateRangePicker.',
  ],
  props: [
    { name: 'label / description / errorMessage', type: 'ReactNode', description: 'Anatomia di campo standard.' },
    { name: 'value / defaultValue / onChange', type: 'CalendarDateTime | ZonedDateTime | null', description: 'Data e ora civili oppure istante con fuso: il fuso viene preservato.' },
    { name: 'granularity', type: "'hour' | 'minute' | 'second'", default: "'minute'", description: 'Segmenti mostrati nel campo.' },
    { name: 'timeStep', type: 'number', default: '30 (60 con granularity="hour")', description: 'Passo in minuti dell’elenco orari. Il campo accetta comunque qualsiasi orario digitato.' },
    { name: 'isTimeUnavailable', type: '(time: Time) => boolean', description: 'Disabilita singoli orari nell’elenco.' },
    { name: 'minValue / maxValue / isDateUnavailable', type: 'DateValue / (date) => boolean', description: 'Vincoli; nel giorno minimo/massimo gli orari fuori limite sono disabilitati.' },
    { name: 'presets', type: "DatePreset[] | 'default'", description: 'Scorciatoie (Oggi, Domani, Tra una settimana o personalizzate); mantengono l’orario scelto.' },
    { name: 'showNowButton', type: 'boolean', default: 'true', description: 'Pulsante “Adesso” nel piè del popover.' },
    { name: 'showMonthYearPicker', type: 'boolean', default: 'true', description: 'Selettori di mese e anno nell’intestazione del calendario.' },
    { name: 'isClearable', type: 'boolean', default: 'false', description: 'Pulsante per svuotare il campo.' },
    { name: 'hourCycle', type: '12 | 24', description: 'Forza il formato orario (di default segue la lingua).' },
    { name: 'popoverProps', type: 'PopoverSurfaceProps', description: 'Posizionamento e classi del popover.' },
  ],
  inherits: 'Props di DatePicker di react-aria-components (name, isRequired, validate, hideTimeZone, firstDayOfWeek…).',
  keyboard: [
    { keys: 'Tab', action: 'Segmento successivo, poi pulsanti del campo.' },
    { keys: 'Frecce su/giù, cifre', action: 'Modifica il segmento.' },
    { keys: 'Alt + Freccia giù', action: 'Apre il popover.' },
    { keys: 'Frecce nel calendario / nell’elenco orari', action: 'Sposta giorno o orario; Invio seleziona.' },
    { keys: 'Esc', action: 'Chiude il popover; il focus torna al campo.' },
  ],
  accessibility: [
    'Il popover è un dialog con calendario (griglia) ed elenco orari (listbox “Scegli orario”) etichettati e localizzati.',
    'Gli orari non disponibili sono aria-disabled e saltati dalla navigazione.',
    'Il popover non si chiude alla scelta del giorno: si conferma con un orario, “Fatto”, “Adesso” o Esc.',
  ],
  responsive: [
    'Sopra 40rem calendario ed elenco orari sono affiancati; sotto, gli orari scendono sotto il calendario e le scorciatoie diventano chip scorrevoli.',
  ],
  customization: ['className sul campo, popoverProps.className sul popover; colori e raggi dai token --dc-*.'],
  commonMistakes: [
    'Usare ZonedDateTime per orari “da parete” (es. apertura negozio): usa CalendarDateTime.',
    'Aspettarsi che timeStep impedisca orari fuori passo: limita solo l’elenco; valida con validate se serve.',
    'Serializzare con toDate().toISOString() un CalendarDateTime: usa toString() o converti esplicitamente con toZoned().',
  ],
  examples: [
    { name: 'Basic', title: 'Base' },
    { name: 'Appointments', title: 'Slot con vincoli' },
    { name: 'Zoned', title: 'Istante con fuso' },
    { name: 'PresetsClearable', title: 'Scorciatoie e cancellazione' },
  ],
  status: {
    implemented: true,
    documented: true,
    tests: ['components/DateTimePicker/DateTimePicker.test.tsx'],
    limits: ['L’elenco orari mostra ore e minuti: con granularity="second" i secondi si regolano solo dai segmenti.'],
  },
};
