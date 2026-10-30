import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['PromoBanner'],
  name: 'PromoBanner',
  slug: 'promo-banner',
  category: 'dashboard',
  summary:
    'Banner promozionale interamente cliccabile: tutta la superficie è un unico <a href> (navigazione) o <button> (azione), con icona, titolo, descrizione, chevron e pulsante di chiusura opzionale.',
  whenToUse: [
    'Promuovere una funzionalità, un upgrade di piano, un evento o un contenuto in dashboard.',
    'Scorciatoia ben visibile verso una singola destinazione o azione.',
  ],
  whenNotToUse: [
    'Messaggi di sistema o errori: usa Banner o Alert.',
    'Contenuti con più link o controlli interni: usa Card con CardLink o HeroCard con actions.',
  ],
  props: [
    { name: 'title', type: 'ReactNode', required: true, description: 'Testo principale; fa parte del nome accessibile.' },
    { name: 'description', type: 'ReactNode', description: 'Testo secondario; anch’esso nel nome accessibile, quindi breve.' },
    { name: 'href', type: 'string', description: 'Destinazione: la superficie è un <a href>. Alternativo a onPress.' },
    { name: 'linkProps', type: 'Omit<LinkProps, "href" | "children" | "className" | "style">', description: 'Props del Link react-aria (target, rel, routerOptions, onPress…), solo con href.' },
    { name: 'onPress', type: '(e: PressEvent) => void', description: 'Azione: la superficie è un <button>. Alternativo a href.' },
    { name: 'icon', type: 'ReactNode', description: 'Icona decorativa (aria-hidden).' },
    { name: 'tone', type: "'brand' | 'accent' | 'neutral' | 'success' | 'warning'", default: "'brand'", description: 'Superficie; brand e accent usano i gradienti expressive.' },
    { name: 'onDismiss', type: '() => void', description: 'Mostra un pulsante di chiusura separato (fratello, non annidato). Persisti tu la chiusura.' },
    { name: 'dismissLabel', type: 'string', default: 'messages.dismiss', description: 'Nome accessibile del pulsante di chiusura.' },
  ],
  inherits: 'Attributi HTML di <div> sul contenitore (id, style, data-*, aria-*); il ref punta al contenitore.',
  keyboard: [
    { keys: 'Tab', action: 'Sposta il focus sulla superficie e poi sul pulsante di chiusura.' },
    { keys: 'Enter', action: 'Segue il link (o attiva il pulsante).' },
    { keys: 'Space', action: 'Attiva la superficie quando è un <button>.' },
  ],
  accessibility: [
    'Un solo elemento interattivo nativo per la superficie: nessun div cliccabile, nessun elemento interattivo annidato.',
    'Il pulsante di chiusura è un fratello della superficie, con nome localizzato (messages.dismiss).',
    'Icona e chevron sono decorativi (aria-hidden); il chevron è specchiato in RTL.',
    'brand/accent usano action-primary-foreground su gradiente; success/warning usano text-primary sulle superfici feedback.',
    'Area cliccabile alta almeno 56px; focus ring visibile anche in forced-colors.',
  ],
  responsive: ['Larghezza piena del contenitore; il testo va a capo, icona e chevron restano allineati.'],
  customization: [
    'Token: --dc-gradient-accent, --dc-look-fill-primary, --dc-look-radius-container, superfici feedback.',
    'Selettori stabili: .dc-promo-banner-promo[data-tone], .dc-promo-banner-surface, .dc-promo-banner-dismiss.',
  ],
  commonMistakes: [
    'Usare onPress per navigare: passa href, così funzionano apri in nuova scheda e copia link.',
    'Descrizioni lunghe: finiscono per intero nel nome accessibile del link.',
    'Dimenticare di persistere la chiusura: onDismiss non nasconde il banner da solo.',
  ],
  examples: [
    { name: 'Basic', title: 'Base' },
    { name: 'Tones', title: 'Toni' },
    { name: 'AsButton', title: 'Come pulsante' },
    { name: 'Dismissible', title: 'Chiudibile', description: 'La visibilità è stato locale del consumer.' },
    { name: 'ExternalLink', title: 'Link esterno' },
  ],
  status: {
    implemented: true,
    documented: true,
    tests: ['components/PromoBanner/PromoBanner.test.tsx'],
    limits: [
      'Il pulsante di chiusura è posizionato sopra la superficie: la sua area non attiva il link (padding riservato).',
      'Per link che aprono una nuova scheda aggiungi tu l’indicazione testuale nella descrizione.',
    ],
  },
  apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/link/',
};
