import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['PrivacyPreferences', 'type PrivacyPreferencesProps', 'type PrivacyPreference'],
  name: 'PrivacyPreferences',
  slug: 'privacy-preferences',
  category: 'forms',
  summary: 'Preferenze privacy con categorie necessarie e facoltative, accetta e rifiuta.',
  whenToUse: ['Raccogliere scelte esplicite per categorie privacy.'],
  whenNotToUse: ['Come sostituto di informativa, valutazione legale o sistema di gestione del consenso.'],
  props: [
    { name: 'aria-label', type: 'string', required: true, description: 'Nome delle preferenze.' },
    { name: 'categories', type: 'readonly PrivacyPreference[]', required: true, description: 'Categorie con descrizione e obbligatorietà opzionali.' },
    { name: 'value / defaultValue / onChange', type: 'readonly string[]', description: 'Id delle scelte attive; le categorie facoltative sono disattivate per impostazione iniziale.' },
    { name: 'onSave', type: '(value: readonly string[]) => void | Promise<void>', required: true, description: 'Salva le scelte esplicite tramite il consumer.' },
    { name: 'onError / errorMessage', type: 'function / ReactNode', description: 'Segnala e personalizza gli errori di salvataggio.' },
  ],
  keyboard: [{ keys: 'Tab / Spazio / Invio', action: 'Cambia le scelte e attiva le azioni.' }],
  accessibility: ['Le categorie necessarie sono indicate e non modificabili.', 'Gli errori sono annunciati.'],
  responsive: ['I controlli vanno a capo su viewport stretti.'],
  customization: ['Colori e spaziature derivano dai token.'],
  commonMistakes: ['Non attivare categorie facoltative senza consenso né salvare le scelte solo in memoria.'],
  examples: [{ name: 'Consent', title: 'Preferenze privacy' }],
  status: { implemented: true, documented: true, tests: ['components/PrivacyPreferences/PrivacyPreferences.test.tsx'], limits: ['Informativa, base giuridica, blocco dei tracker e persistenza sono responsabilità del consumer.'] },
};
