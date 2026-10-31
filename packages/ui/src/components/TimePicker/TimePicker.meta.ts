import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['TimePicker'],
  name: 'TimePicker',
  slug: 'time-picker',
  category: 'forms',
  summary: 'Campo orario a segmenti con popover di orari a passo fisso, orari non disponibili e cancellazione.',
  whenToUse: ['Scelta di un orario tra slot regolari (ogni 15/30/60 minuti).', 'Orari di apertura, promemoria, turni.'],
  whenNotToUse: [
    'Data e ora insieme: usa DateTimePicker.',
    'Orari arbitrari al secondo senza elenco: usa TimeInput.',
    'Durate: usa NumberInput con unità.',
  ],
  props: [
    { name: 'label / description / errorMessage', type: 'ReactNode', description: 'Anatomia di campo standard.' },
    { name: 'value / defaultValue / onChange', type: 'Time | null', description: 'Orario civile, senza data né fuso.' },
    { name: 'step', type: 'number', default: '30', description: 'Passo in minuti dell’elenco.' },
    { name: 'minValue / maxValue', type: 'Time', description: 'Limiti: gli orari fuori intervallo sono disabilitati e validati.' },
    { name: 'isTimeUnavailable', type: '(time: Time) => boolean', description: 'Disabilita singoli orari nell’elenco.' },
    { name: 'hourCycle', type: '12 | 24', description: 'Forza il formato (di default segue la lingua).' },
    { name: 'isClearable', type: 'boolean', default: 'false', description: 'Pulsante per svuotare il campo.' },
    { name: 'popoverProps', type: 'PopoverSurfaceProps', description: 'Posizionamento e classi del popover.' },
  ],
  inherits: 'Props di TimeField di react-aria-components (granularity, name, isRequired, validate…).',
  keyboard: [
    { keys: 'Frecce su/giù, cifre', action: 'Modifica il segmento.' },
    { keys: 'Alt + Freccia giù', action: 'Apre l’elenco orari.' },
    { keys: 'Frecce / Home / Fine nell’elenco', action: 'Sposta la selezione; Invio conferma e chiude.' },
    { keys: 'Esc', action: 'Chiude l’elenco; il focus torna al campo.' },
  ],
  accessibility: [
    'Pulsante con nome localizzato “Scegli orario”; il popover è un dialog con listbox “Orari”.',
    'All’apertura il focus va sull’orario selezionato, che viene portato in vista.',
  ],
  responsive: ['L’elenco ha altezza massima e scorre; il popover resta nel viewport.'],
  customization: ['className sul campo, popoverProps.className sul popover.'],
  commonMistakes: [
    'Usare TimePicker per un istante preciso con fuso: usa DateTimePicker con ZonedDateTime.',
    'Affidarsi a step come validazione: il campo accetta qualsiasi orario digitato.',
  ],
  examples: [
    { name: 'Basic', title: 'Base' },
    { name: 'OpeningHours', title: 'Passo e limiti' },
    { name: 'Clearable', title: 'Cancellabile' },
    { name: 'TwelveHour', title: 'Formato 12 ore' },
  ],
  status: {
    implemented: true,
    documented: true,
    tests: ['components/TimePicker/TimePicker.test.tsx'],
    limits: ['L’elenco mostra ore e minuti; i secondi si impostano solo dai segmenti.'],
  },
};
