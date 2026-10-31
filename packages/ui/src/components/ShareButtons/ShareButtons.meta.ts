import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: [
    'ShareButtons',
    'ShareButtonsProps',
    'ShareButtonsVariant',
    'ShareButtonsSize',
    'ShareButtonsTone',
    'ShareNetwork',
    'ShareTarget',
    'ShareContent',
    'getShareUrl',
  ],
  name: 'ShareButtons',
  slug: 'share-buttons',
  category: 'community',
  summary:
    'Barra di condivisione per articoli ed eventi: pulsante “Condividi” col pannello nativo del sistema (dove disponibile), link di condivisione verso LinkedIn, X, Facebook, WhatsApp, Telegram, Bluesky ed email, e pulsante “Copia link” con conferma annunciata.',
  whenToUse: [
    'In fondo o accanto al titolo di un articolo, di un evento o di un talk.',
    'Nella pagina di conferma iscrizione per invitare altri partecipanti.',
  ],
  whenNotToUse: [
    'Link ai profili della community: usa SocialLinks.',
    'Copiare un valore che non è un link (token, comando): usa CopyButton.',
  ],
  props: [
    { name: 'url', type: 'string', required: true, description: 'URL assoluto da condividere.' },
    { name: 'title', type: 'string', description: 'Titolo: oggetto dell’email e testo di riserva per X, Telegram, WhatsApp e Bluesky.' },
    { name: 'text', type: 'string', description: 'Messaggio breve che accompagna il link.' },
    { name: 'networks', type: "Array<'linkedin' | 'x' | 'facebook' | 'whatsapp' | 'telegram' | 'email' | 'bluesky'>", default: "['linkedin', 'x', 'facebook', 'email']", description: 'Reti da mostrare, in ordine. Mastodon non è incluso: non esiste un URL di condivisione universale (dipende dall’istanza).' },
    { name: 'showNativeShare', type: 'boolean', default: 'true', description: 'Pulsante “Condividi” che apre navigator.share; compare solo dopo il montaggio e solo dove l’API esiste.' },
    { name: 'showCopy', type: 'boolean', default: 'true', description: 'Pulsante “Copia link” (useCopyToClipboard) con esito in una live region polite.' },
    { name: 'variant', type: "'icon' | 'pill'", default: "'icon'", description: 'icon: pulsanti rotondi solo icona; pill: icona + nome.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Dimensione dei pulsanti.' },
    { name: 'tone', type: "'neutral' | 'brand' | 'inverse'", default: "'neutral'", description: 'Come SocialLinks; inverse per sezioni scure.' },
    { name: 'onShare', type: "(target: ShareNetwork | 'native' | 'copy') => void", description: 'Per le analytics: link premuto, condivisione nativa completata o link copiato.' },
    { name: 'aria-label', type: 'string', default: 'messages.share', description: 'Nome del gruppo.' },
  ],
  inherits: 'Attributi HTML di <div> (id, style, data-*); ref al contenitore role="group".',
  keyboard: [
    { keys: 'Tab', action: 'Passa da un pulsante al successivo.' },
    { keys: 'Enter', action: 'Apre il link di condivisione o attiva il pulsante.' },
    { keys: 'Spazio', action: 'Attiva “Condividi” o “Copia link”.' },
  ],
  accessibility: [
    'Contenitore role="group" con nome (predefinito “Condividi”).',
    'Ogni link ha nome messages.shareOn(rete), es. “Condividi su LinkedIn”, più “(si apre in una nuova scheda)”; in pill il nome visibile è contenuto nel nome accessibile.',
    '“Copia link” diventa “Link copiato” e l’esito (anche l’errore) è annunciato da una live region role="status".',
    'Il pulsante nativo è rilevato dopo il montaggio: nessuna differenza tra HTML del server e primo render.',
    'Icone decorative; target di 44 px su touch, niente transizioni con prefers-reduced-motion, colori di sistema in forced-colors.',
  ],
  responsive: ['I pulsanti vanno a capo nei contenitori stretti; su mobile il pulsante nativo offre tutte le app installate.'],
  customization: [
    'Usa gli stessi stili e token di SocialLinks (.dc-social-links-link[data-network|data-target]).',
    'getShareUrl(network, { url, title, text }) è una funzione pura per costruire gli stessi URL altrove (menu, e-mail).',
    'Selettori stabili: .dc-share-buttons-group, [data-target="native"], [data-target="copy"][data-status].',
  ],
  commonMistakes: [
    'Passare un URL relativo: le reti richiedono URL assoluti.',
    'Mostrare troppe reti: scegli quelle davvero usate dal pubblico e lascia il resto al pulsante nativo.',
    'Aspettarsi onShare dopo la pubblicazione effettiva: per i link indica solo l’apertura della pagina di condivisione.',
  ],
  examples: [
    { name: 'Basic', title: 'Base' },
    { name: 'Pill', title: 'Pillole e più reti', description: 'Variante pill, size sm, nome del gruppo personalizzato.' },
    { name: 'WithAnalytics', title: 'Con analytics', description: 'onShare riporta il canale usato.' },
    { name: 'Inverse', title: 'Su sezione scura' },
  ],
  status: {
    implemented: true,
    documented: true,
    tests: ['components/ShareButtons/ShareButtons.test.tsx'],
    limits: [
      'Mastodon non è supportato: serve conoscere l’istanza dell’utente.',
      'Nessun logo ufficiale dei brand: icone generiche di lucide-react.',
      'Il pulsante nativo non compare nel primo render (rilevamento dopo il montaggio).',
    ],
  },
};
