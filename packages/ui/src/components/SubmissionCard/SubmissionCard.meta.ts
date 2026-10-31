import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['SubmissionCard', 'SubmissionCardProps'],
  name: 'SubmissionCard',
  slug: 'submission-card',
  category: 'community',
  summary: 'Card informativa per una proposta inviata a una call for papers.',
  whenToUse: ['Mostrare riepilogo, autore e stato di una proposta.'],
  whenNotToUse: ['Modificare, inviare o assegnare una submission senza callback forniti dal consumer.'],
  props: [
    { name: 'title', type: 'ReactNode', required: true, description: 'Titolo della proposta.' },
    { name: 'summary', type: 'ReactNode', description: 'Abstract breve.' },
    { name: 'submitter', type: 'ReactNode', description: 'Autore o gruppo autori.' },
    { name: 'status', type: 'ReactNode', description: 'Stato fornito dal consumer.' },
    { name: 'action', type: 'ReactNode', description: 'Controlli forniti e gestiti dal consumer.' },
  ],
  inherits: 'Attributi HTML di <article> eccetto title.',
  keyboard: [{ keys: 'Tab', action: 'Raggiunge il link titolo e i controlli forniti nello slot action.' }],
  accessibility: ['Il titolo etichetta l’article; stato, metadati e azioni non vengono resi interattivi in automatico.'],
  responsive: ['Metadati e intestazione vanno a capo quando lo spazio è limitato.'],
  customization: ['Usa token --dc-* e className sul contenitore.'],
  commonMistakes: ['Non usare la card per il flusso di revisione: i controlli restano responsabilità dell’app.'],
  examples: [{ name: 'Basic', title: 'Proposta in revisione' }],
  status: { implemented: true, documented: true, tests: ['components/SubmissionCard/SubmissionCard.test.tsx'], limits: ['Nessuna persistenza o workflow CFP integrato.'] },
};
