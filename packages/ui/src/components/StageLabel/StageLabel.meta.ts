import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['StageLabel', 'StageLabelProps', 'StageLabelStage'],
  name: 'StageLabel',
  slug: 'stage-label',
  category: 'community',
  summary:
    'Etichetta dello stadio di rilascio di un sito o di una funzione (Alpha, Beta, Anteprima, Demo, Nuovo, Sperimentale, Deprecato, In arrivo): chip in linea o banner a tutta larghezza con descrizione, azione e chiusura.',
  whenToUse: [
    'Segnalare che una sezione o una funzione è in alpha, beta, anteprima o sperimentale.',
    'Avvisare in cima al sito che si tratta di un ambiente demo (“Ambiente demo: i dati vengono azzerati ogni notte”).',
    'Evidenziare una voce di menu o una funzione appena rilasciata (“Nuovo”).',
  ],
  whenNotToUse: [
    'Stati generici di un elemento (Pagato, Bozza, Attivo): usa Badge.',
    'Conteggi o pallini su icone e avatar: usa IndicatorBadge.',
    'Etichette sovrapposte all’angolo di card o immagini: usa Ribbon.',
    'Messaggi di sistema che richiedono un’azione o hanno gravità (errori, manutenzione): usa Banner o Alert.',
  ],
  props: [
    {
      name: 'stage',
      type: "'alpha' | 'beta' | 'preview' | 'demo' | 'new' | 'experimental' | 'deprecated' | 'comingSoon'",
      required: true,
      description: 'Stadio di rilascio: determina testo predefinito localizzato e stile.',
    },
    { name: 'children', type: 'ReactNode', description: 'Sostituisce il testo predefinito dello stadio.' },
    { name: 'variant', type: "'chip' | 'banner'", default: "'chip'", description: 'Chip in linea oppure striscia a tutta larghezza (role="note").' },
    { name: 'size', type: "'sm' | 'md'", default: "'md'", description: 'Dimensione del chip / densità del banner.' },
    { name: 'icon', type: 'ReactNode', description: 'Icona decorativa iniziale.' },
    { name: 'description', type: 'ReactNode', description: 'Solo banner: testo esplicativo accanto all’etichetta.' },
    { name: 'action', type: 'ReactNode', description: 'Solo banner: slot azione, ad es. il link “Invia feedback”.' },
    { name: 'onDismiss', type: '() => void', description: 'Solo banner: mostra un IconButton di chiusura con etichetta localizzata “Ignora”.' },
  ],
  inherits: 'Attributi HTML di <span> (chip) o <div> (banner).',
  keyboard: [{ keys: 'Tab', action: 'Nel banner sposta il focus su azione e pulsante di chiusura; il chip non è focalizzabile.' }],
  accessibility: [
    'Il testo dello stadio è sempre testo reale e localizzato: il colore è solo di supporto.',
    'Il banner ha role="note" ed è nominato dall’etichetta dello stadio (aria-labelledby); puoi sovrascrivere role e aria-label via props.',
    'Il pulsante di chiusura è un IconButton con nome accessibile “Ignora”; dopo la chiusura sposta il focus su un elemento sensato.',
    'La descrizione non viene mostrata in un Tooltip sul chip: il chip non è focalizzabile e un tooltip sarebbe irraggiungibile da tastiera e touch.',
    'In forced-colors chip e banner usano bordi di sistema al posto di sfondi e gradienti.',
  ],
  responsive: [
    'Il banner va a capo: etichetta e descrizione occupano la prima riga, azioni e chiusura scendono sotto nei contenitori stretti.',
    'Il chip resta su una riga con ellissi se lo spazio non basta.',
  ],
  customization: [
    'Token: --dc-gradient-accent (beta), --dc-color-accent-default (nuovo, sperimentale), --dc-color-data-6 (demo, ciano), colori feedback warning/info (alpha, anteprima), --dc-color-surface-muted e --dc-color-text-muted (deprecato).',
    'Selettori stabili: .dc-stage-label-chip[data-stage][data-size], .dc-stage-label-banner[data-stage], .dc-stage-label-description, .dc-stage-label-actions.',
  ],
  commonMistakes: [
    'Usare StageLabel per stati di contenuto (Bozza, Pubblicato): quello è PublishStatus o Badge.',
    'Mettere più banner di stadio uno sopra l’altro: scegli il messaggio più importante.',
    'Rendere il banner non chiudibile su tutte le pagine quando il messaggio non è critico.',
  ],
  examples: [
    { name: 'Stages', title: 'Stadi', description: 'Tutti gli stadi con il testo predefinito localizzato.' },
    { name: 'InContext', title: 'In contesto', description: 'Accanto a titoli e voci, con testo e icona personalizzati.' },
    { name: 'Banner', title: 'Banner del sito', description: 'Striscia “Ambiente demo” con link di feedback e chiusura.' },
  ],
  status: {
    implemented: true,
    documented: true,
    tests: ['components/StageLabel/StageLabel.test.tsx'],
    limits: ['La prop description è usata solo dalla variante banner.'],
  },
};
