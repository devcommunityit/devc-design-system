import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['NotificationPreferences', 'type NotificationPreferencesProps', 'type NotificationPreferenceItem', 'type NotificationPreferencesValue'],
  name: 'NotificationPreferences',
  slug: 'notification-preferences',
  category: 'forms',
  summary: 'Preferenze di notifica per categoria e canale.',
  whenToUse: ['Consentire scelte indipendenti per email, push e altri canali.'],
  whenNotToUse: ['Per mostrare notifiche ricevute usa NotificationCenter.'],
  props: [
    { name: 'aria-label', type: 'string', required: true, description: 'Nome della matrice.' },
    { name: 'categories', type: 'readonly NotificationPreferenceItem[]', required: true, description: 'Categorie con id e nome.' },
    { name: 'channels', type: 'readonly NotificationPreferenceItem[]', required: true, description: 'Canali con id e nome.' },
    { name: 'value / defaultValue / onChange', type: 'NotificationPreferencesValue', description: 'Mappa da id canale a id categorie attive.' },
    { name: 'isCellDisabled', type: 'function', description: 'Disabilita combinazioni non disponibili.' },
  ],
  keyboard: [{ keys: 'Tab / Spazio', action: 'Naviga e modifica le caselle.' }],
  accessibility: ['La tabella associa le intestazioni a controlli con nomi accessibili.'],
  responsive: ['La tabella scorre nel contenitore.'],
  customization: ['Colori e spaziature derivano dai token.'],
  commonMistakes: ['Il componente non invia notifiche e non salva automaticamente le scelte.'],
  examples: [{ name: 'Channels', title: 'Canali' }],
  status: { implemented: true, documented: true, tests: ['components/NotificationPreferences/NotificationPreferences.test.tsx'], limits: ['La persistenza resta al consumer.'] },
};
