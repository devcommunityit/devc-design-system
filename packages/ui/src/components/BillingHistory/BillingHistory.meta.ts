import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['BillingHistory', 'BillingHistoryProps', 'BillingRecord'],
  name: 'BillingHistory',
  slug: 'billing-history',
  category: 'community',
  summary: 'Tabella di fatture e movimenti di billing presentati dal chiamante.',
  whenToUse: ['Mostrare uno storico fatture in un’area account.'],
  whenNotToUse: ['Generare fatture o effettuare download autonomamente.'],
  props: [
    { name: 'title / records', type: 'ReactNode / BillingRecord[]', description: 'Titolo e righe dello storico.', required: true },
    { name: 'onDownload', type: '(recordId: string) => void', description: 'Callback opzionale per una fattura.' },
    { name: 'downloadLabel', type: 'ReactNode', description: 'Etichetta accessibile dell’azione.' },
  ],
  inherits: 'Attributi HTML di <section>.',
  keyboard: [{ keys: 'Tab, Invio, Spazio', action: 'Raggiunge e attiva le azioni fattura.' }],
  accessibility: ['Tabella HTML con intestazioni di colonna e riga.', 'Gli importi e gli stati sono testuali.'],
  responsive: ['La tabella scorre orizzontalmente nei contenitori stretti.'],
  customization: ['Usa Button per le azioni e token --dc-* per la tabella.'],
  commonMistakes: ['Aspettarsi che l’azione scarichi o richieda una fattura senza un callback consumer.'],
  examples: [{ name: 'Basic', title: 'Storico fatture' }],
  status: { implemented: true, documented: true, tests: ['components/BillingHistory/BillingHistory.test.tsx'], limits: ['Non recupera fatture né avvia download.'] },
};
