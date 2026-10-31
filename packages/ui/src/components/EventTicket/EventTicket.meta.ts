import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['EventTicket', 'EventTicketProps'],
  name: 'EventTicket',
  slug: 'event-ticket',
  category: 'community',
  summary: 'Biglietto evento di sola visualizzazione con dati del partecipante e slot QR fornito dal consumer.',
  whenToUse: ['Mostrare un biglietto già emesso e i dati utili all’ingresso.'],
  whenNotToUse: ['Creare biglietti, codici QR o flussi di scansione.'],
  props: [
    { name: 'eventName', type: 'ReactNode', required: true, description: 'Nome dell’evento.' },
    { name: 'attendeeName', type: 'ReactNode', required: true, description: 'Nome del partecipante.' },
    { name: 'ticketName', type: 'ReactNode', required: true, description: 'Tipologia di biglietto.' },
    { name: 'ticketCode', type: 'string', required: true, description: 'Codice già assegnato dal consumer.' },
    { name: 'qrVisual', type: 'ReactNode', description: 'Visual QR generato e passato dal consumer; non viene creato qui.' },
  ],
  inherits: 'Attributi HTML di <article> eccetto title.',
  keyboard: [{ keys: 'Tab', action: 'Raggiunge gli eventuali controlli interattivi forniti nel visual QR.' }],
  accessibility: ['I dati sono strutturati in una lista di descrizione; l’eventuale visual QR è contenuto in uno slot fornito dal consumer.'],
  responsive: ['I dettagli si dispongono in colonne adattive; il blocco codice passa sotto il contenuto su schermi stretti.'],
  customization: ['Usa token --dc-* e className sul contenitore.'],
  commonMistakes: ['Fornire il visual QR da un generatore consumer-side; il componente non crea né convalida codici.'],
  examples: [{ name: 'Basic', title: 'Biglietto con visual fornito' }],
  status: { implemented: true, documented: true, tests: ['components/EventTicket/EventTicket.test.tsx'], limits: ['Nessuna emissione, download o generazione QR.'] },
};
