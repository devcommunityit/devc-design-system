import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['AlertDialog'],
  name: 'AlertDialog',
  slug: 'alert-dialog',
  category: 'overlay',
  summary: 'Dialogo modale che interrompe il flusso per chiedere conferma di un’azione importante o irreversibile.',
  whenToUse: ['Azioni distruttive o irreversibili.', 'Conferme con conseguenze rilevanti.'],
  whenNotToUse: ['Messaggi informativi: usa Alert o Toast.', 'Azioni facilmente annullabili: preferisci un Toast con “Annulla”.'],
  props: [
    { name: 'title', type: 'ReactNode', required: true, description: 'Domanda chiara (“Eliminare il progetto?”).' },
    { name: 'children', type: 'ReactNode', required: true, description: 'Conseguenze dell’azione.' },
    { name: 'onConfirm', type: '() => void | Promise<void>', required: true, description: 'Se restituisce una Promise mostra lo stato pending; resta aperto se rifiutata.' },
    { name: 'onCancel', type: '() => void', description: 'Chiamato su Annulla o Escape.' },
    { name: 'tone', type: "'default' | 'danger'", default: "'default'", description: 'Stile distruttivo per titolo e conferma.' },
    { name: 'confirmLabel / cancelLabel', type: 'string', default: 'messaggi localizzati', description: 'Usa verbi specifici (“Elimina”).' },
    { name: 'isConfirmDisabled', type: 'boolean', default: 'false', description: 'Disabilita la conferma.' },
  ],
  inherits: 'Props di Dialog tranne footer, size e hideCloseButton.',
  keyboard: [
    { keys: 'Tab', action: 'Alterna tra Annulla e Conferma (focus trap).' },
    { keys: 'Escape', action: 'Equivale ad Annulla.' },
  ],
  accessibility: ['role="alertdialog"; il focus iniziale va su Annulla per evitare conferme accidentali.', 'Il click sul backdrop non chiude il dialogo.', 'Stato pending annunciato sul pulsante di conferma.'],
  responsive: ['Larghezza ridotta; i pulsanti vanno a capo su schermi stretti.'],
  customization: ['className/style.'],
  commonMistakes: ['Etichette generiche “OK/Annulla”.', 'Usarlo per ogni azione: abitua gli utenti a confermare senza leggere.'],
  examples: [
    { name: 'Destructive', title: 'Distruttivo' },
    { name: 'AsyncConfirm', title: 'Conferma asincrona' },
  ],
  status: { implemented: true, documented: true, tests: ['components/Dialog/Dialog.test.tsx'], limits: [] },
  apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/',
};