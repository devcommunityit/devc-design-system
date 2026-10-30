import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['Spinner'],
  name: 'Spinner',
  slug: 'spinner',
  category: 'feedback',
  summary: 'Indicatore di caricamento indeterminato per attese brevi.',
  whenToUse: ['Attese brevi senza stima della durata.', 'Stato pending di un pulsante (Button isPending lo include).'],
  whenNotToUse: ['Caricamento di contenuti strutturati: usa Skeleton.', 'Avanzamento misurabile: usa Progress.'],
  props: [
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Dimensione.' },
    { name: 'label', type: 'string | null', default: 'messaggio localizzato "Caricamento…"', description: 'Nome accessibile; null quando il testo vicino annuncia già il caricamento.' },
  ],
  inherits: 'Attributi HTML di <span>; ref al <span>.',
  keyboard: [],
  accessibility: ['role="status" con etichetta localizzata.', 'Con prefers-reduced-motion la rotazione rallenta fortemente.', 'Usa label={null} per evitare annunci doppi.'],
  responsive: ['Dimensione fissa, inline.'],
  customization: ['Il colore segue currentColor.'],
  commonMistakes: ['Usare uno spinner a pagina intera per caricamenti lunghi: preferisci Skeleton.'],
  examples: [
    { name: 'Sizes', title: 'Dimensioni' },
    { name: 'WithText', title: 'Con testo visibile' },
    { name: 'InButton', title: 'Dentro un pulsante' },
    { name: 'SimulatedLoading', title: 'Caricamento controllato', description: 'Il pulsante avvia un caricamento simulato in locale (setTimeout con pulizia); Annulla lo interrompe.' },
    { name: 'LocalizedLabels', title: 'Etichette localizzate e personalizzate', description: 'Etichetta predefinita in italiano e in inglese (LocaleProvider en-US) e un testo personalizzato lungo.' },
  ],
  status: { implemented: true, documented: true, tests: ['components/Button/Button.test.tsx'], limits: [] },
};
