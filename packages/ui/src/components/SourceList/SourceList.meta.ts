import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['SourceList'],
  name: 'SourceList',
  slug: 'source-list',
  category: 'ai',
  summary: 'Elenco ordinato di fonti con titolo, link e descrizione; componibile nel footer di una risposta.',
  whenToUse: ['Rendere consultabili le fonti di una risposta.', 'Presentare riferimenti editoriali selezionati dal consumer.'],
  whenNotToUse: ['Affermare che le citazioni siano state verificate automaticamente.', 'Mostrare documenti riservati senza autorizzazione server.'],
  props: [
    { name: 'sources', type: 'readonly SourceReference[]', required: true, description: 'id univoco, title e href; description opzionale.' },
    { name: 'label', type: 'ReactNode', description: 'Nome visibile della sezione; default localizzato.' },
  ],
  inherits: 'Attributi HTML di section, className, style e ref HTMLElement.',
  keyboard: [{ keys: 'Tab / Invio', action: 'Raggiunge e segue i link con il router del consumer.' }],
  accessibility: ['Elenco ordinato semantico, link con testo descrittivo e sezione nominata.'],
  responsive: ['Titoli e descrizioni lunghi vanno a capo.'],
  customization: ['Token di testo e spaziatura; label e description accettano ReactNode.'],
  commonMistakes: ['Passare URL non attendibili senza validarli nel consumer.', 'Confondere la presenza di una fonte con la correttezza della risposta.'],
  examples: [
    { name: 'Basic', title: 'Fonti con descrizioni' },
    { name: 'CustomLabel', title: 'Etichetta personalizzata' },
    { name: 'InMessage', title: 'Fonti nel messaggio' },
  ],
  status: { implemented: true, documented: true, tests: ['components/SourceList/SourceList.test.tsx'], limits: ['Non scarica, verifica o indicizza le fonti; URL, permessi e attendibilità appartengono al consumer.'] },
};
