import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['ProfileCard', 'ProfileCardProps', 'ProfileCardStat', 'ProfileCardTone'],
  name: 'ProfileCard',
  slug: 'profile-card',
  category: 'community',
  summary:
    'Card profilo per speaker e mentor: fascia superiore a gradiente, avatar grande sovrapposto, nome (eventualmente link all’intera card), ruolo, tag, riga di statistiche formattate con Intl e azioni come “Segui”.',
  whenToUse: [
    'Griglie di speaker, mentor, autori o membri in evidenza in una pagina community.',
    'Anteprima di un profilo con poche cifre chiave (talk, follower, articoli).',
  ],
  whenNotToUse: [
    'Elenchi lunghi o compatti di persone: usa una lista con Avatar o una tabella.',
    'Classifiche con posizione e punteggio: usa RankingCard o Leaderboard.',
    'Solo l’immagine della persona: usa Avatar.',
  ],
  props: [
    { name: 'name', type: 'string', required: true, description: 'Nome della persona: titolo della card, iniziali dell’avatar e nome accessibile dell’article.' },
    { name: 'jobTitle', type: 'ReactNode', description: 'Ruolo o qualifica (es. “AI Engineer”). Non si chiama role per non coprire l’attributo ARIA.' },
    { name: 'company', type: 'ReactNode', description: 'Azienda o organizzazione, mostrata dopo il ruolo.' },
    { name: 'href', type: 'string', description: 'URL del profilo: il nome diventa un link la cui area cliccabile copre tutta la card.' },
    { name: 'headingLevel', type: '1 | 2 | 3 | 4 | 5 | 6', default: '3', description: 'Livello del titolo con il nome.' },
    { name: 'avatarSrc', type: 'string', description: 'Immagine dell’avatar; se manca o non si carica restano le iniziali.' },
    { name: 'avatar', type: 'ReactNode', description: 'Avatar personalizzato al posto di quello predefinito.' },
    { name: 'tags', type: 'ReactNode', description: 'Tag o Badge (argomenti, tecnologie).' },
    { name: 'stats', type: '{ label: ReactNode; value: number | ReactNode; formatOptions?: Intl.NumberFormatOptions }[]', description: 'Cifre brevi; i numeri sono formattati con Intl secondo il locale (es. notation compact).' },
    { name: 'actions', type: 'ReactNode', description: 'Azioni (es. Button “Segui”): restano cliccabili sopra il link esteso.' },
    { name: 'tone', type: "'brand' | 'accent' | 'subtle' | 'neutral'", default: "'brand'", description: 'Gradiente della fascia superiore.' },
    { name: 'isLoading', type: 'boolean', default: 'false', description: 'Mostra al suo posto uno SkeletonProfile della stessa forma (aria-busy, testo nascosto “Caricamento…” non live) mantenendo className e style, così resta nella griglia. Avvolgi l’area in SkeletonGroup per un solo annuncio.' },
  ],
  inherits: 'Attributi HTML di <article> (id, style, data-*, aria-*).',
  keyboard: [{ keys: 'Tab', action: 'Raggiunge il link del nome (se href) e poi le azioni.' }],
  accessibility: [
    'La card è un <article> con nome accessibile dato dal titolo (aria-labelledby).',
    'Con href c’è un solo link (il nome): l’area cliccabile è estesa con uno pseudo-elemento, così i lettori di schermo non sentono link duplicati; il focus disegna l’anello su tutta la card.',
    'L’avatar è decorativo perché il nome è già visibile; la fascia a gradiente è aria-hidden.',
    'Le statistiche sono una lista di descrizione (<dl>): etichetta in <dt>, valore in <dd>, anche se visivamente il valore sta sopra.',
    'In forced-colors i bordi usano CanvasText; con prefers-reduced-motion l’hover non sposta la card.',
  ],
  responsive: [
    'Layout centrato a colonna: funziona da 320px; tag, statistiche e azioni vanno a capo.',
    'Usa Grid con minItemWidth (≈14rem) per la griglia di speaker.',
  ],
  customization: [
    'Token: --dc-gradient-accent / --dc-gradient-accent-subtle per la fascia, --dc-look-radius-container, --dc-look-shadow-primary all’hover.',
    'Selettori stabili: .dc-profile-card-profile[data-tone][data-linked], .dc-profile-card-band, .dc-profile-card-avatar, .dc-profile-card-stats, .dc-profile-card-actions.',
  ],
  commonMistakes: [
    'Avvolgere tutta la card in un <a>: le azioni interne diventerebbero interattivi annidati. Usa href.',
    'Formattare a mano i numeri (“2.1K”): passa il numero e formatOptions { notation: "compact" }.',
    'Passare un avatar non decorativo: il nome verrebbe letto due volte.',
  ],
  examples: [
    { name: 'Basic', title: 'Base', description: 'Speaker con link al profilo, tag e statistiche compatte.' },
    { name: 'SpeakerGrid', title: 'Griglia di speaker', description: 'I quattro toni della fascia con azione “Segui”.' },
    { name: 'Mentor', title: 'Mentor senza link', description: 'Statistica testuale e azione primaria.' },
    { name: 'Loading', title: 'Caricamento', description: 'Attiva/disattiva isLoading: lo skeleton ha la stessa forma del contenuto.' },
  ],
  status: {
    implemented: true,
    documented: true,
    tests: ['components/ProfileCard/ProfileCard.test.tsx'],
    limits: [
      'L’avatar predefinito ha una dimensione fissa (≈76px); per dimensioni diverse passa un elemento in avatar.',
      'Le azioni sono pensate per uno o due pulsanti: con molti elementi la card si allunga.',
    ],
  },
};
