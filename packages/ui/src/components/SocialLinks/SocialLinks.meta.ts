import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: [
    'SocialLinks',
    'SocialLinksProps',
    'SocialLinkItem',
    'SocialLinksVariant',
    'SocialLinksSize',
    'SocialLinksTone',
    'SocialNetwork',
    'KnownSocialNetwork',
    'SocialNetworkInfo',
    'socialNetworks',
    'getSocialNetwork',
  ],
  name: 'SocialLinks',
  slug: 'social-links',
  category: 'community',
  summary:
    'Elenco di link ai profili social della community (GitHub, LinkedIn, YouTube, Discord…): icone rotonde, pillole con nome o elenco verticale per i footer. Icona e nome di ogni rete arrivano dalla mappa socialNetworks, condivisa con ShareButtons.',
  whenToUse: [
    'Colonna “Seguiti” del footer o sezione contatti.',
    'Profili social di uno speaker o di un membro in una card o in una pagina profilo.',
    'Riga di icone social in una hero scura (tone="inverse").',
  ],
  whenNotToUse: [
    'Condividere la pagina corrente: usa ShareButtons.',
    'Navigazione interna del sito: usa NavList o NavigationMenu.',
    'Un singolo link testuale: usa Link.',
  ],
  props: [
    { name: 'items', type: '{ network: SocialNetwork; href: string; label?: string; icon?: ReactNode }[]', required: true, description: 'Profili da collegare, nell’ordine di visualizzazione. label sostituisce il testo (nome accessibile in icon, etichetta visibile in pill e list); icon sostituisce l’icona predefinita.' },
    { name: 'aria-label', type: 'string', description: 'Nome della lista per le tecnologie assistive (es. “Seguici sui social”). Fortemente consigliato; in alternativa aria-labelledby verso il titolo della colonna.' },
    { name: 'variant', type: "'icon' | 'pill' | 'list'", default: "'icon'", description: 'icon: pulsanti rotondi solo icona; pill: icona + nome; list: elenco verticale icona + nome per i footer.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Dimensione, allineata alle altezze dei controlli della densità corrente.' },
    { name: 'tone', type: "'neutral' | 'brand' | 'inverse'", default: "'neutral'", description: 'neutral su superfici chiare, brand con i colori accent, inverse (vetro, eredita il colore del testo) per sezioni scure e hero.' },
    { name: 'openInNewTab', type: 'boolean', default: 'true', description: 'I link http(s) si aprono in una nuova scheda con rel="noopener noreferrer" e lo annunciano con testo nascosto (messages.opensInNewTab). mailto: e link relativi restano nella stessa scheda.' },
  ],
  inherits: 'Attributi HTML di <ul> (id, style, data-*, aria-*); ref alla <ul>.',
  keyboard: [
    { keys: 'Tab', action: 'Passa da un profilo al successivo.' },
    { keys: 'Enter', action: 'Apre il profilo.' },
  ],
  accessibility: [
    'Lista semantica <ul>/<li>: le tecnologie assistive annunciano il numero di profili; dai un nome con aria-label o aria-labelledby.',
    'Nella variante icon il nome accessibile è testo visivamente nascosto: messages.socialProfile(nome), es. “Profilo GitHub”, oppure label.',
    'I link in nuova scheda aggiungono “(si apre in una nuova scheda)” come testo nascosto.',
    'Le icone sono decorative (aria-hidden); con prefers-reduced-motion niente transizioni; in forced-colors bordo e testo LinkText, focus Highlight.',
    'Su schermi touch i target sono almeno 44 × 44 px.',
  ],
  responsive: [
    'icon e pill vanno a capo quando lo spazio finisce; list resta in colonna.',
    'Su pointer: coarse l’area di tocco minima sale a 44 px.',
  ],
  customization: [
    'Token: --dc-color-action-neutral / --dc-color-action-secondary per lo sfondo, --dc-color-action-primary in hover (brand), --dc-density-control-height-* per le dimensioni, --dc-color-focus-ring.',
    'Icone: la versione installata di lucide-react non include loghi dei brand, quindi ogni rete usa un glifo generico (es. CodeXml per GitHub, AtSign per X); passa icon sull’item per un logo ufficiale.',
    'Reti personalizzate: qualsiasi stringa come network usa il nome con iniziale maiuscola e un’icona link generica.',
    'Selettori stabili: .dc-social-links-list[data-variant][data-tone], .dc-social-links-link[data-network][data-variant][data-size][data-tone], .dc-social-links-icon, .dc-social-links-label.',
  ],
  commonMistakes: [
    'Dimenticare aria-label: la lista di sole icone resta senza contesto.',
    'Usare tone="neutral" su una hero scura: usa inverse.',
    'Ricolorare le icone con i colori ufficiali dei brand: rompe il contrasto in dark mode e in forced-colors.',
  ],
  examples: [
    { name: 'Basic', title: 'Icone' },
    { name: 'Variants', title: 'Varianti', description: 'icon, pill e list (con RSS ed email).' },
    { name: 'SizesAndTones', title: 'Dimensioni e toni' },
    { name: 'FooterInverse', title: 'Footer scuro “Seguiti”', description: 'Elenco con aria-labelledby verso il titolo della colonna, tono inverse.' },
  ],
  status: {
    implemented: true,
    documented: true,
    tests: ['components/SocialLinks/SocialLinks.test.tsx'],
    limits: [
      'Nessun logo ufficiale dei brand: icone generiche di lucide-react, sostituibili con la prop icon.',
      'Nessun colore ufficiale dei brand: i toni usano solo token semantici.',
    ],
  },
};
