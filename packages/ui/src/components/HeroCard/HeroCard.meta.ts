import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['HeroCard'],
  name: 'HeroCard',
  slug: 'hero-card',
  category: 'dashboard',
  summary:
    'Card di benvenuto o di evidenza in cima a una dashboard: eyebrow, titolo, descrizione, azioni e media, su superficie brand, accent (gradiente) o subtle.',
  whenToUse: [
    'Messaggio di benvenuto personalizzato all’apertura del portale.',
    'Mettere in evidenza una novità, un onboarding o un’azione prioritaria della pagina.',
  ],
  whenNotToUse: [
    'Messaggi di stato o errori: usa Alert o Banner.',
    'Più card in evidenza nella stessa schermata: una sola HeroCard per vista, altrimenti nessuna spicca.',
    'Interi banner cliccabili: usa PromoBanner.',
  ],
  props: [
    { name: 'title', type: 'ReactNode', required: true, description: 'Titolo; dà anche il nome accessibile alla regione (aria-labelledby).' },
    { name: 'headingLevel', type: '1 | 2 | 3 | 4 | 5 | 6', default: '2', description: 'Livello del titolo, da scegliere in base alla gerarchia della pagina.' },
    { name: 'eyebrow', type: 'ReactNode', description: 'Riga breve sopra il titolo (data, categoria, contesto).' },
    { name: 'description', type: 'ReactNode', description: 'Testo di supporto.' },
    { name: 'actions', type: 'ReactNode', description: 'Pulsanti o link; preferisci variant="secondary", che mantiene il proprio contrasto su ogni superficie.' },
    { name: 'media', type: 'ReactNode', description: 'Illustrazione o immagine: accanto al testo nei contenitori larghi, sotto nei contenitori stretti.' },
    { name: 'icon', type: 'ReactNode', description: 'Icona decorativa (aria-hidden) accanto all’eyebrow.' },
    { name: 'variant', type: "'brand' | 'accent' | 'subtle'", default: "'brand'", description: 'brand: superficie primaria (gradiente nel look expressive); accent: gradiente primario→accento in ogni look; subtle: superficie tonale.' },
    { name: 'as', type: "'section' | 'article'", default: "'section'", description: 'Elemento semantico.' },
  ],
  inherits: 'Attributi HTML di <section>/<article> (id, style, data-*, aria-*); aria-label o aria-labelledby passati sovrascrivono il nome predefinito.',
  keyboard: [],
  accessibility: [
    'Renderizza <section> (regione con nome dal titolo) o <article>; il titolo è un vero heading del livello scelto.',
    'Il testo usa sempre il ruolo *-foreground associato alla superficie (action-primary-foreground su brand/accent, action-secondary-foreground su subtle): contrasto garantito dal tema anche sui gradienti e in dark mode.',
    'In forced-colors i gradienti sono rimossi e la card ha un bordo di sistema.',
    'Icone e media decorativi: passa alt="" alle immagini decorative o un alt significativo.',
  ],
  responsive: [
    'Layout intrinseco: il media va sotto il testo quando lo spazio non basta (flex-wrap), senza breakpoint.',
    'Padding fluido (clamp) e titolo ridotto sotto i 640px.',
  ],
  customization: [
    'Token: --dc-gradient-accent, --dc-look-fill-primary, --dc-look-fill-tonal, --dc-look-radius-container, --dc-look-shadow-primary.',
    'Selettori stabili: .dc-hero-card-hero[data-variant], .dc-hero-card-title, .dc-hero-card-actions, .dc-hero-card-media.',
  ],
  commonMistakes: [
    'Usare Button variant="primary" nelle azioni su variante brand: si confonde con la superficie. Usa secondary.',
    'Saltare livelli di heading: imposta headingLevel coerente con la pagina.',
    'Mettere informazioni essenziali solo nel media.',
  ],
  examples: [
    { name: 'Basic', title: 'Benvenuto' },
    { name: 'Variants', title: 'Varianti' },
    { name: 'WithMedia', title: 'Con media', description: 'Il media si sposta sotto il testo nei contenitori stretti.' },
    { name: 'Onboarding', title: 'Onboarding a passi', description: 'Contenuto guidato da stato locale.' },
  ],
  status: {
    implemented: true,
    documented: true,
    tests: ['components/HeroCard/HeroCard.test.tsx'],
    limits: [
      'I colori dei contenuti nello slot actions non vengono adattati alla superficie: usa componenti con contrasto proprio (Button/LinkButton secondary).',
      'Il contrasto sulla variante accent dipende dalla coppia primary/accent del tema: i temi inclusi abbinano foreground di pari luminosità, temi custom vanno verificati.',
    ],
  },
};
