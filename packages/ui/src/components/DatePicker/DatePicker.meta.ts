import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['DatePicker', 'DateRangePicker'],
  name: 'DatePicker / DateRangePicker',
  slug: 'date-picker',
  category: 'forms',
  summary: 'Campo data a segmenti digitabili con calendario in popover; supporta date senza orario, date con orario e istanti con fuso.',
  whenToUse: ['Date in form, con digitazione rapida e calendario facoltativo.', 'Intervalli (soggiorni, report) con DateRangePicker.'],
  whenNotToUse: ['Solo orario: usa TimeInput.', 'Calendario sempre visibile: usa Calendar.'],
  props: [
    { name: 'label / description / errorMessage', type: 'ReactNode', description: 'Anatomia di campo standard.' },
    { name: 'value / defaultValue / onChange', type: 'CalendarDate | CalendarDateTime | ZonedDateTime | null (range: { start, end })', description: 'Il tipo del valore determina il significato: data civile o istante con fuso.' },
    { name: 'granularity', type: "'day' | 'hour' | 'minute' | 'second'", default: "'day' (o 'minute' con valori con orario)", description: 'Segmenti mostrati.' },
    { name: 'minValue / maxValue / isDateUnavailable', type: 'DateValue / (date) => boolean', description: 'Vincoli, validati anche al submit.' },
    { name: 'firstDayOfWeek', type: "'sun' | 'mon' | …", description: 'Primo giorno della settimana nel calendario.' },
    { name: 'visibleMonths', type: 'number', default: '1', description: 'Mesi nel popover.' },
    { name: 'calendarErrorMessage', type: 'ReactNode', description: 'Messaggio nel calendario per date non disponibili.' },
    { name: 'name (startName / endName)', type: 'string', description: 'Valori ISO inviati con il form.' },
    { name: 'isRequired / isInvalid / isDisabled / isReadOnly', type: 'boolean', description: 'Stati del campo.' },
    { name: 'popoverProps', type: 'PopoverSurfaceProps', description: 'Posizionamento e classi del popover.' },
  ],
  inherits: 'Props di DatePicker / DateRangePicker di react-aria-components (hourCycle, hideTimeZone, validate…).',
  keyboard: [
    { keys: 'Tab', action: 'Segmento successivo, poi pulsante calendario.' },
    { keys: 'Frecce su/giù, cifre', action: 'Modifica il segmento.' },
    { keys: 'Backspace', action: 'Svuota il segmento.' },
    { keys: 'Alt + Freccia giù', action: 'Apre il calendario; Esc lo chiude e il focus torna al campo.' },
  ],
  accessibility: [
    'Segmenti come spinbutton etichettati; pulsante con nome localizzato “Apri calendario”.',
    'Il popover è un dialog con focus sulla data selezionata e ripristino del focus alla chiusura.',
    'Il popover eredita il tema del ThemeProvider di origine, anche annidato.',
  ],
  responsive: ['Il campo si restringe con il contenitore; il popover resta nel viewport e i mesi vanno a capo.'],
  customization: ['className sul campo, popoverProps.className sul popover.'],
  commonMistakes: [
    'Convertire una CalendarDate in Date JavaScript con toDate(fuso locale) e poi serializzare in UTC: il giorno può spostarsi. Serializza con toString().',
    'Usare ZonedDateTime per date civili (compleanni, scadenze): usa CalendarDate.',
    'Aspettarsi onChange a ogni tasto: il valore viene confermato quando il campo è completo e perde il focus.',
  ],
  examples: [
    { name: 'Basic', title: 'Base' },
    { name: 'Controlled', title: 'Controllato con limiti' },
    { name: 'Range', title: 'Intervallo' },
    { name: 'ZonedInstant', title: 'Istante con fuso orario' },
    { name: 'Validation', title: 'Validazione nel form' },
  ],
  status: {
    implemented: true,
    documented: true,
    tests: ['components/DatePicker/DatePicker.test.tsx'],
    limits: [
      'Con ZonedDateTime, modificare il giorno attraverso un cambio d’ora legale può spostare l’orario locale (es. 01:30 → 02:30): comportamento di @internationalized/date, da verificare nei casi critici.',
      'Nessun input di testo libero (es. “domani”): solo segmenti.',
    ],
  },
};