import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['CouponInput', 'CouponInputProps', 'CouponStatus'],
  name: 'CouponInput',
  slug: 'coupon-input',
  category: 'forms',
  summary: 'Campo controllato per inoltrare un codice coupon e visualizzare uno stato esterno.',
  whenToUse: ['Raccogliere un codice sconto in un checkout gestito dall’app.'],
  whenNotToUse: ['Validare o applicare coupon nel client: demanda la logica al chiamante.'],
  props: [
    { name: 'value / onChange', type: 'string / (value: string) => void', description: 'Codice controllato.', required: true },
    { name: 'onApply', type: '(value: string) => void', description: 'Invio del valore, senza validazione.', required: true },
    { name: 'label / applyLabel', type: 'ReactNode', description: 'Etichette visibili del campo e dell’azione.', required: true },
    { name: 'status', type: 'CouponStatus', description: 'Esito controllato dal chiamante.', required: true },
    { name: 'message', type: 'ReactNode', description: 'Messaggio opzionale associato allo stato.' },
  ],
  inherits: 'Attributi HTML di <form>.',
  keyboard: [{ keys: 'Tab, Invio', action: 'Modifica il codice e invia il form.' }],
  accessibility: ['TextField fornisce un’etichetta associata.', 'Errori e stati sono annunciati in una live region.'],
  responsive: ['Il pulsante va sotto il campo su viewport stretti.'],
  customization: ['Composto con TextField e Button; CSS con token --dc-*.'],
  commonMistakes: ['Aspettarsi che la componente validi o applichi il coupon.'],
  examples: [{ name: 'Basic', title: 'Campo coupon' }],
  status: { implemented: true, documented: true, tests: ['components/CouponInput/CouponInput.test.tsx'], limits: ['Nessuna validazione o applicazione locale.'] },
};
