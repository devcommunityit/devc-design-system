import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['BadgeCollection', 'BadgeCollectionProps', 'BadgeCollectionItem'],
  name: 'BadgeCollection',
  slug: 'badge-collection',
  category: 'community',
  summary: 'Composizione guidata dai dati dei componenti esistenti AchievementBadge e AchievementBadgeGroup.',
  whenToUse: ['Mostrare una collezione di badge ottenuti o bloccati a partire da un array tipizzato.'],
  whenNotToUse: ['Sostituire AchievementBadge per un singolo traguardo.', 'Replicare badge con stili o logiche differenti.'],
  props: [
    { name: 'items', type: 'BadgeCollectionItem[]', required: true, description: 'Badge presentati con AchievementBadge.' },
    { name: 'label', type: 'string', default: "'Achievement badges'", description: 'Nome accessibile della lista.' },
    { name: 'minItemWidth', type: 'string', default: "'9rem'", description: 'Larghezza minima delle colonne responsive.' },
  ],
  inherits: 'Attributi HTML di <ul>. BadgeCollectionItem aggiunge id alle props di AchievementBadge.',
  keyboard: [],
  accessibility: [
    'Riutilizza la lista semantica e le etichette accessibili fornite da AchievementBadgeGroup e AchievementBadge.',
    'L’etichetta della lista è configurabile.',
  ],
  responsive: ['La griglia auto-fill e minItemWidth sono gestite da AchievementBadgeGroup.'],
  customization: ['Tutte le visualizzazioni e i token derivano da AchievementBadge e AchievementBadgeGroup.'],
  commonMistakes: ['Dimenticare id stabile per gli elementi o riutilizzare id duplicati.'],
  examples: [{ name: 'Basic', title: 'Collezione di traguardi' }],
  status: { implemented: true, documented: true, tests: ['components/BadgeCollection/BadgeCollection.test.tsx'], limits: ['Non aggiunge stili né logiche di badge duplicate.'] },
};
