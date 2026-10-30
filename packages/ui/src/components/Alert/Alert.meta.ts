import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['Alert'],
  name: 'Alert',
  slug: 'alert',
  category: 'feedback',
  summary: 'Messaggio contestuale in linea con tono (info, successo, avviso, errore), titolo, azioni e chiusura facoltativa.',
  whenToUse: ['Riepilogo errori di un form.', 'Avvisi relativi a una sezione della pagina.'],
  whenNotToUse: ['Messaggi globali di pagina: usa Banner.', 'Conferme effimere: usa Toast.', 'Decisioni bloccanti: usa AlertDialog.'],
  props: [
    { name: 'tone', type: "'info' | 'success' | 'warning' | 'danger'", default: "'info'", description: 'Colori, icona ed etichetta nascosta.' },
    { name: 'variant', type: "'soft' | 'outline'", default: "'soft'", description: 'Superficie tonale o bordo con accento.' },
    { name: 'title', type: 'ReactNode', description: 'Titolo in grassetto.' },
    { name: 'actions', type: 'ReactNode', description: 'Pulsanti o link dopo il messaggio.' },
    { name: 'onDismiss', type: '() => void', description: 'Mostra il pulsante di chiusura; la visibilità resta a te.' },
    { name: 'icon', type: 'ReactNode | null', description: 'Sostituisce o nasconde (null) l’icona del tono.' },
    { name: 'live', type: "'off' | 'polite' | 'assertive'", default: "'off'", description: 'Ruolo status/alert per messaggi che compaiono dinamicamente.' },
  ],
  inherits: 'Attributi HTML di <div>.',
  keyboard: [{ keys: 'Tab', action: 'Raggiunge azioni e pulsante di chiusura.' }],
  accessibility: [
    'Il tono è comunicato con testo nascosto localizzato (“Errore:”), icona e colore.',
    'live va usato solo per messaggi inseriti dopo il caricamento; non abusare di assertive.',
  ],
  responsive: ['Testo e azioni vanno a capo; nessuna larghezza fissa.'],
  customization: ['className/style; colori dai token color.feedback.*.'],
  commonMistakes: ['Impostare live su messaggi presenti al caricamento: vengono annunciati inutilmente o ignorati.'],
  examples: [
    { name: 'Tones', title: 'Toni' },
    { name: 'WithActions', title: 'Azioni e chiusura' },
    { name: 'Live', title: 'Annuncio dinamico' },
  ],
  status: { implemented: true, documented: true, tests: ['components/Alert/Feedback.test.tsx'], limits: [] },
};