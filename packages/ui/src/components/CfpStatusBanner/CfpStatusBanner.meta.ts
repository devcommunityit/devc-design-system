import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['CfpStatusBanner', 'CfpStatusBannerProps', 'CfpStatus'],
  name: 'CfpStatusBanner',
  slug: 'cfp-status-banner',
  category: 'community',
  summary: 'Banner di stato della call for papers con scadenza e azione opzionale consumer-provided.',
  whenToUse: ['Comunicare lo stato corrente di una call e la sua scadenza.'],
  whenNotToUse: ['Aprire o chiudere una call, inviare proposte o gestire workflow.'],
  props: [
    { name: 'status', type: "'open' | 'upcoming' | 'closed' | 'paused'", required: true, description: 'Stato corrente fornito dal consumer.' },
    { name: 'title', type: 'ReactNode', required: true, description: 'Titolo del banner.' },
    { name: 'description', type: 'ReactNode', description: 'Informazioni di supporto.' },
    { name: 'deadline', type: 'string', description: 'Scadenza leggibile e machine-readable.' },
    { name: 'action', type: 'ReactNode', description: 'Link o controllo fornito dal consumer.' },
  ],
  inherits: 'Attributi HTML di <aside> eccetto title.',
  keyboard: [{ keys: 'Tab / Enter', action: 'Raggiunge gli eventuali controlli forniti nel banner.' }],
  accessibility: ['L’aside è etichettato dal titolo; lo stato è espresso con testo, non solo colore.'],
  responsive: ['Il contenuto e l’azione vanno a capo quando lo spazio è limitato.'],
  customization: ['Usa token --dc-* e className sul contenitore.'],
  commonMistakes: ['Non dedurre lo stato da un orologio locale: passare lo stato deciso dall’applicazione.'],
  examples: [{ name: 'Open', title: 'Call aperta' }, { name: 'Closed', title: 'Call chiusa' }],
  status: { implemented: true, documented: true, tests: ['components/CfpStatusBanner/CfpStatusBanner.test.tsx'], limits: ['Nessun flusso CFP o azione automatica integrati.'] },
};
