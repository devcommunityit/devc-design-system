import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['ToastProvider', 'useToast', 'useToasts', 'createToastQueue', 'ToastQueue'],
  name: 'Toast',
  slug: 'toast',
  category: 'feedback',
  summary: 'Notifiche temporanee non bloccanti con coda, annunci accessibili, pausa al passaggio e chiusura.',
  whenToUse: ['Conferme di azioni (salvato, inviato) e annullamento rapido.'],
  whenNotToUse: ['Errori che richiedono un intervento: usa Alert vicino al problema.', 'Informazioni da conservare: mostrale anche in pagina.'],
  props: [
    { name: 'ToastProvider.maxVisible', type: 'number', default: '3', description: 'Toast visibili; gli altri attendono in coda.' },
    { name: 'ToastProvider.placement', type: "'top-start' | … | 'bottom-end'", default: "'bottom-end'", description: 'Posizione (proprietà logiche, compatibile RTL).' },
    { name: 'ToastProvider.queue', type: 'ToastQueue', description: 'Coda esterna per mostrare toast da codice non React.' },
    { name: 'show(options)', type: '{ title, description?, tone?, duration?, action?, onClose?, announcement? } → id', required: true, description: 'Aggiunge un toast.' },
    { name: 'duration', type: 'number | null', default: '6000 (null per danger o con action)', description: 'null = resta finché non viene chiuso.' },
    { name: 'dismiss(id) / clear()', type: 'function', description: 'Chiude uno o tutti i toast.' },
  ],
  keyboard: [
    { keys: 'Tab', action: 'Raggiunge azione e chiusura (la regione è un landmark “Notifiche”).' },
    { keys: 'Invio / Spazio', action: 'Esegue l’azione o chiude.' },
  ],
  accessibility: [
    'Annunci tramite regioni live persistenti: polite per info/successo/avviso, assertive per errori.',
    'Il timer si mette in pausa con hover o focus (WCAG 2.2.1); errori e toast con azione non scompaiono da soli.',
    'Il focus non viene spostato: il toast non interrompe l’utente.',
    'Animazione disattivata con prefers-reduced-motion.',
  ],
  responsive: ['Larghezza massima 24rem, ridotta su schermi stretti; posizione con proprietà logiche.'],
  customization: ['ToastProvider.className; i toast ereditano il tema del ThemeProvider più vicino tramite portal.'],
  commonMistakes: ['Usare useToast fuori da ToastProvider: viene lanciato un errore esplicito.', 'Affidare a un toast l’unica copia di un’informazione critica.'],
  examples: [
    { name: 'Basic', title: 'Toni, azione e coda' },
    { name: 'Durations', title: 'Durate, toast persistente e chiusura programmatica', description: 'duration in millisecondi o null; dismiss(id) chiude un toast specifico e onClose conta le chiusure.' },
    { name: 'Placement', title: 'Posizione e coda con maxVisible', description: 'La posizione è controllata dallo stato; con maxVisible={2} il terzo toast attende in coda.' },
  ],
  status: { implemented: true, documented: true, tests: ['components/Toast/Toast.test.tsx'], limits: ['Nessuna scorciatoia (es. F6) per spostare il focus nella regione: è raggiungibile come landmark e con Tab.'] },
};