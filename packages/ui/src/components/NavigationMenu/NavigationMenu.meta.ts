import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['NavigationMenu', 'NavigationMenuItem', 'NavigationMenuLink', 'NavigationMenuGroup'],
  name: 'NavigationMenu',
  slug: 'navigation-menu',
  category: 'navigation',
  summary: 'Navigazione principale del sito con link e gruppi espandibili (pattern disclosure).',
  whenToUse: ['Header di siti e portali con sezioni e sottosezioni.', 'Navigazione laterale con gruppi (orientamento verticale).'],
  whenNotToUse: ['Azioni su un elemento: usa DropdownMenu.', 'Contenuti alternativi nella stessa pagina: usa Tabs.'],
  props: [
    { name: 'items', type: 'NavigationMenuItem[]', required: true, description: 'Link ({ id, label, href, description?, current?, linkProps? }) o gruppi ({ id, label, items }).' },
    { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Orizzontale: pannelli a comparsa. Verticale: gruppi sempre visibili.' },
    { name: 'aria-label', type: 'string', default: 'messages.mainNavigation', description: 'Nome del landmark nav.' },
  ],
  inherits: 'Attributi HTML di <nav>.',
  keyboard: [
    { keys: 'Tab', action: 'Scorre pulsanti dei gruppi e link.' },
    { keys: 'Enter / Space', action: 'Apre o chiude il gruppo.' },
    { keys: 'Escape', action: 'Chiude il gruppo aperto e riporta il focus sul suo pulsante.' },
  ],
  accessibility: [
    'Pattern APG “Disclosure navigation”: pulsanti con aria-expanded e aria-controls, link reali.',
    'Il link della pagina corrente ha aria-current="page".',
    'Il pannello si chiude quando il focus esce o con un clic esterno.',
    'Non usa role="menu": i link restano link (scelta raccomandata dall’APG per la navigazione di siti).',
  ],
  responsive: [
    'Su mobile usa l’orientamento verticale dentro un Drawer (vedi AppShell) oppure BottomNavigation.',
    'Le voci vanno a capo; i pannelli hanno larghezza massima limitata alla viewport.',
  ],
  customization: ['Selettori: .dc-navigation-menu-trigger[aria-expanded], .dc-navigation-menu-top-link[aria-current], .dc-navigation-menu-sub-link[aria-current].'],
  commonMistakes: ['Usare gruppi senza link diretti per pagine importanti.', 'Inserire azioni (logout) come link di navigazione.'],
  examples: [
    { name: 'Horizontal', title: 'Orizzontale con pannelli' },
    { name: 'Vertical', title: 'Verticale' },
  ],
  status: {
    implemented: true,
    documented: true,
    tests: ['components/NavigationMenu/NavigationMenu.test.tsx'],
    limits: ['Un solo livello di gruppi: per gerarchie più profonde usa una navigazione laterale dedicata.'],
  },
  apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/',
};
