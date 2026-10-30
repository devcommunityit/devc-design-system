import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['BottomNavigation', 'BottomNavigationItem'],
  name: 'BottomNavigation',
  slug: 'bottom-navigation',
  category: 'navigation',
  summary: 'Barra di navigazione inferiore per 3–5 destinazioni principali su mobile.',
  whenToUse: ['App e portali usati principalmente da smartphone.'],
  whenNotToUse: ['Più di 5 destinazioni: usa un Drawer di navigazione.', 'Desktop: usa Sidebar o NavigationMenu (hideFrom nasconde la barra).'],
  props: [
    { name: 'items', type: 'BottomNavigationItem[]', required: true, description: '{ id, label, icon, href?, linkProps?, badge?, badgeLabel? }. Con href diventano link.' },
    { name: 'value / defaultValue', type: 'string', description: 'Destinazione attiva (controllata / iniziale).' },
    { name: 'onChange', type: '(id: string) => void', description: 'Cambio di destinazione.' },
    { name: 'position', type: "'fixed' | 'static'", default: "'fixed'", description: 'Fissa in basso (con safe-area) o nel flusso.' },
    { name: 'hideFrom', type: "'md' | 'lg' | 'never'", default: "'lg'", description: 'Breakpoint da cui la barra viene nascosta.' },
  ],
  inherits: 'Attributi HTML di <nav>.',
  keyboard: [{ keys: 'Tab / Enter / Space', action: 'Ogni destinazione è un link o un pulsante nativo.' }],
  accessibility: [
    'Landmark nav; la destinazione attiva ha aria-current="page".',
    'Etichette sempre visibili (non solo icone).',
    'badgeLabel fornisce il testo accessibile del badge (es. “3 non lette”).',
  ],
  responsive: ['Target di almeno 48 px; rispetta env(safe-area-inset-bottom).', 'Con position fixed riserva spazio in fondo al contenuto (AppShell lo gestisce).'],
  customization: ['Selettori: .dc-bottom-navigation-item[aria-current="page"].'],
  commonMistakes: ['Usare la barra per azioni (es. “Salva”) invece che per destinazioni.', 'Nascondere le etichette.'],
  examples: [
    { name: 'Basic', title: 'Controllata con badge' },
    { name: 'UncontrolledLinks', title: 'Cinque destinazioni come link, non controllata', description: 'defaultValue imposta la voce iniziale; onChange registra le ultime destinazioni. I badge hanno un badgeLabel accessibile.' },
    { name: 'LongLabels', title: 'Tre destinazioni con etichette lunghe', description: 'Valore controllato modificabile anche da pulsanti esterni; le etichette lunghe vanno a capo in uno spazio stretto.' },
  ],
  status: { implemented: true, documented: true, tests: ['components/BottomNavigation/BottomNavigation.test.tsx'], limits: [] },
};
