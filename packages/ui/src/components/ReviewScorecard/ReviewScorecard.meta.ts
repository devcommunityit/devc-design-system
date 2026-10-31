import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['ReviewScorecard', 'ReviewScorecardProps', 'ReviewCriterion'],
  name: 'ReviewScorecard',
  slug: 'review-scorecard',
  category: 'community',
  summary: 'Riepilogo visuale di punteggi per criteri e raccomandazione del revisore.',
  whenToUse: ['Mostrare a revisori o organizzatori i punteggi registrati per una proposta.'],
  whenNotToUse: ['Raccogliere o salvare i giudizi: il componente visualizza solo dati già forniti.'],
  props: [
    { name: 'title', type: 'ReactNode', required: true, description: 'Titolo della valutazione.' },
    { name: 'criteria', type: 'ReviewCriterion[]', required: true, description: 'Criteri, punteggi e commenti opzionali.' },
    { name: 'recommendation', type: 'ReactNode', description: 'Raccomandazione testuale.' },
    { name: 'summary', type: 'ReactNode', description: 'Riepilogo della revisione.' },
  ],
  inherits: 'Attributi HTML di <article> eccetto title.',
  keyboard: [{ keys: 'Tab', action: 'Non introduce controlli interattivi.' }],
  accessibility: ['I criteri sono una lista di descrizione; i punteggi usano meter nativi con etichette accessibili.'],
  responsive: ['I punteggi passano sotto il nome del criterio su spazi stretti.'],
  customization: ['Usa token --dc-* e className sul contenitore.'],
  commonMistakes: ['Fornire un punteggio entro il range coerente con maxScore.'],
  examples: [{ name: 'Basic', title: 'Valutazione con criteri' }],
  status: { implemented: true, documented: true, tests: ['components/ReviewScorecard/ReviewScorecard.test.tsx'], limits: ['Non raccoglie né persiste i punteggi.'] },
};
