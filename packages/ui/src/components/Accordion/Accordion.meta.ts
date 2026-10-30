import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['Accordion', 'AccordionItem', 'Collapsible'],
  name: 'Accordion e Collapsible',
  slug: 'accordion',
  category: 'data',
  summary: 'Sezioni espandibili con intestazione-pulsante. Collapsible è la singola sezione; Accordion ne coordina un gruppo.',
  whenToUse: ['FAQ e contenuti lunghi da consultare selettivamente.', 'Opzioni avanzate raramente necessarie.'],
  whenNotToUse: ['Contenuti che quasi tutti devono leggere: mostrali direttamente.', 'Navigazione tra viste parallele: usa Tabs.'],
  props: [
    { name: 'AccordionItem/Collapsible.title', type: 'ReactNode', required: true, description: 'Testo del pulsante di intestazione.' },
    { name: 'headingLevel', type: '2–6', default: '3', description: 'Livello del heading che avvolge il pulsante.' },
    { name: 'meta', type: 'ReactNode', description: 'Contenuto accessorio non interattivo accanto al titolo (badge, contatori).' },
    { name: 'variant', type: "'default' | 'plain'", default: "'default'", description: 'Con bordo o senza.' },
    { name: 'isExpanded / defaultExpanded / onExpandedChange', type: 'Collapsible', description: 'Stato controllato o non controllato della sezione.' },
    { name: 'Accordion.allowsMultipleExpanded', type: 'boolean', default: 'false', description: 'Permette più sezioni aperte.' },
    { name: 'Accordion.expandedKeys / defaultExpandedKeys / onExpandedChange', type: 'Iterable<Key>', description: 'Stato del gruppo; richiede id sulle sezioni.' },
  ],
  inherits: 'Props di Disclosure e DisclosureGroup di react-aria-components (isDisabled incluso).',
  keyboard: [
    { keys: 'Enter / Spazio', action: 'Apre o chiude la sezione.' },
    { keys: 'Tab', action: 'Passa all’intestazione successiva o al contenuto aperto.' },
  ],
  accessibility: ['Pulsante con aria-expanded e aria-controls dentro un heading.', 'Il contenuto chiuso è nascosto anche alle tecnologie assistive.', 'Il chevron è decorativo.'],
  responsive: ['Titoli lunghi vanno a capo; l’icona resta allineata alla prima riga.'],
  customization: ['className/style; token di bordo, superficie e motion (disattivata con prefers-reduced-motion).'],
  commonMistakes: ['Mettere elementi interattivi nel titolo: il titolo è già un pulsante.', 'Dimenticare gli id quando si controlla Accordion con expandedKeys.'],
  examples: [
    { name: 'Basic', title: 'FAQ (una sezione alla volta)' },
    { name: 'Multiple', title: 'Più sezioni aperte' },
    { name: 'ControlledCollapsible', title: 'Collapsible controllato' },
  ],
  status: { implemented: true, documented: true, tests: ['components/Data.test.tsx'], limits: [] },
  apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/accordion/',
};