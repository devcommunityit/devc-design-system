import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['Banner'],
  name: 'Banner',
  slug: 'banner',
  category: 'feedback',
  summary: 'Messaggio a tutta larghezza per comunicazioni di pagina o di sistema (manutenzione, annunci).',
  whenToUse: ['Informazioni che riguardano l’intera applicazione.'],
  whenNotToUse: ['Messaggi su una sezione: usa Alert.', 'Notifiche temporanee: usa Toast.'],
  props: [
    { name: 'tone', type: "'neutral' | 'info' | 'success' | 'warning' | 'danger'", default: "'info'", description: 'neutral usa la superficie brand per annunci.' },
    { name: 'action', type: 'ReactNode', description: 'Link o pulsante.' },
    { name: 'onDismiss', type: '() => void', description: 'Mostra il pulsante di chiusura; salva tu la preferenza se serve.' },
    { name: 'sticky', type: 'boolean', default: 'false', description: 'Resta in alto durante lo scroll.' },
  ],
  inherits: 'Attributi HTML di <div>.',
  keyboard: [{ keys: 'Tab', action: 'Raggiunge azione e chiusura.' }],
  accessibility: ['Non è una regione live: per messaggi dinamici usa Toast o Alert live.', 'Tono comunicato anche via testo nascosto.'],
  responsive: ['Contenuto centrato che va a capo su mobile.'],
  customization: ['className/style.'],
  commonMistakes: ['Impilare più banner: accorpa i messaggi o dai priorità.'],
  examples: [
    { name: 'Basic', title: 'Toni' },
    { name: 'Dismissible', title: 'Chiudibile' },
  ],
  status: { implemented: true, documented: true, tests: ['components/Alert/Feedback.test.tsx'], limits: [] },
};