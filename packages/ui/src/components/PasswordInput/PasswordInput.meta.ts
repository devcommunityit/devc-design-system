import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['PasswordInput'],
  name: 'PasswordInput',
  slug: 'password-input',
  category: 'forms',
  summary: 'Campo password con pulsante mostra/nascondi localizzato. Non applica regole di robustezza: sono responsabilità del consumer e del server.',
  whenToUse: ['Login, registrazione, cambio password.'],
  whenNotToUse: ['Codici OTP o PIN brevi: usa TextField con inputMode="numeric" e autoComplete="one-time-code".'],
  props: [
    { name: 'autoComplete', type: 'string', default: "'current-password'", description: 'Usa "new-password" in registrazione e cambio password.' },
    { name: 'defaultRevealed', type: 'boolean', default: 'false', description: 'Visibilità iniziale.' },
    { name: 'startAdornment', type: 'ReactNode', description: 'Icona decorativa iniziale.' },
    { name: 'label, description, errorMessage, value, onChange, isRequired, minLength, validate…', type: 'come TextField', description: 'Stessa API di TextField.' },
  ],
  inherits: 'Props di react-aria-components TextField (tranne type).',
  keyboard: [{ keys: 'Tab', action: 'Dal campo al pulsante mostra/nascondi.' }, { keys: 'Spazio / Enter sul pulsante', action: 'Alterna la visibilità senza perdere il valore.' }],
  accessibility: ['Il pulsante è un <button> reale con etichetta “Mostra/Nascondi password” localizzata.', 'Lo stato è comunicato dal cambio di etichetta.', 'Supporta i password manager (autoComplete, name).'],
  responsive: ['Pulsante con target ≥ 24 px; font 16 px per evitare lo zoom su iOS.'],
  customization: ['Stesse classi di TextField; icone da lucide-react.'],
  commonMistakes: ['Impedire l’incolla della password.', 'Considerare minLength lato client come controllo di sicurezza.'],
  examples: [
    { name: 'Basic', title: 'Base' },
    { name: 'NewPassword', title: 'Registrazione con validazione' },
    { name: 'States', title: 'Stati' },
    { name: 'Controlled', title: 'Valore controllato con requisiti', description: 'Il valore è nello stato dell’esempio: la lista dei requisiti si aggiorna a ogni modifica.' },
    { name: 'ConfirmPassword', title: 'Conferma password e sola lettura', description: 'Errore mostrato con isInvalid quando le due password differiscono.' },
  ],
  status: { implemented: true, documented: true, tests: ['components/PasswordInput/PasswordInput.test.tsx'], limits: ['Nessun misuratore di robustezza incluso.'] },
};
