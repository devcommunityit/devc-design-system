import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['GradientText', 'GradientTextProps', 'GradientTextElement', 'GradientTextTone'],
  name: 'GradientText',
  slug: 'gradient-text',
  category: 'community',
  summary:
    'Testo inline riempito con il gradiente del brand (background-clip: text), per evidenziare una parte di un titolo. Ripiega su un colore pieno dove il ritaglio non è supportato e in forced-colors.',
  whenToUse: [
    'Evidenziare poche parole chiave in un titolo di hero o di sezione.',
    'Numeri o slogan brevi in landing page della community.',
  ],
  whenNotToUse: [
    'Paragrafi o testo lungo: riduce la leggibilità.',
    'Comunicare uno stato (errore, successo): usa i toni di Text o un Badge.',
  ],
  props: [
    { name: 'as', type: "'span' | 'strong' | 'em' | 'b' | 'mark'", default: "'span'", description: 'Elemento inline da rendere (strong/em per enfasi semantica).' },
    { name: 'tone', type: "'brand' | 'text' | 'inverse'", default: "'brand'", description: 'brand: primary → accent; text: link → accent per testo corrente; inverse: tinte chiare per superfici inverse (hero scure).' },
  ],
  inherits: 'Attributi HTML dell’elemento scelto; ref all’elemento.',
  keyboard: [],
  accessibility: [
    'Il testo resta testo reale: nessun impatto sul nome accessibile; usa as="strong" o "em" se l’enfasi è semantica.',
    'In forced-colors il gradiente è rimosso e il testo usa CanvasText; senza supporto a background-clip resta un colore pieno con contrasto adeguato.',
    'Gli estremi del gradiente sono token pensati per testo: verifica comunque il contrasto sullo sfondo reale (usa inverse su superfici scure).',
  ],
  responsive: ['Inline: va a capo con il titolo; box-decoration-break: clone mantiene il gradiente su ogni riga.'],
  customization: [
    'Token: --dc-gradient-accent (brand), --dc-gradient-text (text), --dc-color-surface-brand e --dc-color-accent-container (inverse).',
    'Selettore stabile: .dc-gradient-text-gradient-text[data-tone].',
  ],
  commonMistakes: [
    'Usare tone="brand" su sfondo scuro in tema chiaro: il contrasto è basso, usa inverse.',
    'Applicarlo a interi paragrafi o a link (il gradiente nasconde il colore del link).',
  ],
  examples: [
    { name: 'Basic', title: 'In un titolo' },
    { name: 'Tones', title: 'Toni', description: 'brand, text e inverse su superficie inversa.' },
  ],
  status: {
    implemented: true,
    documented: true,
    tests: ['components/GradientText/GradientText.test.tsx'],
    limits: ['Il gradiente richiede background-clip: text e interpolazione oklch; altrimenti resta il colore pieno.'],
  },
};
