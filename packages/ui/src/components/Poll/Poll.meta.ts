import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['Poll', 'PollProps', 'PollOption'],
  name: 'Poll',
  slug: 'poll',
  category: 'community',
  summary: 'Scelta controllata tra opzioni di un sondaggio, senza invio né risultati.',
  whenToUse: ['Raccogliere una selezione singola da presentare al consumer.'],
  whenNotToUse: ['Per votare contenuti usa PostList e VoteButton; l’invio e i risultati restano esterni.'],
  props: [
    { name: 'title', type: 'string', required: true, description: 'Etichetta del gruppo di opzioni.' },
    { name: 'options', type: 'readonly PollOption[]', required: true, description: 'Opzioni selezionabili.' },
    { name: 'value', type: 'string | null', required: true, description: 'Id selezionato controllato.' },
    { name: 'onChange', type: '(value: string | null) => void', required: true, description: 'Richiesta di cambio selezione.' },
    { name: 'description', type: 'ReactNode', description: 'Istruzioni facoltative.' },
  ],
  keyboard: [{ keys: 'Tab / Frecce / Spazio', action: 'Naviga e seleziona un’opzione con RadioGroup.' }],
  accessibility: ['Usa il RadioGroup accessibile del design system e un’etichetta visibile.'],
  responsive: ['Le opzioni occupano la larghezza disponibile.'],
  customization: ['RadioGroup gestisce gli stati; il layout usa token --dc-*.'],
  commonMistakes: ['Questo componente non invia voti, calcola risultati o seleziona un vincitore.'],
  examples: [{ name: 'Basic', title: 'Sondaggio' }],
  status: { implemented: true, documented: true, tests: ['components/Poll/Poll.test.tsx'], limits: ['Il consumer gestisce invio e conteggi.'] },
};
