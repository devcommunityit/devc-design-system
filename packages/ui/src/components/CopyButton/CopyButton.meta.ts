import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['CopyButton', 'useCopyToClipboard'],
  name: 'CopyButton',
  slug: 'copy-button',
  category: 'actions',
  summary:
    'Pulsante che copia un valore negli appunti con la Clipboard API asincrona, mostra l’esito (“Copiato” / “Copia non riuscita”) e lo annuncia ai lettori di schermo. Include l’hook useCopyToClipboard per costruire controlli propri.',
  whenToUse: ['Codici, ID, link d’invito, comandi di installazione, chiavi pubbliche.', 'Accanto a un valore già visibile che l’utente deve incollare altrove.'],
  whenNotToUse: [
    'Per segreti che non dovrebbero essere visibili: valuta un flusso dedicato (rivelazione esplicita, scadenza).',
    'Come unico modo per ottenere il valore: lascia il testo selezionabile.',
  ],
  props: [
    { name: 'value', type: 'string | (() => string)', required: true, description: 'Testo da copiare o funzione valutata al momento della pressione.' },
    { name: 'children', type: 'string', default: 'messages.copy', description: 'Etichetta visibile; con iconOnly diventa il nome accessibile.' },
    { name: 'iconOnly', type: 'boolean', default: 'false', description: 'Mostra solo l’icona (il nome resta in aria-label).' },
    { name: 'variant', type: "ButtonProps['variant']", default: "'outline'", description: 'Aspetto del pulsante.' },
    { name: 'resetAfter', type: 'number', default: '2000', description: 'Millisecondi prima di tornare allo stato iniziale.' },
    { name: 'onCopy', type: '(text: string) => void', description: 'Chiamata dopo una copia riuscita.' },
    { name: 'onCopyError', type: '(error: unknown) => void', description: 'Chiamata se l’API non è disponibile o il permesso è negato.' },
    { name: 'useCopyToClipboard(options)', type: '{ status: "idle" | "copied" | "error"; copy(text): Promise<boolean> }', description: 'Hook senza UI con la stessa logica; non lancia mai eccezioni.' },
  ],
  inherits: 'Props di Button (size, isDisabled, className, style, data-*…) tranne onPress, startIcon, endIcon, isPending.',
  keyboard: [{ keys: 'Enter / Spazio', action: 'Copia il valore.' }],
  accessibility: [
    'È un <button> nativo; l’esito è comunicato con testo e icona, non solo colore.',
    'Una regione role="status" annuncia “Copiato” o “Copia non riuscita”.',
    'In modalità iconOnly il nome accessibile resta stabile; l’esito arriva dalla regione live.',
  ],
  responsive: ['In spazi stretti usa iconOnly con size="sm": il target resta di almeno 24 × 24 px.'],
  customization: ['Selettore [data-status="copied" | "error" | "idle"] per stili dedicati.', 'Testi tramite messages (copy, copied, copyFailed).'],
  commonMistakes: [
    'Dare per scontato che la copia riesca: la Clipboard API richiede contesto sicuro (HTTPS) e può essere negata. Gestisci onCopyError.',
    'Cambiare il valore copiato senza aggiornare il testo visibile accanto.',
  ],
  examples: [
    { name: 'Basic', title: 'Comando di installazione' },
    { name: 'IconOnly', title: 'Solo icona' },
    { name: 'WithCallbacks', title: 'Valore calcolato, callback e stato disabilitato' },
  ],
  status: {
    implemented: true,
    documented: true,
    tests: ['components/CopyButton/CopyButton.test.tsx'],
    limits: ['Non usa il fallback document.execCommand("copy") (deprecato): senza Clipboard API lo stato diventa “error”.'],
  },
};
