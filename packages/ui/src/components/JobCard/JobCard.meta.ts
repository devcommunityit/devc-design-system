import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['JobCard', 'JobCardProps'],
  name: 'JobCard',
  slug: 'job-card',
  category: 'community',
  summary: 'Anteprima accessibile di una posizione lavorativa con link ai dettagli.',
  whenToUse: ['Mostrare un’offerta di lavoro in un elenco o in una community.'],
  whenNotToUse: ['Per una persona del team usa ProfileCard.'],
  props: [
    { name: 'title', type: 'string', required: true, description: 'Titolo della posizione.' },
    { name: 'company', type: 'ReactNode', required: true, description: 'Azienda o organizzazione.' },
    { name: 'href', type: 'string', required: true, description: 'Link alla pagina informativa dell’offerta.' },
    { name: 'description', type: 'ReactNode', description: 'Descrizione breve.' },
    { name: 'location', type: 'ReactNode', description: 'Luogo o modalità.' },
    { name: 'employmentType', type: 'ReactNode', description: 'Tipo di impiego.' },
    { name: 'postedAt', type: 'string', description: 'Data testuale di pubblicazione.' },
  ],
  keyboard: [{ keys: 'Tab / Invio', action: 'Raggiunge il link del titolo.' }],
  accessibility: ['La posizione è un article con un titolo e metadati descrittivi.'],
  responsive: ['Le colonne dei metadati possono andare a capo.'],
  customization: ['Usa token --dc-* per testo, superfici e spaziature.'],
  commonMistakes: ['Il link apre i dettagli; la candidatura non viene inviata da questo componente.'],
  examples: [{ name: 'Basic', title: 'Offerta' }],
  status: { implemented: true, documented: true, tests: ['components/JobCard/JobCard.test.tsx'], limits: ['Il consumer fornisce contenuti e destinazione.'] },
};
