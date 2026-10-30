import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['Text', 'Heading'],
  name: 'Text e Heading',
  slug: 'text',
  category: 'typography',
  summary:
    'Text applica i ruoli tipografici (display, headline, title, body, label) e i toni semantici. Heading separa il livello semantico (h1–h6) dalla dimensione visiva.',
  whenToUse: ['Tutto il testo dell’interfaccia, per mantenere scala e toni coerenti con i token.'],
  whenNotToUse: ['Testi lunghi con markup ricco (articoli): usa HTML semantico con la classe del tuo CMS e i token.'],
  props: [
    { name: 'variant', type: 'TypographyRole', default: "'body-md'", description: 'Ruolo tipografico (token typography.*).' },
    { name: 'tone', type: "'primary' | 'secondary' | 'muted' | 'link' | 'danger' | 'success' | 'warning' | 'inherit'", default: "'primary'", description: 'Colore semantico.' },
    { name: 'weight', type: "'regular' | 'medium' | 'semibold' | 'bold'", description: 'Peso, se diverso da quello del ruolo.' },
    { name: 'as', type: "'p' | 'span' | 'div' | 'strong' | 'em' | 'small' | 'label'", default: "'p'", description: 'Elemento renderizzato.' },
    { name: 'truncate', type: 'boolean', default: 'false', description: 'Una riga con ellissi. Per più righe e accesso al testo completo usa Truncate.' },
    { name: 'align', type: "'start' | 'center' | 'end'", description: 'Allineamento logico (RTL-safe).' },
    { name: 'Heading.level', type: '1–6', required: true, description: 'Livello semantico.' },
    { name: 'Heading.size', type: 'display | headline-* | title-*', description: 'Dimensione visiva; predefinita in base al livello.' },
  ],
  inherits: 'Attributi HTML globali; ref all’elemento.',
  keyboard: [],
  accessibility: [
    'Il tono non è l’unico veicolo di significato: accompagna danger/success/warning con testo o icona.',
    'I toni rispettano il contrasto AA sulle superfici del tema predefinito; verifica i temi personalizzati nel Theme Builder.',
    'Con truncate, rendi disponibile il testo completo (title, tooltip o Truncate con pulsante).',
  ],
  responsive: ['Le dimensioni sono in rem: seguono lo zoom e la dimensione del testo dell’utente.'],
  customization: ['Token --dc-typography-<ruolo>-{size,line-height,weight,letter-spacing}; selettore .dc-typography-text[data-variant][data-tone].'],
  commonMistakes: ['Scegliere il livello di Heading per l’aspetto: usa size.', 'Usare tone="muted" per testo essenziale (contrasto più basso).'],
  examples: [
    { name: 'Scale', title: 'Scala tipografica' },
    { name: 'Tones', title: 'Toni semantici' },
    { name: 'HeadingLevels', title: 'Livello e dimensione' },
    { name: 'SingleLineTruncate', title: 'Troncamento su una riga' },
  ],
  status: { implemented: true, documented: true, tests: ['components/Typography/Typography.test.tsx'], limits: [] },
};