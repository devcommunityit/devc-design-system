import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['SectionHeader', 'SectionHeaderProps'],
  name: 'SectionHeader',
  slug: 'section-header',
  category: 'community',
  summary:
    'Intestazione di una sezione di pagina: occhiello, titolo, descrizione e uno slot azioni allineato a destra (tab, filtri, “vedi tutti”) che va a capo sotto al testo nei contenitori stretti.',
  whenToUse: [
    'Aprire le sezioni di una landing o di un portale (eventi, articoli, speaker).',
    'Affiancare al titolo filtri o un link “vedi tutti”.',
  ],
  whenNotToUse: [
    'Titolo principale della pagina (h1) con breadcrumb: usa Heading o il pattern di intestazione pagina.',
    'Intestazioni interne a una card: usa il titolo della card.',
  ],
  props: [
    { name: 'title', type: 'ReactNode', required: true, description: 'Titolo della sezione.' },
    { name: 'eyebrow', type: 'ReactNode', description: 'Occhiello sopra al titolo (categoria, contesto).' },
    { name: 'description', type: 'ReactNode', description: 'Testo di supporto sotto al titolo.' },
    { name: 'actions', type: 'ReactNode', description: 'Slot finale: tab, filtri, link o pulsanti.' },
    { name: 'headingLevel', type: '1 | 2 | 3 | 4 | 5 | 6', default: '2', description: 'Livello del titolo nella struttura del documento.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Dimensione visiva del titolo, indipendente dal livello.' },
    { name: 'titleId', type: 'string', description: 'Id del titolo, per etichettare la <section aria-labelledby> che lo contiene. Generato se assente.' },
  ],
  inherits: 'Attributi HTML di <div> (id, style, data-*, aria-*).',
  keyboard: [],
  accessibility: [
    'Il titolo è un vero heading (h2 predefinito): scegli headingLevel in base alla struttura della pagina.',
    'L’occhiello precede il titolo nell’ordine di lettura; non usarlo per informazioni essenziali che non siano anche nel titolo.',
    'Collega la sezione al titolo con <section aria-labelledby={titleId}> per creare una regione con nome.',
  ],
  responsive: [
    'Testo e azioni stanno sulla stessa riga e vanno a capo quando lo spazio non basta (flex-wrap).',
    'Sotto 640 px i titoli md/lg scendono a headline-sm.',
  ],
  customization: [
    'Token: --dc-color-text-link per l’occhiello, scala tipografica headline/title.',
    'Selettori stabili: .dc-section-header-section-header[data-size], .dc-section-header-title, .dc-section-header-actions.',
  ],
  commonMistakes: [
    'Usare size per cambiare la gerarchia: il livello si imposta con headingLevel.',
    'Mettere troppe azioni nello slot: preferisci un filtro e un link.',
  ],
  examples: [
    { name: 'Basic', title: 'Con filtri', description: 'Occhiello, titolo e ToggleGroup a destra.' },
    { name: 'WithDescription', title: 'Con descrizione e link' },
    { name: 'Sizes', title: 'Dimensioni e livelli' },
  ],
  status: {
    implemented: true,
    documented: true,
    tests: ['components/SectionHeader/SectionHeader.test.tsx'],
    limits: ['Allineamento solo a inizio riga; per intestazioni centrate usa Heading e Text.'],
  },
};
