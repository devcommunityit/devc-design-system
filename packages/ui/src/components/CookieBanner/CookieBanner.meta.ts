import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['CookieBanner', 'CookieBannerProps'],
  name: 'CookieBanner',
  slug: 'cookie-banner',
  category: 'website',
  summary: 'Interfaccia controllata per le preferenze privacy e cookie.',
  whenToUse: ['Presentare categorie e scelte di consenso tramite PrivacyPreferences.'],
  whenNotToUse: ['Per preferenze di notifica usa NotificationPreferences.'],
  props: [
    { name: 'title', type: 'string', required: true, description: 'Titolo e nome accessibile della sezione.' },
    { name: 'description', type: 'ReactNode', required: true, description: 'Informativa breve.' },
    { name: 'categories', type: 'readonly PrivacyPreference[]', required: true, description: 'Categorie di consenso.' },
    { name: 'value', type: 'readonly string[]', required: true, description: 'Categorie attive controllate.' },
    { name: 'onChange', type: '(value: readonly string[]) => void', required: true, description: 'Richiesta di modifica selezione.' },
    { name: 'onSave', type: '(value: readonly string[]) => void | Promise<void>', required: true, description: 'Callback al consumer quando l’utente conferma.' },
    { name: 'errorMessage', type: 'ReactNode', description: 'Messaggio in caso di errore del callback.' },
  ],
  keyboard: [{ keys: 'Tab / Spazio', action: 'Naviga e modifica le categorie e i pulsanti di PrivacyPreferences.' }],
  accessibility: ['La sezione è associata al proprio titolo e compone controlli già accessibili.'],
  responsive: ['Le categorie e le azioni si adattano ai contenitori stretti.'],
  customization: ['PrivacyPreferences mantiene checkbox e azioni coerenti; gli stili usano token --dc-*.'],
  commonMistakes: ['Nessun consenso viene salvato qui: il consumer gestisce policy e persistenza.'],
  examples: [{ name: 'Basic', title: 'Preferenze cookie' }],
  status: { implemented: true, documented: true, tests: ['components/CookieBanner/CookieBanner.test.tsx'], limits: ['Il callback onSave appartiene al consumer.'] },
};
