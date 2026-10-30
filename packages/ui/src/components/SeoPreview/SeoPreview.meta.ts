import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['SeoPreview'],
  name: 'SeoPreview',
  slug: 'seo-preview',
  category: 'website',
  summary: 'Anteprima editoriale di titolo, URL e descrizione di una pagina, senza modifiche ai metadati o promesse di ranking.',
  whenToUse: ['Editor di pagine e articoli.', 'Anteprima dei testi SEO prima di salvare i metadati nel consumer.'],
  whenNotToUse: ['Riprodurre esattamente il risultato di uno specifico motore di ricerca.', 'Validare automaticamente SEO, indicizzazione o URL.'],
  props: [
    { name: 'title', type: 'string', required: true, description: 'Titolo visualizzato come testo, non HTML.' },
    { name: 'url', type: 'string', required: true, description: 'URL editoriale mostrato come testo non cliccabile e isolato LTR.' },
    { name: 'description', type: 'string', required: true, description: 'Descrizione testuale, senza troncamento invisibile.' },
    { name: 'siteName', type: 'string', description: 'Nome del sito opzionale.' },
  ],
  inherits: 'Attributi HTML di figure (title è il titolo editoriale), aria-label, className, style e ref HTMLElement.',
  keyboard: [],
  accessibility: ['Figure nominata con stringa localizzata.', 'Nessun link finto o contenuto HTML iniettato.', 'Il contenuto completo resta disponibile anche con testi lunghi.'],
  responsive: ['URL lunghi vanno a capo senza overflow; bdi isola gli URL nei contesti RTL.'],
  customization: ['Token di testo, superficie, bordo e titolo.'],
  commonMistakes: ['Pensare che l’anteprima aggiorni document.title o meta description.', 'Promettere il layout esatto di un motore di ricerca.'],
  examples: [
    { name: 'Basic', title: 'Anteprima editoriale' },
    { name: 'Editor', title: 'Editor locale dei metadati' },
    { name: 'LongContent', title: 'RTL e URL lunghi' },
  ],
  status: { implemented: true, documented: true, tests: ['components/SeoPreview/SeoPreview.test.tsx'], limits: ['Nessuna modifica ai metadati, salvataggio, validazione URL, analisi SEO o anteprima social.', 'Non replica il layout o il troncamento di specifici motori di ricerca.'] },
};
