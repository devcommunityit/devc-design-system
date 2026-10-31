import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['UnsubscribePage', 'UnsubscribePageProps'],
  name: 'UnsubscribePage',
  slug: 'unsubscribe-page',
  category: 'forms',
  summary: 'Pagina controllata di preferenze di notifica con richiesta di disiscrizione totale.',
  whenToUse: ['Consentire di modificare le categorie e i canali di notifica o richiedere la disiscrizione.'],
  whenNotToUse: ['Per il consenso a cookie o dati usa PrivacyPreferences o CookieBanner.'],
  props: [
    { name: 'title', type: 'string', required: true, description: 'Titolo della pagina e nome della matrice.' },
    { name: 'description', type: 'ReactNode', description: 'Istruzioni facoltative.' },
    { name: 'categories', type: 'readonly NotificationPreferenceItem[]', required: true, description: 'Categorie di notifica.' },
    { name: 'channels', type: 'readonly NotificationPreferenceItem[]', required: true, description: 'Canali di notifica.' },
    { name: 'value', type: 'NotificationPreferencesValue', required: true, description: 'Preferenze controllate.' },
    { name: 'onChange', type: '(value: NotificationPreferencesValue) => void', required: true, description: 'Richiesta di modifica delle preferenze.' },
    { name: 'unsubscribeAllLabel', type: 'string', required: true, description: 'Etichetta della richiesta di disiscrizione totale.' },
    { name: 'onUnsubscribeAll', type: '() => void', required: true, description: 'Callback al consumer; non invia né persiste nulla.' },
  ],
  keyboard: [{ keys: 'Tab / Spazio', action: 'Naviga le preferenze e il pulsante di disiscrizione.' }],
  accessibility: ['La matrice di preferenze è composta da NotificationPreferences e il titolo descrive la pagina.'],
  responsive: ['Il contenitore e la matrice si adattano alle larghezze ridotte.'],
  customization: ['Riutilizza NotificationPreferences e Button con token --dc-*.'],
  commonMistakes: ['La richiesta di disiscrizione non viene inviata automaticamente.'],
  examples: [{ name: 'Basic', title: 'Preferenze email' }],
  status: { implemented: true, documented: true, tests: ['components/UnsubscribePage/UnsubscribePage.test.tsx'], limits: ['La gestione della richiesta e la persistenza sono esterne.'] },
};
