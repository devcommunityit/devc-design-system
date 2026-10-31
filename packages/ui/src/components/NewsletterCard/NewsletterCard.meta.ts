import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['NewsletterCard', 'NewsletterCardProps', 'NewsletterCardStatus'],
  name: 'NewsletterCard',
  slug: 'newsletter-card',
  category: 'community',
  summary:
    'Card scura con bagliore per l’iscrizione alla newsletter: titolo, descrizione, campo email con validazione nativa e pulsante “Iscriviti” con stato di attesa; l’esito è annunciato in una live region.',
  whenToUse: [
    'Raccogliere iscrizioni alla newsletter in sidebar, footer o a fine articolo.',
    'Iscrizioni rapide a un solo campo (email) con esito immediato.',
  ],
  whenNotToUse: [
    'Moduli con più campi o consensi da spuntare: usa Form, TextField e Checkbox.',
    'Inviti all’azione senza input: usa CtaPanel o HeroCard.',
    'Messaggi di sistema dopo l’invio di un form complesso: usa Alert o Toast.',
  ],
  props: [
    { name: 'title', type: 'ReactNode', required: true, description: 'Titolo; dà anche il nome alla regione.' },
    { name: 'headingLevel', type: '1 | 2 | 3 | 4 | 5 | 6', default: '3', description: 'Livello del titolo.' },
    { name: 'eyebrow', type: 'ReactNode', description: 'Chip sopra il titolo (es. “Newsletter”).' },
    { name: 'description', type: 'ReactNode', description: 'Testo di supporto (frequenza, contenuti).' },
    { name: 'onSubmit', type: '(email: string) => void | Promise<unknown>', description: 'Chiamata con l’email (senza spazi) a invio valido. Se restituisce una Promise la card resta in attesa finché si risolve (rifiuto → errore).' },
    { name: 'status', type: "'idle' | 'pending' | 'success' | 'error'", description: 'Stato controllato; se assente è gestito dalla card in base a onSubmit.' },
    { name: 'successMessage', type: 'ReactNode', default: 'messages.newsletterSubscribed', description: 'Annunciato in role="status" quando lo stato è success.' },
    { name: 'errorMessage', type: 'ReactNode', default: 'messages.error', description: 'Annunciato in role="alert" quando lo stato è error.' },
    { name: 'value', type: 'string', description: 'Email controllata.' },
    { name: 'defaultValue', type: 'string', default: "''", description: 'Email iniziale (non controllata); viene svuotata dopo un’iscrizione riuscita.' },
    { name: 'onChange', type: '(value: string) => void', description: 'Chiamata a ogni modifica dell’email.' },
    { name: 'placeholder', type: 'string', description: 'Esempio di formato (es. “nome@email.it”); non sostituisce l’etichetta.' },
    { name: 'emailLabel', type: 'string', default: 'messages.newsletterEmail', description: 'Nome accessibile del campo email.' },
    { name: 'submitLabel', type: 'ReactNode', default: 'messages.newsletterSubscribe', description: 'Testo del pulsante.' },
    { name: 'name', type: 'string', default: "'email'", description: 'Attributo name del campo.' },
    { name: 'footer', type: 'ReactNode', description: 'Nota sotto il form (privacy, disiscrizione).' },
  ],
  inherits: 'Attributi HTML di <section> (id, style, data-*, aria-*), esclusi onSubmit/onChange/defaultValue sostituiti dalle prop dedicate.',
  keyboard: [
    { keys: 'Tab', action: 'Sposta il focus tra campo email e pulsante.' },
    { keys: 'Invio', action: 'Nel campo email invia il form (se l’indirizzo è valido).' },
  ],
  accessibility: [
    'La card è una <section> con nome dal titolo; il campo ha nome accessibile “Email” (aria-label localizzato) anche senza etichetta visibile.',
    'Validazione nativa: type="email", required e autocomplete="email"; un indirizzo non valido blocca l’invio e mostra il messaggio del browser accanto al campo.',
    'In attesa il pulsante usa isPending di Button: resta focalizzabile, è aria-disabled e annuncia l’avanzamento; un secondo invio viene ignorato.',
    'Esito in live region sempre presenti: role="status" per il successo, role="alert" per l’errore.',
    'Il pannello usa la superficie inverse con il testo inverse abbinato: scuro su pagina chiara, chiaro su pagina scura, contrasto garantito in entrambi gli schemi; i bagliori sono decorativi e spariscono in forced-colors.',
  ],
  responsive: [
    'Campo e pulsante stanno sulla stessa riga; sotto ~20rem il pulsante va a capo e occupa tutta la larghezza.',
    'Funziona da 320px; il titolo usa text-wrap: balance.',
  ],
  customization: [
    'Token: --dc-color-surface-inverse / --dc-color-text-inverse, --dc-color-action-primary e --dc-color-accent-default per i bagliori, --dc-look-radius-container.',
    'Selettori stabili: .dc-newsletter-card-newsletter[data-status], .dc-newsletter-card-form, .dc-newsletter-card-message[data-kind], .dc-newsletter-card-footer.',
  ],
  commonMistakes: [
    'Usare il placeholder come unica etichetta: l’etichetta accessibile è già fornita, il placeholder è solo un esempio.',
    'Gestire l’attesa senza restituire la Promise da onSubmit: la card non mostra lo stato pending.',
    'Annunciare il successo con un Toast separato: il messaggio è già in una live region.',
  ],
  examples: [
    { name: 'Basic', title: 'Base', description: 'Non controllata: la Promise di onSubmit attiva lo stato di attesa.' },
    { name: 'Controlled', title: 'Controllata', description: 'Valore e stato controllati, messaggi personalizzati e nota privacy.' },
    { name: 'Narrow', title: 'Contenitori stretti', description: 'Il pulsante va a capo; stato success controllato.' },
  ],
  status: {
    implemented: true,
    documented: true,
    tests: ['components/NewsletterCard/NewsletterCard.test.tsx'],
    limits: [
      'Un solo campo (email): per nome o consensi componi un form con TextField e Checkbox.',
      'Nel tema scuro il pannello diventa chiaro (superficie inverse): non è un pannello sempre scuro.',
    ],
  },
};
