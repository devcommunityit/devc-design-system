import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['SubscriptionStatus', 'SubscriptionStatusProps', 'SubscriptionState'],
  name: 'SubscriptionStatus',
  slug: 'subscription-status',
  category: 'community',
  summary: 'Riepilogo controllato dello stato di una sottoscrizione e delle azioni consumer.',
  whenToUse: ['Mostrare stato, dettaglio e azioni subscription in account.'],
  whenNotToUse: ['Modificare lo stato o addebitare un pagamento.'],
  props: [
    { name: 'title / status / statusLabel', type: 'ReactNode / SubscriptionState / ReactNode', description: 'Nome e stato corrente.', required: true },
    { name: 'detail', type: 'ReactNode', description: 'Informazione aggiuntiva come la prossima data di rinnovo.' },
    { name: 'onPrimaryAction / onSecondaryAction', type: '() => void', description: 'Callback delle azioni opzionali.' },
  ],
  inherits: 'Attributi HTML di <section>.',
  keyboard: [{ keys: 'Tab, Invio, Spazio', action: 'Raggiunge e attiva le azioni.' }],
  accessibility: ['Lo stato è rappresentato da un’etichetta testuale oltre al colore.'],
  responsive: ['Titolo, stato e azioni vanno a capo in layout stretti.'],
  customization: ['Composto con Button e token --dc-*.'],
  commonMistakes: ['Affidare la comprensione dello stato al solo colore.'],
  examples: [{ name: 'Basic', title: 'Stato attivo' }],
  status: { implemented: true, documented: true, tests: ['components/SubscriptionStatus/SubscriptionStatus.test.tsx'], limits: ['Non effettua mutazioni o pagamenti.'] },
};
