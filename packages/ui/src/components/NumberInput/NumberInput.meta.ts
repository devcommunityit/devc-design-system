import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['NumberInput'],
  name: 'NumberInput',
  slug: 'number-input',
  category: 'forms',
  summary: 'Input numerico localizzato: interpreta e formatta con Intl.NumberFormat (valute, percentuali, unità), limita a min/max e incrementa con pulsanti, frecce e rotella.',
  whenToUse: ['Quantità, importi, percentuali con eventuali limiti.'],
  whenNotToUse: ['Codici numerici (CAP, telefono, IBAN): usa TextField con inputMode="numeric".', 'Valori approssimativi in un intervallo: usa Slider.'],
  props: [
    { name: 'value / defaultValue', type: 'number', description: 'Valore numerico (NaN quando vuoto).' },
    { name: 'onChange', type: '(value: number) => void', description: 'Chiamato al commit (blur, Enter, step).' },
    { name: 'minValue / maxValue / step', type: 'number', description: 'Limiti e passo.' },
    { name: 'formatOptions', type: 'Intl.NumberFormatOptions', description: 'Formato (currency, percent, unit, decimali).' },
    { name: 'hideSteppers', type: 'boolean', default: 'false', description: 'Nasconde i pulsanti −/+.' },
    { name: 'startAdornment', type: 'ReactNode', description: 'Icona decorativa.' },
  ],
  inherits: 'Props di react-aria-components NumberField.',
  keyboard: [
    { keys: 'Freccia su/giù', action: 'Incrementa/decrementa di step.' },
    { keys: 'Pagina su/giù', action: 'Passi più ampi.' },
    { keys: 'Home / Fine', action: 'Vai a minimo/massimo.' },
  ],
  accessibility: ['I pulsanti hanno etichette localizzate e sono esclusi dal Tab (evitano fermate ridondanti).', 'Il valore formattato è letto dagli screen reader.'],
  responsive: ['Tastiera numerica/decimale su mobile in base al formato.'],
  customization: ['Cifre tabellari; valore centrato quando i pulsanti sono visibili.'],
  commonMistakes: ['Aspettarsi onChange a ogni tasto: avviene al commit.', 'Usarlo per identificativi con zeri iniziali.'],
  examples: [
    { name: 'Basic', title: 'Base' },
    { name: 'Formats', title: 'Formati' },
    { name: 'Controlled', title: 'Controllato' },
    { name: 'States', title: 'Stati' },
  ],
  status: { implemented: true, documented: true, tests: ['components/NumberInput/NumberInput.test.tsx'], limits: [] },
};