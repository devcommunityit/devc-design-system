import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['AIToolCall', 'AIToolCallProps', 'AIToolCallStatus'],
  name: 'AIToolCall',
  slug: 'ai-tool-call',
  category: 'ai',
  summary: 'Stato e approvazione umana per un’operazione invocata da un assistente AI.',
  whenToUse: ['Mostrare operazioni in corso, completate, fallite o in attesa di approvazione.'],
  whenNotToUse: ['Messaggi conversazionali: usa ChatMessage.'],
  props: [
    { name: 'title', type: 'string', required: true, description: 'Nome leggibile dell’operazione.' },
    { name: 'status', type: "'running' | 'completed' | 'failed' | 'approval'", required: true, description: 'Stato dell’invocazione.' },
    { name: 'description / details', type: 'ReactNode', description: 'Contesto breve e dettagli espandibili.' },
    { name: 'onApprove / onReject', type: '() => void', description: 'Azioni mostrate nello stato approval, se fornite.' },
    { name: 'statusLabels', type: 'Partial<Record<AIToolCallStatus, string>>', description: 'Etichette localizzate per gli stati.' },
    { name: 'approveLabel / rejectLabel / detailsLabel', type: 'string', description: 'Sostituiscono le etichette localizzate dei controlli.' },
  ],
  keyboard: [{ keys: 'Tab / Invio / Spazio', action: 'Usa controlli standard per espandere dettagli e attivare le azioni.' }],
  accessibility: ['Gli aggiornamenti di stato sono annunciati con live region.', 'Lo stato fallito usa role=alert; le approvazioni sono azioni esplicite.'],
  responsive: ['Intestazione e azioni vanno a capo su contenitori stretti.'],
  customization: ['Le varianti usano token di stato e possono essere sovrascritte con CSS esterno.'],
  commonMistakes: ['Il componente visualizza solo lo stato: collega le azioni e aggiorna status nel consumer.'],
  examples: [{ name: 'Approval', title: 'Richiesta di approvazione' }],
  status: { implemented: true, documented: true, tests: ['components/AIToolCall/AIToolCall.test.tsx'], limits: ['Le azioni e lo stato dell’operazione sono gestiti dal consumer.'] },
};
