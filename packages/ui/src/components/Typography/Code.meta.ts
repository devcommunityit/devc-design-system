import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['Code', 'Kbd'],
  name: 'Code e KeyboardKey',
  slug: 'code',
  category: 'typography',
  summary: 'Codice in linea (<code>) e tasti o combinazioni da tastiera (<kbd>).',
  whenToUse: ['Nomi di comandi, file, proprietà; scorciatoie da tastiera.'],
  whenNotToUse: ['Blocchi di codice su più righe: usa CodeBlock.'],
  props: [{ name: 'Kbd.keys', type: 'string[]', description: 'Combinazione, es. [\'Ctrl\', \'K\']; in alternativa usa children.' }],
  inherits: 'Attributi HTML globali; ref all’elemento.',
  keyboard: [],
  accessibility: ['Il simbolo “+” tra i tasti è decorativo (aria-hidden); i tasti sono letti in sequenza.', 'Su macOS considera di mostrare ⌘ al posto di Ctrl.'],
  responsive: ['Il codice in linea va a capo per evitare overflow.'],
  customization: ['Selettori .dc-typography-code, .dc-typography-kbd; font: token font.family.mono.'],
  commonMistakes: ['Usare Code per evidenziare parole che non sono codice.'],
  examples: [
    { name: 'InlineCode', title: 'Codice in linea' },
    { name: 'Shortcut', title: 'Scorciatoie' },
  ],
  status: { implemented: true, documented: true, tests: ['components/Typography/Typography.test.tsx'], limits: [] },
};