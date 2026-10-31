import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['CtaPanel', 'CtaPanelProps', 'CtaPanelStep', 'CtaPanelVariant'],
  name: 'CtaPanel',
  slug: 'cta-panel',
  category: 'community',
  summary:
    'Sezione call-to-action scura con bagliori (o a gradiente brand) che chiude una landing: eyebrow, titolo, descrizione, azioni e passi numerati opzionali in una lista ordinata che si adatta alla larghezza del contenitore.',
  whenToUse: [
    'Invito finale in una landing community: call for speaker, iscrizione, diventare mentor o organizer.',
    'Spiegare in pochi passi numerati cosa succede dopo il clic.',
  ],
  whenNotToUse: [
    'Benvenuto o riepilogo in cima a una dashboard: usa HeroCard (superficie brand/accent/subtle, con media).',
    'Promozione compatta interamente cliccabile (un solo link o pulsante): usa PromoBanner.',
    'Iscrizione con campo email: usa NewsletterCard.',
    'Procedura interattiva con stato dei passi: usa Stepper.',
  ],
  props: [
    { name: 'title', type: 'ReactNode', required: true, description: 'Titolo; dà anche il nome alla regione.' },
    { name: 'headingLevel', type: '1 | 2 | 3 | 4 | 5 | 6', default: '2', description: 'Livello del titolo.' },
    { name: 'eyebrow', type: 'ReactNode', description: 'Chip sopra il titolo (campagna, data, categoria).' },
    { name: 'description', type: 'ReactNode', description: 'Testo di supporto.' },
    { name: 'actions', type: 'ReactNode', description: 'Pulsanti o link (Button / LinkButton).' },
    { name: 'steps', type: '{ title: ReactNode; description?: ReactNode }[]', description: 'Passi numerati, resi come <ol>.' },
    { name: 'variant', type: "'dark' | 'brand'", default: "'dark'", description: 'dark: superficie inverse con bagliori; brand: gradiente accent.' },
  ],
  inherits: 'Attributi HTML di <section> (id, style, data-*, aria-*).',
  keyboard: [],
  accessibility: [
    'È una <section> con nome dal titolo (aria-labelledby).',
    'I passi sono una lista ordinata (<ol>): la numerazione arriva dalla semantica; il numero visibile è aria-hidden per non leggerlo due volte.',
    'Il testo usa sempre il foreground abbinato alla superficie (text-inverse su dark, action-primary-foreground su brand): contrasto garantito in tema chiaro e scuro.',
    'Bagliori e gradienti sono decorativi e vengono rimossi in forced-colors, dove bordi e numeri usano CanvasText.',
  ],
  responsive: [
    'Container query sul pannello: da 48rem testo e passi stanno affiancati, con i passi in colonna.',
    'Sotto i 48rem i passi vanno sotto il testo in una griglia auto-fit (riga se c’è spazio, colonna nei contenitori stretti); funziona da 320px.',
    'Padding e dimensione del titolo si riducono nei contenitori stretti.',
  ],
  customization: [
    'Token: --dc-color-surface-inverse / --dc-color-text-inverse (dark), --dc-gradient-accent e --dc-color-action-primary-foreground (brand), --dc-color-action-primary e --dc-color-accent-default per i bagliori, --dc-look-radius-container.',
    'Selettori stabili: .dc-cta-panel-cta[data-variant][data-has-steps], .dc-cta-panel-steps, .dc-cta-panel-step, .dc-cta-panel-number, .dc-cta-panel-actions.',
  ],
  commonMistakes: [
    'Usare pulsanti ghost o outline sulla variante brand: il loro colore non è pensato per il gradiente; preferisci secondary.',
    'Scrivere i numeri dentro il titolo dei passi: la numerazione è automatica.',
    'Mettere più CtaPanel nella stessa pagina: perdono efficacia; tienine uno per landing.',
  ],
  examples: [
    { name: 'Basic', title: 'Call for speaker', description: 'Variante dark con azioni e quattro passi.' },
    { name: 'Brand', title: 'Variante brand', description: 'Gradiente accent senza passi.' },
    { name: 'NarrowWithDescriptions', title: 'Contenitore stretto', description: 'Passi con descrizione impilati in colonna.' },
  ],
  status: {
    implemented: true,
    documented: true,
    tests: ['components/CtaPanel/CtaPanel.test.tsx'],
    limits: [
      'Nel tema scuro la variante dark diventa un pannello chiaro (superficie inverse), per mantenere il contrasto con la pagina.',
      'I passi sono informativi: per stati (completato, attuale) usa Stepper.',
    ],
  },
};
