import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['NotificationCenter', 'type NotificationItem'],
  name: 'NotificationCenter',
  slug: 'notification-center',
  category: 'patterns',
  summary:
    'Campanella con conteggio delle non lette e pannello (dialog non modale) con l’elenco delle notifiche, tempo relativo, “Segna come letta” e “Segna tutte come lette”.',
  whenToUse: ['Nell’area actions di Header o AppShell per avvisi asincroni non urgenti.'],
  whenNotToUse: [
    'Conferme di un’azione appena eseguita: usa Toast.',
    'Informazioni critiche o bloccanti: usa Banner, Alert o AlertDialog.',
  ],
  props: [
    { name: 'items', type: 'NotificationItem[]', required: true, description: '{ id, title, description?, date, read?, href?, icon? }, dalla più recente.' },
    { name: 'onMarkRead', type: '(id: string) => void', description: 'Se presente mostra il pulsante “Segna come letta” sulle non lette.' },
    { name: 'onMarkAllRead', type: '() => void', description: 'Se presente mostra “Segna tutte come lette”.' },
    { name: 'onItemAction', type: '(id: string) => void', description: 'Chiamata quando si attiva un titolo con href, prima della navigazione.' },
    { name: 'title', type: 'ReactNode', default: 'messages.notifications', description: 'Titolo del pannello.' },
    { name: 'now', type: 'Date | string | number', description: 'Riferimento per i tempi relativi (demo e test deterministici).' },
    { name: 'footer', type: 'ReactNode | ({ close }) => ReactNode', description: 'Contenuto in fondo (es. “Vedi tutte”).' },
    { name: 'emptyState', type: 'ReactNode', default: 'EmptyState con messages.noNotifications', description: 'Contenuto senza notifiche.' },
    { name: 'placement', type: 'Placement', default: "'bottom end'", description: 'Posizione del pannello.' },
    { name: 'isOpen / defaultOpen / onOpenChange', type: 'boolean / (open) => void', description: 'Apertura controlled o uncontrolled.' },
  ],
  inherits: 'className sul contenitore del trigger.',
  keyboard: [
    { keys: 'Enter / Spazio', action: 'Sulla campanella: apre il pannello; il focus entra nel dialog.' },
    { keys: 'Tab / Maiusc+Tab', action: 'Tra link e pulsanti del pannello.' },
    { keys: 'Esc', action: 'Chiude e riporta il focus sulla campanella.' },
  ],
  accessibility: [
    'Il nome della campanella include il conteggio (“Notifiche, 3 non lette”); il badge numerico è aria-hidden.',
    'Le non lette hanno un punto e un testo nascosto (“Non letta”): lo stato non dipende solo dal colore.',
    'Dopo “Segna come letta” il focus passa al pulsante successivo (o all’elenco), mai al body.',
    'Il pannello è un dialog con titolo (Heading slot="title"), reso nel portal del ThemeProvider.',
  ],
  responsive: ['Il pannello non supera la larghezza del viewport e scorre verticalmente con molte notifiche.'],
  customization: ['Icone per tipo con icon; footer per collegamenti; testi tramite messages.'],
  commonMistakes: [
    'Aspettarsi che il componente recuperi o salvi le notifiche: dati, stato letto e consegna (polling, websocket, push) spettano al consumer.',
    'Annunciare ogni nuova notifica con una regione live: può risultare invadente; valuta un Toast solo per quelle importanti.',
  ],
  examples: [
    { name: 'InHeader', title: 'In un header con stato locale', description: 'Segnare come lette aggiorna conteggio e nome della campanella; “Carica notifiche precedenti” aggiunge elementi locali.' },
    { name: 'EmptyEnglish', title: 'Vuoto, in inglese' },
    { name: 'ManyUnread', title: 'Più di 99 non lette, sola lettura' },
  ],
  status: {
    implemented: true,
    documented: true,
    tests: ['patterns/NotificationCenter/NotificationCenter.test.tsx'],
    limits: ['Nessuna paginazione o raggruppamento per data integrati.', 'Nuove notifiche arrivate a pannello chiuso non vengono annunciate automaticamente.'],
  },
  apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/',
};
