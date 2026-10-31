import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['AnnouncementPill', 'AnnouncementPillProps', 'AnnouncementPillLinkProps', 'AnnouncementPillButtonProps', 'AnnouncementPillStaticProps', 'AnnouncementPillTone'],
  name: 'AnnouncementPill',
  slug: 'announcement-pill',
  category: 'community',
  summary:
    'Pillola di annuncio da hero: etichetta evidenziata con gradiente (“Nuovo”), testo breve e freccia. Diventa un link con href, un pulsante con onPress, altrimenti è testo statico.',
  whenToUse: [
    'Annunciare una novità sopra il titolo di una hero (call for speaker, nuova release, evento).',
    'Rimandare con un clic a una pagina di approfondimento.',
  ],
  whenNotToUse: [
    'Messaggi di sistema o avvisi persistenti: usa Banner o Alert.',
    'Etichette di stato in tabelle o card: usa Badge.',
  ],
  props: [
    { name: 'children', type: 'ReactNode', required: true, description: 'Testo dell’annuncio.' },
    { name: 'badge', type: 'ReactNode', default: 'messages.isNew', description: 'Etichetta evidenziata; null per nasconderla.' },
    { name: 'href', type: 'string', description: 'Destinazione: rende un <a href> (React Aria Link, con target, rel, routing).' },
    { name: 'onPress', type: '(e: PressEvent) => void', description: 'Azione: rende un <button>. Ignorato se è presente href.' },
    { name: 'tone', type: "'brand' | 'inverse'", default: "'brand'", description: 'brand per superfici chiare; inverse (effetto vetro, eredita il colore del testo) per hero scure.' },
    { name: 'showArrow', type: 'boolean', default: 'true se interattiva', description: 'Freccia finale (specchiata in RTL).' },
  ],
  inherits: 'Props di React Aria Link (con href), Button (con onPress) o attributi HTML di <span>; ref all’elemento radice.',
  keyboard: [
    { keys: 'Tab', action: 'Raggiunge la pillola se è link o pulsante.' },
    { keys: 'Enter', action: 'Segue il link o attiva l’azione.' },
    { keys: 'Spazio', action: 'Attiva l’azione (solo pulsante).' },
  ],
  accessibility: [
    'Il nome accessibile è il testo visibile: etichetta + annuncio (es. “Nuovo Call for Speaker 2027 aperta”).',
    'La freccia è decorativa (aria-hidden).',
    'Focus ring visibile con --dc-color-focus-ring; in forced-colors bordo CanvasText e testo LinkText se interattiva.',
  ],
  responsive: ['Il testo va a capo dentro la pillola nei contenitori stretti; la larghezza massima è il 100% del contenitore.'],
  customization: [
    'Token: --dc-gradient-accent e --dc-color-action-primary-foreground per l’etichetta, --dc-color-surface-brand per tone="brand".',
    'Selettori stabili: .dc-announcement-pill-pill[data-tone][data-interactive], .dc-announcement-pill-badge, .dc-announcement-pill-arrow.',
  ],
  commonMistakes: [
    'Testi lunghi: la pillola è per una riga; i dettagli vanno nella pagina collegata.',
    'Usare tone="brand" su una hero scura: usa inverse.',
  ],
  examples: [
    { name: 'Basic', title: 'Link' },
    { name: 'Inverse', title: 'Su hero scura', description: 'Tono inverse con effetto vetro.' },
    { name: 'Static', title: 'Statica, etichetta personalizzata' },
  ],
  status: {
    implemented: true,
    documented: true,
    tests: ['components/AnnouncementPill/AnnouncementPill.test.tsx'],
    limits: ['Una sola etichetta evidenziata per pillola.'],
  },
};
