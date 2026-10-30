import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['PromptComposer'],
  name: 'PromptComposer',
  slug: 'prompt-composer',
  category: 'ai',
  summary: 'Campo multilinea per richieste AI, con invio da tastiera, stato di generazione e azione di interruzione. Nessuna rete o dipendenza da modelli.',
  whenToUse: ['Comporre richieste in assistenti e strumenti di scrittura.', 'Collegare un frontend a un servizio AI gestito dal consumer.'],
  whenNotToUse: ['Form generici: usa Textarea.', 'Autenticare richieste o conservare chiavi API nel browser.'],
  props: [
    { name: 'onSend', type: '(prompt: string) => void', required: true, description: 'Riceve il testo con spazi iniziali/finali rimossi. Non svuota il campo.' },
    { name: 'value / defaultValue', type: 'string', default: "''", description: 'Valore controlled o iniziale uncontrolled.' },
    { name: 'onChange', type: '(value: string) => void', description: 'Modifica del testo, inclusi spazi e newline.' },
    { name: 'isGenerating', type: 'boolean', default: 'false', description: 'Impedisce invii duplicati; il testo resta modificabile.' },
    { name: 'onStop', type: '() => void', description: 'Durante la generazione mostra il pulsante di interruzione. Il consumer deve annullare la richiesta.' },
    { name: 'label / placeholder', type: 'ReactNode / string', description: 'Default localizzati. Usa una label visibile e contestuale.' },
    { name: 'footer', type: 'ReactNode', description: 'Note, costo stimato o stato dell’integrazione.' },
    { name: 'textareaProps', type: 'TextareaProps["textareaProps"]', description: 'Attributi ed eventi del textarea; onKeyDown viene eseguito prima della scorciatoia e può impedirla.' },
    { name: 'isInvalid / minLength / maxLength', type: 'boolean / number / number', description: 'Un errore esplicito o una lunghezza del testo ripulito fuori limite impediscono l’invio.' },
  ],
  inherits: 'Props di Textarea: label, description, errorMessage, isDisabled, isReadOnly, isInvalid, maxLength, rows, name, className e style. Ref al textarea.',
  keyboard: [
    { keys: 'Invio', action: 'Invia quando il testo non è vuoto e il controllo è abilitato.' },
    { keys: 'Maiusc+Invio', action: 'Inserisce una nuova riga.' },
    { keys: 'Invio durante composizione IME', action: 'Non invia la richiesta.' },
  ],
  accessibility: ['Label e descrizioni sono associate da Textarea.', 'Il pulsante resta raggiungibile da tastiera e ha testo localizzato.', 'Non viene creato un form annidato.'],
  responsive: ['Textarea e azioni seguono il contenitore; footer e pulsanti vanno a capo.'],
  customization: ['Token semantici per superficie, bordo, spazi e raggi.', 'className/style si applicano al campo; textareaProps al controllo nativo.'],
  commonMistakes: ['Dimenticare di gestire errori e annullamento nel consumer.', 'Svuotare il campo senza conservare il prompt quando una richiesta fallisce.', 'Trattare onSend come validazione server.'],
  examples: [
    { name: 'Basic', title: 'Base e scorciatoie' },
    { name: 'Controlled', title: 'Valore controllato e reset esplicito' },
    { name: 'GenerationState', title: 'Stato di generazione e interruzione locale' },
    { name: 'AssistantWorkspace', title: 'Assistente completo con risposta locale', description: 'Suggerimenti, messaggi, fonti e feedback; nessun modello AI collegato.' },
  ],
  status: {
    implemented: true, documented: true,
    tests: ['components/PromptComposer/PromptComposer.test.tsx'],
    limits: ['Nessun client AI, upload, persistenza o gestione dei token.', 'Il consumer valida contenuto e autorizzazioni e gestisce gli errori asincroni.', 'Il componente non gestisce automaticamente lo scroll della conversazione.'],
  },
};
