import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['OrderSummary', 'OrderSummaryProps', 'OrderSummaryItem'],
  name: 'OrderSummary',
  slug: 'order-summary',
  category: 'community',
  summary: 'Riepilogo di voci e importi forniti dal chiamante, senza effettuare transazioni.',
  whenToUse: ['Mostrare il breakdown di un ordine prima della conferma.'],
  whenNotToUse: ['Calcolare imposte o gestire checkout: gli importi sono forniti dal chiamante.'],
  props: [
    { name: 'items', type: 'OrderSummaryItem[]', description: 'Voci dell’ordine.', required: true },
    { name: 'subtotal / total', type: 'number', description: 'Importi già calcolati.', required: true },
    { name: 'currency', type: 'string', description: 'Codice valuta ISO 4217.', required: true },
    { name: 'discount / tax', type: 'number', description: 'Righe opzionali già calcolate.' },
    { name: 'subtotalLabel / discountLabel / taxLabel / totalLabel', type: 'ReactNode', description: 'Etichette localizzabili delle righe di riepilogo.' },
  ],
  inherits: 'Attributi HTML di <section>.',
  keyboard: [],
  accessibility: ['Usa un elenco descrittivo per associare ogni importo alla propria etichetta.'],
  responsive: ['Etichette lunghe vanno a capo senza sovrapporsi agli importi.'],
  customization: ['Usa token --dc-* per superfici, bordi e tipografia.'],
  commonMistakes: ['Passare importi incoerenti: la componente non ricalcola il totale.'],
  examples: [{ name: 'Basic', title: 'Riepilogo semplice' }],
  status: { implemented: true, documented: true, tests: ['components/OrderSummary/OrderSummary.test.tsx'], limits: ['Non calcola imposte, sconti o pagamenti.'] },
};
