import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['SiteHeader', 'SITE_HEADER_WIDE_QUERY', 'Footer'],
  name: 'SiteHeader e Footer',
  slug: 'site-header',
  category: 'patterns',
  summary:
    'Intestazione per siti pubblici con link principali, azioni (Accedi o UserMenu) e menu mobile reale in un drawer; footer completo a colonne o compatto per i portali.',
  whenToUse: ['Siti pubblici, landing page, aree informative e pagine di accesso.', 'Footer compatto in portali e back-office.'],
  whenNotToUse: [
    'Portali con molte sezioni: usa AppShell con Sidebar.',
    'Menu a più livelli con pannelli: usa NavigationMenu nello slot navigation di Header.',
  ],
  props: [
    { name: 'links', type: 'Array<{ id: string; label: ReactNode; href: string }>', description: 'Link principali: in linea da 768 px, nel drawer sotto.' },
    { name: 'currentId', type: 'string', description: 'Link della pagina corrente (aria-current="page" e indicatore visivo non solo cromatico).' },
    { name: 'onNavigate', type: '(link) => void', description: 'Notifica l’attivazione di un link; l’href viene comunque seguito (browser o RouterProvider).' },
    { name: 'brand / actions / sticky', type: 'ReactNode / boolean', default: 'sticky true', description: 'Slot ereditati da Header.' },
    { name: 'navigationLabel', type: 'string', default: 'messages.siteNavigation', description: 'Nome del landmark <nav> e titolo del drawer.' },
    { name: 'drawerFooter', type: 'ReactNode', description: 'Contenuto in fondo al drawer mobile (es. pulsanti di accesso).' },
    { name: 'isMenuOpen / defaultMenuOpen / onMenuOpenChange', type: 'boolean / (open) => void', default: 'false', description: 'Stato del drawer mobile, controlled o uncontrolled.' },
    { name: 'Footer: columns, brand, legal', type: 'FooterLinkColumn[] / ReactNode', description: 'Colonne di link, marchio e testo legale.' },
    { name: 'Footer: legalLinks', type: 'Array<{ label: ReactNode; href: string }>', description: 'Link brevi nella riga finale (privacy, cookie, dichiarazione di accessibilità).' },
    { name: 'Footer: social', type: 'ReactNode', description: 'Link social o di contatto nella riga finale.' },
    { name: 'Footer: variant', type: "'default' | 'compact'", default: "'default'", description: '“compact” mostra una sola riga (marchio, link legali, testo) senza colonne.' },
  ],
  inherits: 'SiteHeader: attributi di <header> (ref inoltrato). Footer: attributi di <footer>.',
  keyboard: [
    { keys: 'Tab', action: 'Raggiunge link e azioni nell’ordine visivo.' },
    { keys: 'Enter / Spazio sul pulsante menu', action: 'Apre il drawer con i link (sotto 768 px).' },
    { keys: 'Esc', action: 'Chiude il drawer e riporta il focus sul pulsante menu.' },
  ],
  accessibility: [
    'Landmark banner e navigation con nome; il footer è contentinfo se non annidato in article/section.',
    'Il pulsante menu espone aria-expanded e aria-controls; il drawer è modale e contiene il focus.',
    'La voce corrente usa aria-current="page" e una sottolineatura, non solo il colore; in forced-colors usa colori di sistema.',
    'I link sono veri <a href>, apribili in una nuova scheda.',
  ],
  responsive: [
    'Mobile-first: sotto 768 px i link sono nel drawer; da 768 px sono in linea. Il drawer si chiude se il viewport si allarga.',
    'Footer: le colonne si riorganizzano in griglia fluida; la riga finale va a capo senza overflow.',
  ],
  customization: [
    'Routing client: avvolgi l’app in RouterProvider (react-aria-components) con la funzione navigate del tuo router.',
    'Per mostrare azioni diverse nel drawer usa drawerFooter.',
  ],
  commonMistakes: [
    'Più di 5–6 link principali: la barra va a capo. Sposta le voci secondarie nel footer.',
    'Due landmark <nav> con lo stesso nome nella stessa pagina: passa navigationLabel diversi.',
  ],
  examples: [
    { name: 'PublicSiteHeader', title: 'Intestazione di un sito pubblico', description: 'RouterProvider instrada i link verso lo stato locale: l’esempio mostra il percorso simulato.' },
    { name: 'SiteFooter', title: 'Footer completo', description: 'Colonne, link legali e copyright.' },
    { name: 'CompactFooter', title: 'Footer compatto per portali' },
  ],
  status: {
    implemented: true,
    documented: true,
    tests: ['patterns/SiteHeader/SiteHeader.test.tsx', 'components/AppShell/AppShell.test.tsx'],
    limits: ['Il passaggio a drawer usa una media query sul viewport, non la larghezza del contenitore.'],
  },
  apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/',
};
