import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['XpProgress', 'XpProgressProps'],
  name: 'XpProgress',
  slug: 'xp-progress',
  category: 'community',
  summary: 'Avanzamento XP verso il livello successivo, composto usando il componente Progress esistente.',
  whenToUse: ['Mostrare XP attuali, soglia e livello corrente in un profilo o in un’area community.'],
  whenNotToUse: ['Visualizzare obiettivi circolari o card KPI: usa GoalCard.', 'Calcolare XP o livelli lato applicazione.'],
  props: [
    { name: 'label', type: 'ReactNode', required: true, description: 'Nome visibile e accessibile del progresso.' },
    { name: 'currentXp', type: 'number', required: true, description: 'XP attuali.' },
    { name: 'targetXp', type: 'number', required: true, description: 'XP necessari per il prossimo livello.' },
    { name: 'level', type: 'number', description: 'Livello corrente mostrato sopra la barra.' },
    { name: 'levelLabel', type: 'ReactNode', default: "'Level'", description: 'Etichetta localizzabile del livello.' },
    { name: 'description', type: 'ReactNode', description: 'Contesto opzionale.' },
  ],
  inherits: 'Attributi HTML di <div>.',
  keyboard: [],
  accessibility: [
    'Riutilizza Progress per il ruolo progressbar, il nome accessibile e i valori.',
    'Il valore visualizzato è testuale e formattato secondo la locale attiva.',
  ],
  responsive: ['La barra lineare si adatta alla larghezza disponibile.'],
  customization: ['La barra è il Progress condiviso; il contenitore usa token --dc-* e accetta className.'],
  commonMistakes: ['Passare XP già in percentuale: currentXp e targetXp sono valori assoluti.'],
  examples: [
    { name: 'Basic', title: 'Avanzamento XP' },
    { name: 'NearlyComplete', title: 'Livello raggiunto' },
  ],
  status: { implemented: true, documented: true, tests: ['components/XpProgress/XpProgress.test.tsx'], limits: ['Non calcola l’assegnazione di XP o la progressione dei livelli.'] },
};
