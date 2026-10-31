import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['MembershipCard', 'MembershipCardProps', 'MembershipStatus'],
  name: 'MembershipCard',
  slug: 'membership-card',
  category: 'community',
  summary: 'Riepilogo presentazionale dello stato e del piano di un’iscrizione.',
  whenToUse: ['Mostrare piano, stato e prossima scadenza associati a una membership.'],
  whenNotToUse: ['Confrontare piani: usa PricingTable.', 'Gestire pagamenti: non è un checkout.'],
  props: [
    { name: 'title / plan', type: 'ReactNode', description: 'Nome della membership e piano corrente.', required: true },
    { name: 'status / statusLabel', type: 'MembershipStatus / ReactNode', description: 'Stato strutturato e relativa etichetta visibile.', required: true },
    { name: 'renewal', type: 'ReactNode', description: 'Data o testo di rinnovo fornito dal chiamante.' },
    { name: 'actionLabel / onAction', type: 'ReactNode / () => void', description: 'Azione opzionale delegata al chiamante.' },
  ],
  inherits: 'Attributi HTML di <section>.',
  keyboard: [{ keys: 'Tab, Invio, Spazio', action: 'Raggiunge e attiva l’azione opzionale.' }],
  accessibility: ['La card è una regione nominata.', 'Lo stato è espresso con testo, non solo colore.'],
  responsive: ['L’intestazione va a capo nei contenitori stretti.'],
  customization: ['Colori, bordi e spaziature usano token --dc-*.'],
  commonMistakes: ['Usare questa card come flusso di checkout o fonte di stato.'],
  examples: [{ name: 'Basic', title: 'Membership attiva' }],
  status: { implemented: true, documented: true, tests: ['components/MembershipCard/MembershipCard.test.tsx'], limits: ['Non gestisce pagamenti o rinnovi.'] },
};
