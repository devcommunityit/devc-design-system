import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['EventCard', 'EventCardProps', 'EventCardTone', 'EventCardMode', 'EventCardAttendee'],
  name: 'EventCard',
  slug: 'event-card',
  category: 'community',
  summary:
    'Card evento della community: copertina a gradiente con data e modalità, titolo, luogo e orario, barra dei posti, partecipanti e azione.',
  whenToUse: [
    'Elenchi e griglie di eventi, meetup, webinar e workshop della community.',
    'Evidenziare disponibilità dei posti (ultimi posti, esaurito) direttamente nella card.',
  ],
  whenNotToUse: [
    'Eventi in agenda densa o in calendario: usa una lista o una tabella compatta.',
    'Contenuti editoriali senza data: usa ArticleCard.',
  ],
  props: [
    { name: 'title', type: 'ReactNode', required: true, description: 'Titolo dell’evento; con `href` diventa il link della card.' },
    { name: 'href', type: 'string', description: 'Pagina dell’evento: l’intera card diventa cliccabile (stretched link) mantenendo cliccabili tag e azioni.' },
    { name: 'headingLevel', type: '2 | 3 | 4 | 5 | 6', default: '3', description: 'Livello del titolo.' },
    { name: 'date', type: 'Date | string | { year; month; day }', description: 'Giorno dell’evento, mostrato con DateBadge sulla copertina.' },
    { name: 'tone', type: "'brand' | 'violet' | 'cyan' | 'pink' | 'green'", default: "'brand'", description: 'Gradiente della copertina (token di brand o palette dati).' },
    { name: 'mode', type: "'online' | 'hybrid' | 'inPerson'", description: 'Modalità di partecipazione, mostrata come etichetta “glass” sulla copertina.' },
    { name: 'watermark', type: 'string', description: 'Testo decorativo grande e trasparente sulla copertina (nascosto alle tecnologie assistive).' },
    { name: 'tags', type: 'ReactNode', description: 'Tag o badge sopra il titolo.' },
    { name: 'description', type: 'ReactNode', description: 'Breve descrizione sotto il titolo.' },
    { name: 'location', type: 'ReactNode', description: 'Luogo o “Streaming”; l’icona segue `mode`.' },
    { name: 'time', type: 'ReactNode', description: 'Orario, es. “18:30 – 21:00”.' },
    { name: 'seatsTaken', type: 'number', description: 'Posti occupati (richiede `capacity`).' },
    { name: 'capacity', type: 'number', description: 'Posti totali: se presente mostra la barra di capienza.' },
    { name: 'lowSeatsThreshold', type: 'number', default: '5', description: 'Soglia di posti rimanenti sotto cui appare l’avviso “Ultimi posti”.' },
    { name: 'attendees', type: 'Array<{ name: string; src?: string }>', description: 'Partecipanti mostrati con AvatarGroup.' },
    { name: 'maxAttendees', type: 'number', default: '3', description: 'Avatar visibili prima del contatore “+N”.' },
    { name: 'attendeesLabel', type: 'string', description: 'Nome accessibile del gruppo di partecipanti.' },
    { name: 'action', type: 'ReactNode', description: 'Azione nel footer, es. Button “Iscriviti”.' },
    { name: 'isLoading', type: 'boolean', default: 'false', description: 'Mostra al suo posto uno SkeletonCard con cover e azione della stessa forma (aria-busy, testo nascosto “Caricamento…” non live) mantenendo className e style, così resta nella griglia. Avvolgi l’area in SkeletonGroup per un solo annuncio.' },
  ],
  inherits: 'Attributi HTML di <article> (eccetto `title`); ref inoltrato all’elemento article.',
  keyboard: [
    { keys: 'Tab', action: 'Raggiunge il link del titolo (se `href`), poi tag interattivi e azioni.' },
    { keys: 'Enter', action: 'Sul titolo apre la pagina dell’evento.' },
  ],
  accessibility: [
    'Elemento <article> etichettato dal titolo (aria-labelledby).',
    'Lo stretched link è un unico link sul titolo: niente link annidati, le azioni restano focalizzabili separatamente.',
    'La data ha un testo completo per screen reader; watermark e pallino della modalità sono decorativi.',
    'La barra dei posti è un meter con valore testuale (“86 / 120 posti”) e stato (ultimi posti / esaurito) anche visibile come testo.',
  ],
  responsive: ['Si adatta alla larghezza del contenitore; meta e footer vanno a capo. Ideale in Grid con minItemWidth ~18rem.'],
  customization: [
    '`className` sul root; le classi stabili sono `dc-event-card-*`.',
    'Il tono `brand` usa `--dc-gradient-accent`; gli altri toni usano i token `--dc-color-data-*`.',
    'In forced-colors la copertina diventa Canvas con bordo.',
  ],
  commonMistakes: [
    'Inserire un Link o un Button dentro `title` quando si usa `href`: crea controlli annidati.',
    'Passare `seatsTaken` senza `capacity`: la barra non viene mostrata.',
  ],
  examples: [
    { name: 'Basic', title: 'Evento ibrido', description: 'Copertina, tag, meta, capienza, partecipanti e azione.' },
    { name: 'Online', title: 'Evento online', description: 'Streaming con tono ciano e watermark.' },
    { name: 'SeatsStatus', title: 'Ultimi posti ed esaurito', description: 'Stato della capienza con avviso e sold out.' },
    { name: 'Gallery', title: 'Griglia di eventi', description: 'Più card in una griglia responsive.' },
    { name: 'Loading', title: 'Caricamento', description: 'Attiva/disattiva isLoading: lo skeleton ha la stessa forma del contenuto.' },
  ],
  status: {
    implemented: true,
    documented: true,
    tests: ['components/EventCard/EventCard.test.tsx'],
    limits: [
      'Il colore della barra brand sovrascrive la variabile privata `--_color` di Meter.',
      'Il fuso orario della data segue le regole di DateBadge.',
    ],
  },
};
