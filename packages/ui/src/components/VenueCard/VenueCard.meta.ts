import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['VenueCard', 'VenueCardProps'],
  name: 'VenueCard',
  slug: 'venue-card',
  category: 'community',
  summary: 'Informazioni testuali sulla sede, indicazioni di accessibilità e link mappa fornito dal consumer.',
  whenToUse: ['Presentare indirizzo, indicazioni e informazioni di accessibilità di una sede.'],
  whenNotToUse: ['Incorporare una mappa interattiva: usa VenueMap.', 'Mostrare la piantina interna della sede: usa VenueFloorPlan.'],
  props: [
    { name: 'name', type: 'ReactNode', required: true, description: 'Nome della sede.' },
    { name: 'address', type: 'ReactNode', required: true, description: 'Indirizzo postale.' },
    { name: 'accessibility', type: 'ReactNode', description: 'Dettagli accessibilità.' },
    { name: 'mapHref', type: 'string', description: 'Link mappa fornito dall’applicazione.' },
  ],
  inherits: 'Attributi HTML di <article> eccetto title.',
  keyboard: [{ keys: 'Tab / Enter', action: 'Raggiunge il link esterno per le indicazioni, se presente.' }],
  accessibility: ['L’indirizzo usa <address>; il link che apre una nuova scheda lo comunica agli screen reader.'],
  responsive: ['Il contenuto fluisce verticalmente senza larghezza fissa.'],
  customization: ['Usa token --dc-* e className sul contenitore.'],
  commonMistakes: ['Fornire mapHref a un provider scelto dal consumer; nessuna mappa è generata o incorporata.'],
  examples: [{ name: 'Basic', title: 'Sede con informazioni accessibili' }],
  status: { implemented: true, documented: true, tests: ['components/VenueCard/VenueCard.test.tsx'], limits: ['Non incorpora provider di mappe.'] },
};
