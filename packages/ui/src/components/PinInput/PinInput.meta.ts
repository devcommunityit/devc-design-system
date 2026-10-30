import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['PinInput'],
  name: 'PinInput',
  slug: 'pin-input',
  category: 'forms',
  summary:
    'Codice di verifica (OTP, PIN) diviso in un campo per carattere. Il valore resta contiguo: la digitazione avanza, Backspace torna indietro, incolla e autocompletamento “one-time-code” riempiono tutte le posizioni.',
  whenToUse: ['Codici brevi a lunghezza fissa ricevuti via SMS, email o app di autenticazione.'],
  whenNotToUse: ['Password o codici a lunghezza variabile: usa PasswordInput o TextField.', 'Codici lunghi (più di 8 caratteri): un unico campo è più semplice da correggere.'],
  props: [
    { name: 'length', type: 'number', default: '6', description: 'Numero di caratteri.' },
    { name: 'value / defaultValue', type: 'string', default: "— / ''", description: 'Valore controllato / iniziale (caratteri contigui).' },
    { name: 'onChange', type: '(value: string) => void', description: 'Ogni modifica.' },
    { name: 'onComplete', type: '(value: string) => void', description: 'Quando tutte le posizioni sono piene.' },
    { name: 'type', type: "'numeric' | 'alphanumeric'", default: "'numeric'", description: 'Caratteri accettati; numeric imposta inputMode="numeric".' },
    { name: 'mask', type: 'boolean', default: 'false', description: 'Nasconde i caratteri come una password.' },
    { name: 'label / description / errorMessage', type: 'ReactNode', description: 'Parti del campo, collegate al gruppo e a ogni cella.' },
    { name: 'isInvalid / isDisabled / isRequired', type: 'boolean', description: 'Stati del campo.' },
    { name: 'name', type: 'string', description: 'Input nascosto con il valore per l’invio nativo del form.' },
    { name: 'autoFocus', type: 'boolean', default: 'false', description: 'Focus sulla prima posizione vuota al montaggio.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Dimensione delle celle.' },
  ],
  inherits: 'Attributi HTML del contenitore (className, style, data-*, aria-label…); ref sul contenitore role="group".',
  keyboard: [
    { keys: 'Carattere', action: 'Inserisce e passa alla posizione successiva.' },
    { keys: 'Backspace', action: 'Cancella; su una cella vuota cancella la precedente e ci sposta il focus.' },
    { keys: '← / →', action: 'Cella precedente / successiva (fino alla prima vuota).' },
    { keys: 'Home / End', action: 'Prima cella / prima cella vuota.' },
    { keys: 'Ctrl/⌘ + V', action: 'Incolla: filtra i caratteri non ammessi e riempie le posizioni.' },
  ],
  accessibility: [
    'Gruppo role="group" con l’etichetta del campo; ogni cella ha un nome “Carattere n di N” (messages.pinDigit).',
    'La prima cella dichiara autocomplete="one-time-code" per l’autocompletamento del sistema operativo.',
    'Il focus non può saltare oltre la prima cella vuota: il valore resta sempre contiguo.',
    'Errore e descrizione sono collegati con aria-describedby; aria-invalid su ogni cella.',
  ],
  responsive: ['Le celle restano su una riga e si restringono nei viewport stretti (minimo 2rem ciascuna).', 'Su touch il tastierino numerico appare grazie a inputMode.'],
  customization: ['Selettori [data-size]; le celle riusano i token dei campi (bordo, focus, invalid).'],
  commonMistakes: [
    'Verificare il codice solo sul client: la verifica deve avvenire sul server, con limiti ai tentativi.',
    'Inviare il form automaticamente in onComplete senza un’azione di conferma alternativa per chi corregge.',
  ],
  examples: [
    { name: 'Basic', title: 'Codice SMS' },
    { name: 'Controlled', title: 'Controllato con verifica simulata (English)' },
    { name: 'MaskedInForm', title: 'Mascherato in un form nativo' },
    { name: 'Disabled', title: 'Disabilitato' },
  ],
  status: {
    implemented: true,
    documented: true,
    tests: ['components/PinInput/PinInput.test.tsx'],
    limits: ['Le celle sono sempre disposte da sinistra a destra (dir="ltr"), anche in RTL, come i codici numerici.', 'Nessun separatore visivo configurabile tra gruppi di cifre.'],
  },
};
