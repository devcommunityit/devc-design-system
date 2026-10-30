import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['PublishStatus'],
  name: 'PublishStatus',
  slug: 'publish-status',
  category: 'website',
  summary: 'Stato editoriale localizzato: bozza, pubblicato, programmato o archiviato, costruito su Badge.',
  whenToUse: ['Tabelle CMS e pagine di dettaglio.', 'Mostrare lo stato effettivo restituito dal backend.'],
  whenNotToUse: ['Autorizzare o eseguire una pubblicazione.', 'Mostrare come pubblicato un salvataggio ancora in corso.'],
  props: [
    { name: 'status', type: 'PublicationStatus', required: true, description: 'draft | published | scheduled | archived.' },
    { name: 'children', type: 'ReactNode', description: 'Sostituisce l’etichetta predefinita, ad esempio con la data di pubblicazione.' },
    { name: 'variant / size / dot', type: 'BadgeProps', default: "soft / md / true", description: 'Aspetto del badge; il tono dipende dallo stato.' },
  ],
  inherits: 'Props HTML di Badge, className, style e ref HTMLSpanElement. tone è assegnato semanticamente.',
  keyboard: [],
  accessibility: ['Stato espresso come testo, oltre al colore.', 'Nessuna live region automatica; per aggiornamenti importanti usa un contenitore role=status.'],
  responsive: ['Il badge segue il contenuto e consente etichette lunghe.'],
  customization: ['Varianti Badge e data-publish-status.'],
  commonMistakes: ['Confondere la visualizzazione del badge con un workflow realmente persistito.'],
  examples: [
    { name: 'Basic', title: 'Tutti gli stati' },
    { name: 'Workflow', title: 'Workflow editoriale locale' },
    { name: 'CustomLabels', title: 'Etichette e varianti' },
  ],
  status: { implemented: true, documented: true, tests: ['components/PublishStatus/PublishStatus.test.tsx'], limits: ['Non pianifica, pubblica o archivia contenuti; non effettua controlli di autorizzazione.'] },
};
