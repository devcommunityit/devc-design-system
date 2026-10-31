import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['LearningPathCard', 'LearningPathCardProps', 'LearningPathCardTone'],
  name: 'LearningPathCard',
  slug: 'learning-path-card',
  category: 'community',
  summary:
    'Card di un percorso formativo: riquadro icona a gradiente, titolo (eventualmente link all’intera card), descrizione, meta (livello, durata), avanzamento dell’utente “x / y moduli” su una barra di progresso oppure chip “Nuovo”, e footer per un’azione.',
  whenToUse: [
    'Catalogo di percorsi, corsi o learning path in una pagina community o academy.',
    'Riprendere un percorso iniziato mostrando quanti moduli mancano.',
  ],
  whenNotToUse: [
    'Avanzamento di un’operazione (upload, caricamento): usa Progress.',
    'Passi sequenziali di un flusso da completare ora: usa Stepper.',
    'Obiettivi numerici di dashboard: usa GoalCard.',
  ],
  props: [
    { name: 'title', type: 'ReactNode', required: true, description: 'Nome del percorso; è anche il nome accessibile della card e della barra.' },
    { name: 'href', type: 'string', description: 'URL del percorso: il titolo diventa un link la cui area cliccabile copre tutta la card.' },
    { name: 'headingLevel', type: '1 | 2 | 3 | 4 | 5 | 6', default: '3', description: 'Livello del titolo.' },
    { name: 'icon', type: 'ReactNode', description: 'Icona decorativa nel riquadro a gradiente.' },
    { name: 'tone', type: "'brand' | 'accent' | 'subtle' | 'neutral'", default: "'brand'", description: 'Gradiente del riquadro icona.' },
    { name: 'description', type: 'ReactNode', description: 'Descrizione breve dei contenuti.' },
    { name: 'meta', type: 'ReactNode', description: 'Dati brevi: livello, durata, numero di moduli.' },
    { name: 'completed', type: 'number', description: 'Moduli completati dall’utente (limitati tra 0 e total).' },
    { name: 'total', type: 'number', description: 'Moduli totali: la barra compare se è > 0 e completed è impostato.' },
    { name: 'formatOptions', type: 'Intl.NumberFormatOptions', description: 'Formato dei numeri di moduli.' },
    { name: 'isNew', type: 'boolean', default: 'false', description: 'Mostra il chip localizzato “Nuovo”.' },
    { name: 'footer', type: 'ReactNode', description: 'Azione, nota o link in fondo; resta cliccabile sopra il link esteso.' },
  ],
  inherits: 'Attributi HTML di <article> (id, style, data-*, aria-*).',
  keyboard: [{ keys: 'Tab', action: 'Raggiunge il link del titolo (se href) e poi gli elementi interattivi del footer.' }],
  accessibility: [
    'La card è un <article> con nome dal titolo (aria-labelledby).',
    'L’avanzamento usa Progress (role="progressbar") con nome dal titolo, aria-valuemin/max/now e aria-valuetext localizzato (“5 / 8 moduli”); il testo visibile sotto la barra è aria-hidden per non ripeterlo.',
    'Il chip “Nuovo” è testo, non solo colore; l’icona è decorativa.',
    'Con href c’è un solo link: l’area cliccabile è estesa con uno pseudo-elemento e il focus disegna l’anello su tutta la card.',
    'In forced-colors i bordi usano CanvasText; con prefers-reduced-motion l’hover non sposta la card.',
  ],
  responsive: [
    'Layout a colonna che funziona da 320px; meta e footer vanno a capo.',
    'In una griglia (Grid minItemWidth ≈16rem) barra e footer si allineano in basso.',
  ],
  customization: [
    'Token: --dc-gradient-accent / --dc-gradient-accent-subtle per il riquadro icona, --dc-look-radius-container, --dc-look-shadow-primary; la barra eredita lo stile di Progress (gradiente nel look expressive).',
    'Selettori stabili: .dc-learning-path-card-path[data-tone][data-linked][data-new], .dc-learning-path-card-icon, .dc-learning-path-card-progress, .dc-learning-path-card-footer.',
  ],
  commonMistakes: [
    'Scrivere a mano “5 / 8 moduli”: passa completed e total, il testo è localizzato.',
    'Passare la percentuale come completed con total 100: perdi il conteggio dei moduli.',
    'Avvolgere la card in un <a> con pulsanti dentro: usa href.',
  ],
  examples: [
    { name: 'Basic', title: 'Base', description: 'Percorso in corso con barra di avanzamento.' },
    { name: 'PathsGrid', title: 'Griglia di percorsi', description: 'Due percorsi in corso e uno nuovo, con meta.' },
    { name: 'WithAction', title: 'Con azione nel footer', description: 'Titolo senza link, chip “Nuovo” e pulsante.' },
  ],
  status: {
    implemented: true,
    documented: true,
    tests: ['components/LearningPathCard/LearningPathCard.test.tsx'],
    limits: ['La barra mostra moduli interi completati, non l’avanzamento parziale dentro un modulo.'],
  },
};
