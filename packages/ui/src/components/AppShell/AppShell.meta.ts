import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['AppShell', 'Header', 'Sidebar', 'Footer', 'useAppShell'],
  name: 'AppShell, Header, Sidebar, Footer',
  slug: 'app-shell',
  category: 'layout',
  summary:
    'Struttura applicativa per portali: skip link, intestazione, barra laterale responsive (drawer sotto 1024 px), area principale e piè di pagina. Non dipende da alcun router.',
  whenToUse: ['Portali, back-office e dashboard con navigazione persistente.'],
  whenNotToUse: ['Pagine pubbliche semplici: usa Header + Container + Footer senza Sidebar.'],
  props: [
    { name: 'header / sidebar / footer', type: 'ReactNode', description: 'Slot; tipicamente Header, Sidebar e Footer.' },
    { name: 'isSidebarOpen / defaultSidebarOpen / onSidebarOpenChange', type: 'boolean / (open) => void', default: 'false', description: 'Stato del drawer di navigazione su schermi compatti (controlled o uncontrolled).' },
    { name: 'sidebarTitle', type: 'ReactNode', default: 'messages.mainNavigation', description: 'Titolo del drawer mobile.' },
    { name: 'mainId / mainProps', type: 'string / HTMLAttributes', description: 'id del <main> (destinazione dello skip link) e altre props.' },
    { name: 'Header: brand, navigation, actions, sticky', type: 'ReactNode / boolean', default: 'sticky true', description: 'Slot dell’intestazione; dentro AppShell con Sidebar compare il pulsante menu sotto 1024 px.' },
    { name: 'Sidebar: sections, currentId, onNavigate, footer', type: 'SidebarSection[] / string / (item) => void', description: 'Gruppi di link (anche comprimibili), voce corrente (aria-current="page"), callback di navigazione.' },
    { name: 'Footer: columns, brand, legal, legalLinks, social, variant', type: "FooterLinkColumn[] / ReactNode / FooterLink[] / ReactNode / 'default' | 'compact'", default: "variant 'default'", description: 'Colonne di link, marchio, testo legale, link legali e social nella riga finale; “compact” mostra una sola riga. Vedi anche la pagina SiteHeader e Footer.' },
  ],
  inherits: 'Attributi HTML dei rispettivi elementi (div, header, nav, footer); ref inoltrato.',
  keyboard: [
    { keys: 'Tab (primo)', action: 'Mostra lo skip link “Vai al contenuto”.' },
    { keys: 'Enter / Spazio sul pulsante menu', action: 'Apre il drawer di navigazione su schermi compatti.' },
    { keys: 'Esc', action: 'Chiude il drawer e riporta il focus sul pulsante menu.' },
  ],
  accessibility: [
    'Landmark: banner, navigation (con nome), main, contentinfo.',
    'Il pulsante menu espone aria-expanded e aria-controls; il drawer contiene il focus ed è chiudibile con Esc.',
    'Le voci di navigazione sono veri link <a href>; la voce corrente ha aria-current="page".',
    'Il <main> ha tabIndex=-1 per ricevere il focus dallo skip link.',
  ],
  responsive: [
    'Sotto 1024 px la Sidebar diventa un drawer (navigazione mobile reale) e la navigation dell’Header viene nascosta se c’è una Sidebar.',
    'Il breakpoint è esportato come APP_SHELL_COMPACT_QUERY.',
  ],
  customization: [
    'Routing client: avvolgi l’app in RouterProvider di react-aria-components per usare il router del consumer.',
    'useAppShell() espone lo stato per intestazioni personalizzate.',
  ],
  commonMistakes: ['Inserire un secondo <main> nel contenuto.', 'Gestire la navigazione con onNavigate senza href: i link devono restare apribili in una nuova scheda.'],
  examples: [{ name: 'PortalShell', title: 'Shell di un portale', description: 'I link aggiornano solo lo stato locale dell’esempio.' }],
  status: {
    implemented: true,
    documented: true,
    tests: ['components/AppShell/AppShell.test.tsx'],
    limits: ['Il passaggio a drawer usa matchMedia sul viewport, non sulla larghezza del contenitore.'],
  },
};