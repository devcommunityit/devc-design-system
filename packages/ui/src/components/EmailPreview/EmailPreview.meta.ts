import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['EmailPreview', 'EmailPreviewProps'],
  name: 'EmailPreview',
  slug: 'email-preview',
  category: 'community',
  summary: 'Anteprima di un messaggio e dei relativi metadati che riutilizza il preview sandboxed di EmailBuilder.',
  whenToUse: ['Rivedere un documento email esistente prima dell’invio gestito dall’app.'],
  whenNotToUse: ['Comporre o inviare campagne: usa EmailBuilder e le integrazioni dell’app.'],
  props: [
    { name: 'title / document', type: 'ReactNode / EmailDocument', description: 'Titolo e documento email controllati.', required: true },
    { name: 'previewDevice / onPreviewDeviceChange', type: 'EmailPreviewDevice / (device) => void', description: 'Viewport controllato dell’anteprima.', required: true },
    { name: 'subject / preheader / sender', type: 'ReactNode', description: 'Metadati email opzionali.' },
    { name: 'senderLabel / subjectLabel / preheaderLabel', type: 'ReactNode', description: 'Etichette localizzabili dei metadati.' },
  ],
  inherits: 'Attributi HTML di <section>.',
  keyboard: [{ keys: 'Tab, Invio, Spazio', action: 'Usa i controlli accessibili dell’anteprima EmailBuilder.' }],
  accessibility: ['Riutilizza l’anteprima isolata con iframe sandbox vuoto di EmailBuilder.', 'Metadati strutturati come elenco descrittivo.'],
  responsive: ['Larghezza e viewport sono gestiti da EmailBuilder; i metadati vanno a capo.'],
  customization: ['Composto con EmailBuilder e token --dc-*.'],
  commonMistakes: ['Aspettarsi invio email o modifica del documento in questa anteprima read-only.'],
  examples: [{ name: 'Basic', title: 'Preview mobile' }],
  status: { implemented: true, documented: true, tests: ['components/EmailPreview/EmailPreview.test.tsx'], limits: ['Non modifica o invia email.'] },
};
