import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['AchievementBadge', 'AchievementBadgeProps', 'AchievementBadgeTier', 'AchievementBadgeGroup', 'AchievementBadgeGroupProps'],
  name: 'AchievementBadge',
  slug: 'achievement-badge',
  category: 'community',
  summary:
    'Medaglia di gamification per la community: medaglione esagonale o circolare con icona e colore del livello (bronzo, argento, oro, platino, brand), titolo, data di conseguimento localizzata oppure stato bloccato con avanzamento.',
  whenToUse: [
    'Mostrare i traguardi ottenuti nel profilo di un membro (“Primo talk”, “Top contributor”).',
    'Elencare i badge ancora da sbloccare con l’avanzamento verso l’obiettivo.',
    'Celebrare un traguardo appena raggiunto in una pagina o in un dialogo.',
  ],
  whenNotToUse: [
    'Etichette di stato o categorie brevi: usa Badge.',
    'Conteggi o pallini su avatar e icone: usa IndicatorBadge.',
    'Classifiche con posizioni e punteggi: usa Leaderboard o RankingCard.',
    'Avanzamento di un obiettivo numerico in dashboard: usa GoalCard.',
  ],
  props: [
    { name: 'icon', type: 'ReactNode', required: true, description: 'Icona decorativa nel medaglione.' },
    { name: 'title', type: 'ReactNode', required: true, description: 'Nome del traguardo.' },
    { name: 'description', type: 'ReactNode', description: 'Cosa premia il traguardo.' },
    { name: 'tier', type: "'bronze' | 'silver' | 'gold' | 'platinum' | 'brand'", default: "'brand'", description: 'Livello e colore della medaglia; brand usa il gradiente accent e non ha un nome predefinito.' },
    { name: 'tierLabel', type: 'string', description: 'Sostituisce il nome localizzato del livello (necessario per mostrarlo con tier brand).' },
    { name: 'earnedAt', type: 'Date | string', description: 'Data di conseguimento, mostrata come “Ottenuto il …” con Intl.DateTimeFormat; ignorata se bloccato.' },
    { name: 'dateFormatOptions', type: 'Intl.DateTimeFormatOptions', default: "{ dateStyle: 'medium' }", description: 'Formato della data.' },
    { name: 'isLocked', type: 'boolean', default: 'false', description: 'Non ancora ottenuto: medaglia in scala di grigi, lucchetto e testo “Bloccato”.' },
    { name: 'progress', type: '{ value: number; max: number }', description: 'Avanzamento verso un traguardo bloccato (barra Progress con valore “6 / 10”).' },
    { name: 'shape', type: "'hexagon' | 'circle'", default: "'hexagon'", description: 'Forma del medaglione; in forced-colors diventa sempre un cerchio.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Dimensione di medaglione e titolo.' },
    { name: 'layout', type: "'stacked' | 'inline'", default: "'stacked'", description: 'Medaglia sopra il testo centrato oppure accanto.' },
    { name: 'headingLevel', type: '2 | 3 | 4 | 5 | 6', description: 'Se impostato, il titolo diventa un heading di quel livello.' },
    { name: 'AchievementBadgeGroup.minItemWidth', type: 'string', default: "'9rem'", description: 'Larghezza minima delle colonne della griglia <ul> che avvolge ogni badge in un <li>.' },
  ],
  inherits: 'Attributi HTML di <div> (AchievementBadge) e di <ul> (AchievementBadgeGroup).',
  keyboard: [],
  accessibility: [
    'Il medaglione è decorativo (aria-hidden): titolo, livello, stato bloccato e data sono testo visibile e localizzato.',
    'Il livello è un Badge con testo (“Oro”), non affidato al solo colore; lo stato bloccato è scritto (“Bloccato”) oltre alla scala di grigi.',
    'La barra di avanzamento è un Progress (role="progressbar") nominato dal titolo, con valore testuale “6 / 10”.',
    'AchievementBadgeGroup è una lista <ul>: dagli un aria-label (“Badge ottenuti”).',
    'In forced-colors il medaglione diventa un cerchio con bordo di sistema (tratteggiato se bloccato).',
  ],
  responsive: [
    'AchievementBadgeGroup usa una griglia auto-fill con minItemWidth: le colonne si riducono nei contenitori stretti.',
    'Il layout inline va bene in sidebar di profilo; stacked in griglie e celebrazioni.',
  ],
  customization: [
    'Token: --dc-gradient-accent-sheen (brand); i livelli metallici sono derivati con color-mix da --dc-color-feedback-warning (bronzo, oro), --dc-color-border-strong/--dc-color-text-muted (argento), --dc-color-feedback-info-border/--dc-color-data-6 (platino).',
    'Selettori stabili: .dc-achievement-badge-achievement[data-tier][data-shape][data-size][data-layout][data-locked], .dc-achievement-badge-medal, .dc-achievement-badge-face, .dc-achievement-badge-group.',
  ],
  commonMistakes: [
    'Usare un’icona significativa senza titolo: il medaglione è decorativo, il significato sta nel testo.',
    'Passare date come stringhe ambigue (“12/03/2026”): usa Date o ISO 8601.',
    'Mostrare progress su un badge già ottenuto: viene ignorato, serve solo con isLocked.',
  ],
  examples: [
    { name: 'Basic', title: 'Base' },
    { name: 'Tiers', title: 'Livelli', description: 'Bronzo, argento, oro, platino e brand con nome personalizzato.' },
    { name: 'Locked', title: 'Bloccati con avanzamento' },
    { name: 'SizesAndLayout', title: 'Dimensioni e layout inline' },
  ],
  status: {
    implemented: true,
    documented: true,
    tests: ['components/AchievementBadge/AchievementBadge.test.tsx'],
    limits: [
      'Non esistono token dedicati ai metalli: oro, argento, bronzo e platino sono derivati dai colori semantici e cambiano con il tema.',
      'Il tier brand non ha un nome localizzato: usa tierLabel per mostrarlo.',
    ],
  },
};
