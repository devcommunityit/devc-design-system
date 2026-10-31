import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['ReferralCard', 'ReferralCardProps'],
  name: 'ReferralCard',
  slug: 'referral-card',
  category: 'community',
  summary: 'Presenta un codice e un link referral delegando il copia-incolla al consumer.',
  whenToUse: ['Mostrare i dettagli di un referral e richiedere al consumer un’azione di copia.'],
  whenNotToUse: ['Per condividere contenuti usa ShareButtons quando l’invio o la copia sono desiderati.'],
  props: [
    { name: 'title', type: 'string', required: true, description: 'Titolo della card.' },
    { name: 'description', type: 'ReactNode', description: 'Spiegazione facoltativa.' },
    { name: 'referralCode', type: 'string', required: true, description: 'Codice referral mostrato.' },
    { name: 'referralUrl', type: 'string', required: true, description: 'URL referral mostrato come link.' },
    { name: 'copyLabel', type: 'string', required: true, description: 'Etichetta del pulsante di copia.' },
    { name: 'onCopyRequest', type: '() => void', required: true, description: 'Callback di richiesta: la copia resta a carico del consumer.' },
  ],
  keyboard: [{ keys: 'Tab / Invio / Spazio', action: 'Raggiunge il link e il pulsante di richiesta copia.' }],
  accessibility: ['Codice e URL hanno termini visibili in una lista di descrizione.'],
  responsive: ['Gli URL lunghi vanno a capo senza allargare la card.'],
  customization: ['Colori, bordi e spaziature usano token --dc-*.'],
  commonMistakes: ['Il pulsante non copia direttamente né registra l’azione.'],
  examples: [{ name: 'Basic', title: 'Referral' }],
  status: { implemented: true, documented: true, tests: ['components/ReferralCard/ReferralCard.test.tsx'], limits: ['La copia effettiva è implementata dal consumer.'] },
};
