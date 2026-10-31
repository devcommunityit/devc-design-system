import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['Calendar', 'RangeCalendar'],
  name: 'Calendar / RangeCalendar',
  slug: 'calendar',
  category: 'data',
  summary: 'Griglia mensile per scegliere una data o un intervallo, localizzata, con limiti e date non disponibili.',
  whenToUse: ['Disponibilità visibile in pagina (prenotazioni, agenda).', 'Selezione di intervalli in cui il contesto del mese aiuta.'],
  whenNotToUse: ['Campo di form compatto: usa DatePicker / DateRangePicker.', 'Date lontane (es. data di nascita): digitare è più rapido.'],
  props: [
    { name: 'value / defaultValue / onChange', type: 'DateValue | null · RangeValue<DateValue> | null', description: 'Data o intervallo controllato o non controllato.' },
    { name: 'minValue / maxValue', type: 'DateValue', description: 'Limiti: i giorni fuori limite sono disabilitati e la navigazione si ferma.' },
    { name: 'isDateUnavailable', type: '(date) => boolean', description: 'Giorni non selezionabili (barrati, non solo colorati).' },
    { name: 'firstDayOfWeek', type: "'sun' | 'mon' | … | 'sat'", description: 'Sostituisce il primo giorno della settimana dedotto dal locale.' },
    { name: 'visibleMonths', type: 'number', default: '1', description: 'Mesi affiancati (vanno a capo su schermi stretti).' },
    { name: 'showMonthYearPicker', type: 'boolean', default: 'false', description: 'Selettori nativi di mese e anno al posto del titolo, per saltare rapidamente a date lontane.' },
    { name: 'errorMessage', type: 'ReactNode', description: 'Mostrato se isInvalid o la data selezionata è non disponibile.' },
    { name: 'allowsNonContiguousRanges', type: 'boolean', description: 'RangeCalendar: consente intervalli che includono giorni non disponibili.' },
  ],
  inherits: 'Props di Calendar / RangeCalendar di react-aria-components (focusedValue, isReadOnly, isDisabled…).',
  keyboard: [
    { keys: 'Frecce', action: 'Giorno precedente/successivo, settimana precedente/successiva.' },
    { keys: 'Pagina su / giù', action: 'Mese precedente/successivo (Maiusc: anno).' },
    { keys: 'Home / End', action: 'Inizio / fine settimana.' },
    { keys: 'Invio / Spazio', action: 'Seleziona (in RangeCalendar: inizio, poi fine).' },
  ],
  accessibility: [
    'Pattern APG “Date picker dialog” per la griglia; intestazioni dei giorni con nome completo.',
    'Oggi, selezione e indisponibilità non sono affidati soltanto al colore (bordo, riempimento, barratura).',
  ],
  responsive: ['Celle con area minima di tocco; più mesi vanno a capo invece di causare overflow.'],
  customization: ['className sul contenitore; i colori derivano dai ruoli color.action.* e color.surface.*.'],
  commonMistakes: [
    'Convertire CalendarDate in Date con il fuso locale: il giorno può spostarsi. Usa date.toString() (YYYY-MM-DD).',
    'Usare new Date() come value: usa parseDate o today(getLocalTimeZone()).',
  ],
  examples: [
    { name: 'Basic', title: 'Base' },
    { name: 'Controlled', title: 'Controllato con limiti e weekend non disponibili' },
    { name: 'Range', title: 'Intervallo su due mesi' },
    { name: 'Localized', title: 'Localizzazione e inizio settimana' },
    { name: 'MonthYear', title: 'Selettori di mese e anno' },
  ],
  status: { implemented: true, documented: true, tests: ['components/Calendar/Calendar.test.tsx'], limits: ['Solo calendario gregoriano negli esempi; altri sistemi sono supportati da @internationalized/date ma non sono testati.'] },
};
