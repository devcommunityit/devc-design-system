import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['PaymentMethodCard', 'PaymentMethodCardProps'],
  name: 'PaymentMethodCard',
  slug: 'payment-method-card',
  category: 'community',
  summary: 'Mostra un metodo di pagamento salvato usando esclusivamente dati mascherati.',
  whenToUse: ['Elencare un metodo di pagamento con brand, ultime quattro cifre e scadenza.'],
  whenNotToUse: ['Raccogliere dati di carta o processare pagamenti.'],
  props: [
    { name: 'brand / lastFour / expiry', type: 'ReactNode / string / ReactNode', description: 'Dati mascherati del metodo.', required: true },
    { name: 'selected', type: 'boolean', description: 'Indica il metodo corrente controllato.', required: true },
    { name: 'onSelect / onRemove', type: '() => void', description: 'Azioni delegate al chiamante.' },
  ],
  inherits: 'Attributi HTML di <article>.',
  keyboard: [{ keys: 'Tab, Invio, Spazio', action: 'Raggiunge e attiva le azioni disponibili.' }],
  accessibility: ['Le azioni sono pulsanti nativi del design system.', 'L’interfaccia mostra solo le ultime quattro cifre; non accetta dati carta completi.'],
  responsive: ['Dettagli e azioni vanno a capo nei contenitori stretti.'],
  customization: ['Composto con Button e token --dc-*.'],
  commonMistakes: ['Passare o richiedere PAN, CVV o altri dati completi della carta.'],
  examples: [{ name: 'Basic', title: 'Metodo salvato mascherato' }],
  status: { implemented: true, documented: true, tests: ['components/PaymentMethodCard/PaymentMethodCard.test.tsx'], limits: ['Non memorizza né processa dati di pagamento.'] },
};
