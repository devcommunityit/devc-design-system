import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['TicketSelector', 'TicketSelectorProps', 'TicketOption'],
  name: 'TicketSelector',
  slug: 'ticket-selector',
  category: 'community',
  summary: 'Selettore controllato di tipologie e quantità di biglietti per un evento.',
  whenToUse: ['Presentare le opzioni e la disponibilità dei biglietti prima della registrazione.'],
  whenNotToUse: ['Gestire pagamenti, ordini o disponibilità lato server: queste responsabilità restano al consumer.'],
  props: [
    { name: 'tickets', type: 'TicketOption[]', required: true, description: 'Opzioni di biglietto da mostrare.' },
    { name: 'selectedTicketId', type: 'string', required: true, description: 'ID selezionato, controllato dal consumer.' },
    { name: 'quantity', type: 'number', required: true, description: 'Quantità corrente, controllata dal consumer.' },
    { name: 'onTicketChange', type: '(ticketId: string) => void', required: true, description: 'Notifica la selezione.' },
    { name: 'onQuantityChange', type: '(quantity: number) => void', required: true, description: 'Notifica la modifica della quantità.' },
  ],
  inherits: 'Attributi HTML di <section> eccetto title.',
  keyboard: [{ keys: 'Tab / frecce', action: 'Naviga i radio button nativi; Tab raggiunge il campo quantità.' }],
  accessibility: ['Usa fieldset e legend per il gruppo di radio; ogni scelta ha una label e i biglietti non disponibili sono disabilitati.'],
  responsive: ['Le opzioni si adattano a spazi stretti e spostano il prezzo sotto il nome su viewport piccoli.'],
  customization: ['Le superfici, i bordi e la tipografia usano token --dc-*; className è applicata alla section.'],
  commonMistakes: ['Non associare callback di acquisto o pagamento: il componente presenta solo selezione controllata.'],
  examples: [{ name: 'Basic', title: 'Tipi di biglietto' }],
  status: { implemented: true, documented: true, tests: ['components/TicketSelector/TicketSelector.test.tsx'], limits: ['Non effettua prenotazioni né pagamenti.'] },
};
