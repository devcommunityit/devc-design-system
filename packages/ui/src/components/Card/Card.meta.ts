import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['Card', 'CardHeader', 'CardBody', 'CardFooter', 'CardImage', 'CardLink'],
  name: 'Card',
  slug: 'card',
  category: 'data',
  summary: 'Superficie che raggruppa contenuti e azioni relativi a un singolo argomento.',
  whenToUse: ['Riepiloghi di entità (progetti, articoli, piani).', 'Gruppi di KPI o contenuti in griglia.'],
  whenNotToUse: ['Per incorniciare ogni sezione della pagina: usa Section.', 'Per dati tabellari confrontabili: usa Table o DataTable.'],
  props: [
    { name: 'as', type: "'div' | 'article' | 'section' | 'li'", default: "'div'", description: 'Elemento semantico; usa li dentro un elenco.' },
    { name: 'variant', type: "'outlined' | 'elevated' | 'filled' | 'accent'", default: "'outlined'", description: 'Enfasi della superficie. accent usa una cornice bicolore (gradiente brand → terziario) per contenuti in evidenza; con forced-colors diventa un bordo di sistema.' },
    { name: 'padding', type: "'none' | 'sm' | 'md' | 'lg'", default: "'md'", description: 'Spaziatura interna (segue la densità).' },
    { name: 'isSelected', type: 'boolean', description: 'Stato selezionato (bordo e data-selected). Non sostituisce un controllo con stato accessibile.' },
    { name: 'CardHeader.title / subtitle / media / actions', type: 'ReactNode', description: 'Intestazione con titolo (heading), sottotitolo, media iniziale e azioni.' },
    { name: 'CardHeader.headingLevel', type: '2–6', default: '3', description: 'Livello del titolo secondo la gerarchia della pagina.' },
    { name: 'CardFooter.justify', type: "'start' | 'end' | 'between'", default: "'end'", description: 'Allineamento delle azioni.' },
    { name: 'CardImage.ratio', type: 'number', default: '16/9', description: 'Rapporto d’aspetto del media.' },
    { name: 'CardLink', type: 'AnchorHTMLAttributes', description: 'Link la cui area cliccabile si estende all’intera card (stretched link).' },
  ],
  inherits: 'Attributi HTML dell’elemento renderizzato; ref inoltrato.',
  keyboard: [{ keys: 'Tab', action: 'Raggiunge link e pulsanti all’interno; la card in sé non è focalizzabile.' }],
  accessibility: [
    'Con CardLink tutta la card è cliccabile ma esiste un solo link con nome chiaro (il titolo).',
    'Altri controlli interattivi in una card con CardLink restano sopra lo strato del link e cliccabili.',
    'Scegli headingLevel coerente con la struttura della pagina.',
  ],
  responsive: ['Larghezza fluida: la griglia contenitore decide le colonne.', 'Le azioni del footer vanno a capo sui viewport stretti.'],
  customization: ['className/style; token --dc-color-surface-*, --dc-radius-lg, --dc-shadow-*.'],
  commonMistakes: ['Avvolgere l’intera card in un <a> con pulsanti all’interno: elementi interattivi annidati non sono validi.', 'Usare isSelected senza un controllo (pulsante, checkbox) che comunichi lo stato.'],
  examples: [
    { name: 'Basic', title: 'Base' },
    { name: 'Variants', title: 'Varianti' },
    { name: 'LinkedCards', title: 'Card collegate in elenco' },
    { name: 'Selectable', title: 'Selezione con pulsanti a stato' },
  ],
  status: { implemented: true, documented: true, tests: ['components/Data.test.tsx'], limits: [] },
};