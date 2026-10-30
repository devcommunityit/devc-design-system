import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['BulkActionBar'],
  name: 'BulkActionBar',
  slug: 'bulk-action-bar',
  category: 'website',
  summary: 'Barra di azioni per elementi selezionati, con conteggio annunciato, reset e posizionamento sticky opzionale.',
  whenToUse: ['Gestione pagine, media o utenti selezionati.', 'Comporre azioni collettive accanto a DataTable o liste.'],
  whenNotToUse: ['Sostituire conferme e permessi per azioni distruttive.', 'Aggiungere una toolbar con navigazione a frecce: usa Toolbar.'],
  props: [
    { name: 'count', type: 'number', required: true, description: 'Intero sicuro non negativo. Zero nasconde la barra; valori invalidi generano RangeError.' },
    { name: 'onClear', type: '() => void', description: 'Mostra il pulsante localizzato per azzerare la selezione.' },
    { name: 'sticky', type: 'boolean', default: 'false', description: 'Posizionamento sticky verso il fondo del contenitore.' },
    { name: 'children', type: 'ReactNode', description: 'Azioni effettive del consumer, con disabled/pending gestiti dall’applicazione.' },
  ],
  inherits: 'Attributi HTML di div, aria-label, className, style e ref HTMLDivElement.',
  keyboard: [{ keys: 'Tab / Invio / Spazio', action: 'Navigazione standard tra azioni e reset.' }],
  accessibility: ['Gruppo nominato e conteggio in role=status.', 'Non sposta automaticamente il focus. Quando la barra scompare, il consumer ripristina il focus se necessario.'],
  responsive: ['Azioni e conteggio vanno a capo; sticky non è un overlay fixed.'],
  customization: ['Token di superficie brand, bordo selected e raggi; data-sticky.'],
  commonMistakes: ['Non sincronizzare count con la selezione effettiva.', 'Nascondere la barra mentre il focus è su un’azione senza gestirne il ripristino.'],
  examples: [
    { name: 'Basic', title: 'Archiviazione locale' },
    { name: 'WithSelection', title: 'Selezione esplicita delle pagine' },
    { name: 'Sticky', title: 'Posizionamento sticky' },
  ],
  status: { implemented: true, documented: true, tests: ['components/BulkActionBar/BulkActionBar.test.tsx'], limits: ['Non gestisce selezione, autorizzazioni, conferme o transazioni server.', 'Sticky dipende dal contenitore di scorrimento del consumer.'] },
};
