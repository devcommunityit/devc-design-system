import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['ResponseFeedback'],
  name: 'ResponseFeedback',
  slug: 'response-feedback',
  category: 'ai',
  summary: 'Valutazione utile/non utile con selezione esclusiva e annullabile, controlled o uncontrolled.',
  whenToUse: ['Raccogliere una valutazione esplicita della risposta.', 'Collegare feedback a telemetria gestita dal consumer.'],
  whenNotToUse: ['Misurare automaticamente correttezza o sicurezza di un modello.', 'Raccogliere dati personali senza informativa appropriata.'],
  props: [
    { name: 'value / defaultValue', type: "FeedbackValue = 'helpful' | 'unhelpful' | null", default: 'null', description: 'Valore controlled o iniziale.' },
    { name: 'onChange', type: '(value: FeedbackValue) => void', description: 'Selezione, cambio di risposta o null cliccando di nuovo.' },
    { name: 'isDisabled', type: 'boolean', default: 'false', description: 'Blocca entrambi i pulsanti.' },
  ],
  inherits: 'Attributi HTML di div, aria-label, className, style e ref HTMLDivElement.',
  keyboard: [{ keys: 'Tab', action: 'Sposta il focus tra i due pulsanti.' }, { keys: 'Invio / Spazio', action: 'Seleziona o annulla il feedback.' }],
  accessibility: ['Testo visibile localizzato e stato aria-pressed.', 'La selezione ha anche un bordo, non solo un cambio di colore.'],
  responsive: ['I pulsanti possono andare a capo.'],
  customization: ['Tutte le etichette sono sostituibili tramite LocaleProvider.'],
  commonMistakes: ['Cambiare modalità controlled/uncontrolled durante la vita del componente.', 'Considerare il callback una persistenza effettiva.'],
  examples: [
    { name: 'Basic', title: 'Feedback locale' },
    { name: 'Controlled', title: 'Valore controllato e reset' },
    { name: 'Localized', title: 'Arabo, RTL e sola visualizzazione' },
  ],
  status: { implemented: true, documented: true, tests: ['components/ResponseFeedback/ResponseFeedback.test.tsx'], limits: ['Nessuna rete, analisi o persistenza.'] },
};
