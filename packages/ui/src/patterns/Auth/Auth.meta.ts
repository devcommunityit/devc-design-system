import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['AuthLayout', 'LoginForm', 'SignUpForm', 'PasswordResetForm'],
  name: 'Accesso: AuthLayout, LoginForm, SignUpForm, PasswordResetForm',
  slug: 'auth-forms',
  category: 'patterns',
  summary:
    'Componenti di interfaccia per accesso, registrazione e recupero password: validazione accessibile, autocomplete corretto, stato di invio e messaggi di errore. Non contengono alcuna logica di autenticazione.',
  whenToUse: ['Pagine di login, registrazione e recupero password collegate al tuo identity provider o backend.'],
  whenNotToUse: [
    'Se usi un identity provider con pagine ospitate (es. login di Entra ID, Auth0, Keycloak): reindirizza a quelle.',
    'Come sistema di sicurezza: la validazione client non sostituisce quella server.',
  ],
  props: [
    { name: 'AuthLayout: title, description, brand, footer', type: 'ReactNode', description: 'Contenuto della scheda centrale.' },
    { name: 'AuthLayout: headingLevel', type: '1 | 2 | 3', default: '1', description: 'Livello del titolo (usa 2 se la pagina ha già un h1).' },
    { name: 'AuthLayout: aside', type: 'ReactNode', description: 'Pannello laterale mostrato da 1024 px (immagine, testimonianza). Non inserire contenuti essenziali: è nascosto su schermi piccoli.' },
    { name: 'AuthLayout: fullHeight', type: 'boolean', default: 'true', description: 'Occupa l’altezza del viewport (100dvh); false per incorporarlo in una sezione o anteprima.' },
    { name: 'LoginForm: onSubmit', type: '(values: { identifier; password; remember }) => void | Promise<void>', description: 'Ricevuto dopo la validazione. Se restituisce una Promise, il pulsante mostra lo stato di caricamento fino al termine.' },
    { name: 'LoginForm: identifierType', type: "'email' | 'username'", default: "'email'", description: 'Tipo di identificativo e relativa validazione.' },
    { name: 'LoginForm: forgotPasswordHref / showRememberMe', type: 'string / boolean', default: 'showRememberMe true', description: 'Link di recupero e casella “Resta collegato”.' },
    { name: 'SignUpForm: showName, passwordMinLength, confirmPassword, termsLabel', type: 'boolean / number / boolean / ReactNode', default: 'false, 8, false, —', description: 'Campo nome, lunghezza minima (in caratteri Unicode), conferma password, casella obbligatoria per i termini.' },
    { name: 'PasswordResetForm: onSubmit, defaultEmail, isSubmitted, successMessage', type: '({ email }) => …, string, boolean, ReactNode', description: 'Mostra un messaggio neutro dopo l’invio riuscito; isSubmitted lo rende controlled.' },
    { name: 'error', type: 'ReactNode', description: 'Errore restituito dal tuo servizio (credenziali errate, limite di tentativi), annunciato con role="alert".' },
    { name: 'isPending', type: 'boolean', description: 'Stato di invio controlled; altrimenti lo guida la Promise di onSubmit.' },
    { name: 'providers / footer / submitLabel', type: 'ReactNode', description: 'Accesso alternativo (SSO, passkey) sotto il separatore “oppure”, contenuto finale e testo del pulsante.' },
    { name: 'defaultValues', type: 'Partial<values>', description: 'Valori iniziali (mai la password per SignUpForm).' },
  ],
  inherits: 'Props del Form di react-aria-components (action, method, validationErrors, className…), escluse onSubmit e validationBehavior. Ref inoltrato al <form>.',
  keyboard: [
    { keys: 'Tab', action: 'Percorre i campi nell’ordine visivo.' },
    { keys: 'Enter', action: 'Invia il modulo; se ci sono errori il focus va al primo campo non valido.' },
  ],
  accessibility: [
    'Label visibili, descrizioni ed errori collegati al campo (aria-describedby) e annunciati.',
    'autocomplete: username/email, current-password nel login, new-password nella registrazione, name: i gestori di password funzionano.',
    'PasswordInput consente di mostrare la password; nessun incolla bloccato.',
    'Durante l’invio il pulsante resta focalizzabile e annuncia l’avanzamento (isPending di react-aria); i doppi invii sono ignorati.',
    'Gli errori del server usano role="alert"; la conferma del recupero password usa role="status".',
  ],
  responsive: ['La scheda è fluida fino a 28rem con padding che si riduce su schermi stretti; il pannello aside appare da 1024 px.', 'Nessuna larghezza fissa: funziona a 320 px e con zoom 200%.'],
  customization: [
    'Per moduli con campi diversi componi Form, TextField, PasswordInput e Checkbox dentro AuthLayout.',
    'Messaggi di sistema tradotti tramite LocaleProvider (chiavi auth*).',
  ],
  commonMistakes: [
    'Rivelare se un account esiste (“email non registrata”): usa messaggi neutri, come fa PasswordResetForm.',
    'Lasciare che onSubmit rifiuti la Promise per mostrare un errore: gestisci l’errore e passalo in error. Una Promise rifiutata viene propagata (stato di invio ripristinato) ed è visibile come errore non gestito.',
    'Richiedere la conferma password quando il campo permette già di mostrare il testo (NIST SP 800-63B non la richiede): per questo confirmPassword è false di default.',
    'Considerare questi componenti un sistema di autenticazione: rate limiting, MFA, sessioni e protezione CSRF sono responsabilità del backend.',
  ],
  examples: [
    { name: 'SignIn', title: 'Flusso di accesso', description: 'Ritardo simulato; la password “errata” simula un errore. I link passano tra login, registrazione e recupero tramite RouterProvider.' },
    { name: 'UsernameLogin', title: 'Accesso con nome utente' },
    { name: 'SignUp', title: 'Registrazione con conferma password e termini' },
    { name: 'ForgotPassword', title: 'Recupero password con conferma neutra' },
  ],
  status: {
    implemented: true,
    documented: true,
    tests: ['patterns/Auth/Auth.test.tsx'],
    limits: [
      'Solo interfaccia: nessuna sessione, token, MFA o chiamata di rete.',
      'Campi fissi: per moduli diversi componi Form, TextField e PasswordInput.',
    ],
  },
};
