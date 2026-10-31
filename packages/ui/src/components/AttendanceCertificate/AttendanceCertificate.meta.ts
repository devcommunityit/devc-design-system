import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['AttendanceCertificate', 'AttendanceCertificateProps'],
  name: 'AttendanceCertificate',
  slug: 'attendance-certificate',
  category: 'community',
  summary: 'Riepilogo o link a un attestato già disponibile, senza generarlo.',
  whenToUse: ['Mostrare che un attestato esiste e collegare alla sua visualizzazione.'],
  whenNotToUse: ['Generare attestati, firmarli o verificare credenziali.'],
  props: [
    { name: 'recipient', type: 'ReactNode', required: true, description: 'Nome del destinatario.' },
    { name: 'eventName', type: 'ReactNode', required: true, description: 'Evento frequentato.' },
    { name: 'issuedDate', type: 'string', description: 'Data di emissione in formato leggibile e machine-readable.' },
    { name: 'certificateHref', type: 'string', description: 'URL a un attestato esistente.' },
  ],
  inherits: 'Attributi HTML di <article> eccetto title.',
  keyboard: [{ keys: 'Tab / Enter', action: 'Raggiunge il link dell’attestato, se disponibile.' }],
  accessibility: ['Nome e informazioni dell’attestato sono testo; il link esiste solo quando è fornito un URL.'],
  responsive: ['Il contenuto si impila e si adatta al contenitore.'],
  customization: ['Usa token --dc-* e className sul contenitore.'],
  commonMistakes: ['Non collegare a un endpoint di generazione: il componente è solo presentazionale.'],
  examples: [{ name: 'Basic', title: 'Attestato disponibile' }],
  status: { implemented: true, documented: true, tests: ['components/AttendanceCertificate/AttendanceCertificate.test.tsx'], limits: ['Non crea o scarica attestati.'] },
};
