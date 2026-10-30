import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['TimeInput'],
  name: 'TimeInput',
  slug: 'time-input',
  category: 'forms',
  summary: 'Campo orario a segmenti, localizzato (12/24 ore) con limiti e validazione.',
  whenToUse: ['Orari senza data (apertura, promemoria giornaliero).'],
  whenNotToUse: ['Data e ora insieme: usa DatePicker con granularity="minute".', 'Durate: usa NumberInput con unità.'],
  props: [
    { name: 'label / description / errorMessage', type: 'ReactNode', description: 'Anatomia di campo standard.' },
    { name: 'value / defaultValue / onChange', type: 'Time | CalendarDateTime | ZonedDateTime | null', description: 'Orario controllato o non controllato.' },
    { name: 'granularity', type: "'hour' | 'minute' | 'second'", default: "'minute'", description: 'Segmenti visibili.' },
    { name: 'hourCycle', type: '12 | 24', description: 'Forza il formato; di default dipende dal locale.' },
    { name: 'minValue / maxValue', type: 'TimeValue', description: 'Limiti validati.' },
    { name: 'showIcon', type: 'boolean', default: 'false', description: 'Icona orologio decorativa.' },
    { name: 'isRequired / isInvalid / isDisabled / isReadOnly', type: 'boolean', description: 'Stati del campo.' },
  ],
  inherits: 'Props di TimeField di react-aria-components (name, validate, hideTimeZone…).',
  keyboard: [
    { keys: 'Tab', action: 'Segmento successivo.' },
    { keys: 'Frecce su/giù, cifre', action: 'Modifica il segmento.' },
    { keys: 'Backspace', action: 'Svuota il segmento.' },
  ],
  accessibility: ['Ogni segmento è uno spinbutton con nome (ora, minuti) e valore testuale.', 'L’icona è decorativa (aria-hidden).'],
  responsive: ['Larghezza fluida; segmenti con area di tocco sufficiente.'],
  customization: ['className e style sul campo.'],
  commonMistakes: ['Salvare l’orario come Date: usa Time.toString() (HH:mm:ss).'],
  examples: [
    { name: 'Basic', title: 'Base' },
    { name: 'Controlled', title: 'Controllato con limiti' },
    { name: 'HourCycle', title: '12 ore e secondi' },
    { name: 'States', title: 'Stati' },
  ],
  status: { implemented: true, documented: true, tests: ['components/TimeInput/TimeInput.test.tsx'], limits: [] },
};