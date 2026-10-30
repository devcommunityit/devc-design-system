import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['IconButton'],
  name: 'IconButton',
  slug: 'icon-button',
  category: 'actions',
  summary: 'Pulsante quadrato con sola icona per azioni frequenti e riconoscibili (chiudi, modifica, impostazioni).',
  whenToUse: ['Barre degli strumenti, intestazioni di card e righe di tabella con poco spazio.', 'Icone universalmente comprese (chiudi, cerca, menu).'],
  whenNotToUse: ['Azioni ambigue o rare: preferisci Button con testo.', 'Stati on/off: usa Toggle con icona e aria-label.'],
  props: [
    { name: 'label', type: 'string', required: true, description: 'Nome accessibile (aria-label). Obbligatorio.' },
    { name: 'icon', type: 'ReactNode', required: true, description: 'Icona decorativa, nascosta alle tecnologie assistive.' },
    { name: 'variant', type: "'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'", default: "'ghost'", description: 'Enfasi visiva.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Lato del quadrato, pari all’altezza dei controlli.' },
    { name: 'isPending / isDisabled', type: 'boolean', default: 'false', description: 'Come Button.' },
  ],
  inherits: 'Tutte le props di Button tranne children, startIcon, endIcon e fullWidth.',
  keyboard: [{ keys: 'Enter / Space', action: 'Attiva il pulsante.' }],
  accessibility: [
    'Il nome accessibile deriva da label: TypeScript lo rende obbligatorio.',
    'Per utenti vedenti, se l’icona non è ovvia, aggiungi un Tooltip con lo stesso testo.',
    'Il lato minimo è 24 px anche in densità compatta (WCAG 2.5.8).',
  ],
  responsive: ['Dimensione stabile: non si deforma in contenitori flessibili (flex: none).'],
  customization: ['Stesse variabili di Button; selettore .dc-icon-button-icon-button.'],
  commonMistakes: ['Inserire testo visibile come children: usa Button.', 'Usare label generiche come “Pulsante” o “Icona”.'],
  examples: [
    { name: 'Basic', title: 'Base', description: 'Il contatore dimostra che le pressioni vengono gestite.' },
    { name: 'Sizes', title: 'Dimensioni' },
    { name: 'States', title: 'Stati' },
  ],
  status: { implemented: true, documented: true, tests: ['components/Toggle/Toggle.test.tsx'], limits: [] },
  apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/button/',
};