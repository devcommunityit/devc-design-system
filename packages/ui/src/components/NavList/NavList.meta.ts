import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['NavList'],
  name: 'NavList',
  slug: 'nav-list',
  category: 'navigation',
  summary:
    'Lista di navigazione per portali e pannelli di amministrazione: link con icona e badge, gruppi espandibili a un livello, rail compressa con tooltip e variante orizzontale scorrevole.',
  whenToUse: [
    'Navigazione principale di una sidebar amministrativa o di un portale.',
    'Sotto-navigazione orizzontale tra le sezioni di una pagina (Panoramica, Attività, Impostazioni…).',
    'Rail verticale compressa a sole icone quando lo spazio è limitato.',
  ],
  whenNotToUse: [
    'Cambiare pannelli dentro la stessa pagina senza cambiare URL: usa Tabs.',
    'Menu di azioni (non di navigazione): usa DropdownMenu.',
    'Navigazione globale con menu a comparsa nell’header: usa NavigationMenu.',
    'Navigazione primaria su mobile con 3–5 destinazioni: usa BottomNavigation.',
  ],
  props: [
    { name: 'label', type: 'string', required: true, description: 'Nome accessibile del landmark <nav> (aria-label).' },
    {
      name: 'items',
      type: 'Array<NavListLink | NavListGroup>',
      required: true,
      description:
        'Link { id, label, href, icon?, badge?, isDisabled?, linkProps? } o gruppi { id, label, icon?, items: NavListLink[] } (un solo livello di annidamento).',
    },
    { name: 'currentId', type: 'string', description: 'Id della pagina corrente: riceve aria-current="page"; il gruppo che la contiene è evidenziato ed espanso di default.' },
    { name: 'orientation', type: "'vertical' | 'horizontal'", default: "'vertical'", description: 'In orizzontale i gruppi sono appiattiti nei loro link.' },
    { name: 'variant', type: "'subtle' | 'pill' | 'underline'", default: "'subtle'", description: 'Stile dell’elemento corrente: indicatore laterale, pillola piena o sottolineatura.' },
    { name: 'showIcons', type: 'boolean', default: 'true', description: 'Mostra le icone degli elementi.' },
    { name: 'collapsible', type: 'boolean', default: 'false', description: 'Mostra il pulsante per comprimere/espandere la rail (solo verticale).' },
    { name: 'collapsed / defaultCollapsed / onCollapsedChange', type: 'boolean / boolean / (collapsed) => void', description: 'Stato della rail a sole icone, controllato o non controllato.' },
    { name: 'expandedIds / defaultExpandedIds / onExpandedChange', type: 'string[] / string[] / (ids) => void', description: 'Gruppi aperti, controllati o non controllati.' },
    { name: 'onNavigate', type: '(id: string, event: MouseEvent) => void', description: 'Chiamato al click su un link: integra un router con event.preventDefault() senza dipendenze.' },
  ],
  inherits: 'Attributi HTML di <nav> (id, style, data-*), eccetto aria-label sostituito da label.',
  keyboard: [
    { keys: 'Tab / Shift+Tab', action: 'Sposta il focus tra link, gruppi e pulsante di compressione.' },
    { keys: 'Invio', action: 'Segue il link o apre/chiude il gruppo.' },
    { keys: 'Spazio', action: 'Apre/chiude il gruppo o il pulsante di compressione.' },
  ],
  accessibility: [
    'Struttura semantica: <nav aria-label> con <ul>/<li> e veri elementi <a>; nessun ruolo menu.',
    'La pagina corrente è indicata da aria-current="page", non solo dal colore.',
    'I gruppi sono pulsanti con aria-expanded e aria-controls verso la sotto-lista.',
    'Nella rail compressa le etichette restano nel nome accessibile (visivamente nascoste) e compaiono come tooltip al focus e all’hover.',
    'Il pulsante di compressione usa le stringhe localizzate “Comprimi/Espandi navigazione”.',
    'Icone aria-hidden; indicatori e focus visibili in forced-colors.',
  ],
  responsive: [
    'In orizzontale la lista scorre localmente (overflow-x) sotto 768px e va a capo da 768px in su.',
    'Target di almeno 40px di altezza; nella rail le voci sono quadrate.',
    'Chevron e icone di compressione si specchiano in RTL.',
  ],
  customization: [
    'Token: --dc-look-radius-control, --dc-look-fill-tonal, colori action e focus ring.',
    'Selettori stabili: .dc-nav-list-nav[data-variant][data-orientation][data-collapsed], .dc-nav-list-link, .dc-nav-list-sublist.',
  ],
  commonMistakes: [
    'Omettere currentId: l’utente perde l’orientamento.',
    'Annidare più di un livello: la struttura supporta solo gruppo → link.',
    'Usare la rail compressa senza icone significative: le voci mostrano solo un’iniziale.',
    'Mettere azioni (es. “Esci”) come link di navigazione: usa un Button separato.',
  ],
  examples: [
    { name: 'Vertical', title: 'Verticale' },
    { name: 'WithGroups', title: 'Con gruppi', description: 'Il gruppo che contiene la pagina corrente è aperto di default.' },
    { name: 'CollapsibleRail', title: 'Rail comprimibile', description: 'Stato controllato e integrazione router tramite onNavigate.' },
    { name: 'Horizontal', title: 'Orizzontale', description: 'Scorre localmente sui viewport stretti.' },
    { name: 'Variants', title: 'Varianti' },
  ],
  status: {
    implemented: true,
    documented: true,
    tests: ['components/NavList/NavList.test.tsx'],
    limits: [
      'Un solo livello di annidamento (gruppo → link).',
      'In orientamento orizzontale i gruppi vengono appiattiti e la compressione è ignorata.',
      'I tooltip della rail non sono raggiungibili su touch: le etichette restano però nel nome accessibile.',
      'Nessuna navigazione con frecce (roving tabindex): si usa Tab come per i normali link.',
    ],
  },
};
