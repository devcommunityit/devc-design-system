import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['IndicatorBadge', 'IndicatorBadgeProps', 'IndicatorBadgeTone', 'IndicatorBadgePlacement'],
  name: 'IndicatorBadge',
  slug: 'indicator-badge',
  category: 'community',
  summary:
    'Indicatore posizionato sull’angolo di un elemento (Avatar, IconButton, icona): conteggio formattato con Intl con overflow “99+”, oppure pallino di stato, con testo accessibile dedicato.',
  whenToUse: [
    'Notifiche o messaggi non letti su un IconButton della barra superiore.',
    'Stato di presenza (online) o novità su un avatar.',
    'Conteggio di nuove risposte su un’icona di navigazione.',
  ],
  whenNotToUse: [
    'Etichette o conteggi in linea nel testo, accanto a tab o voci di menu: usa Badge.',
    'Stadio di rilascio di una funzione o di un sito: usa StageLabel.',
    'Etichette sull’angolo di card o immagini: usa Ribbon.',
    'Stato “in diretta” con testo: usa LiveIndicator.',
  ],
  props: [
    { name: 'children', type: 'ReactNode', required: true, description: 'Elemento a cui si ancora l’indicatore.' },
    { name: 'count', type: 'number', description: 'Numero mostrato; oltre max diventa “max+”.' },
    { name: 'max', type: 'number', default: '99', description: 'Valore massimo mostrato prima del “+”.' },
    { name: 'dot', type: 'boolean', default: 'false', description: 'Pallino senza numero (ha precedenza su count).' },
    { name: 'tone', type: "'danger' | 'brand' | 'success' | 'warning' | 'neutral'", default: "'danger'", description: 'Colore; brand usa il gradiente accent.' },
    { name: 'placement', type: "'top-end' | 'bottom-end' | 'top-start' | 'bottom-start'", default: "'top-end'", description: 'Angolo logico (si specchia in RTL).' },
    { name: 'showZero', type: 'boolean', default: 'false', description: 'Mostra l’indicatore anche con count 0.' },
    { name: 'label', type: 'string', description: 'Testo accessibile (es. “3 notifiche non lette”), reso visivamente nascosto; la bolla diventa aria-hidden.' },
    { name: 'pulse', type: 'boolean', default: 'false', description: 'Alone pulsante per attirare l’attenzione; disattivato con prefers-reduced-motion.' },
    { name: 'overlap', type: "'rectangular' | 'circular'", default: "'rectangular'", description: 'circular avvicina l’indicatore al bordo di elementi rotondi (avatar).' },
  ],
  inherits: 'Attributi HTML di <span> (il contenitore inline-flex).',
  keyboard: [],
  accessibility: [
    'Senza label viene letto solo il numero (“3”): passa sempre label con il contesto (“3 notifiche non lette”).',
    'Con label la bolla è aria-hidden e il testo è in un VisuallyHidden subito dopo il figlio: non entra nel nome accessibile di un IconButton figlio. Se serve nel nome, includi il conteggio anche nella label dell’IconButton.',
    'Il pallino (dot) senza label non è annunciato: aggiungi label quando trasmette un’informazione (“Online”).',
    'Quando l’indicatore è nascosto (count 0 senza showZero) anche la label non viene resa.',
    'Gli aggiornamenti del conteggio non sono annunciati automaticamente: usa una regione live (Toast o VisuallyHidden role="status") se servono.',
    'In forced-colors la bolla ha bordo di sistema e il pallino usa il colore Mark; il pulse è disattivato.',
  ],
  responsive: ['L’indicatore è posizionato in assoluto sul figlio e non cambia il layout circostante.', 'La bolla si allarga con il numero di cifre (“99+”).'],
  customization: [
    'Token: --dc-color-action-danger (predefinito), --dc-gradient-accent (brand), colori feedback e --dc-color-surface-inverse, --dc-color-surface-default per l’anello di separazione.',
    'Selettori stabili: .dc-indicator-badge-root, .dc-indicator-badge-indicator[data-tone][data-placement][data-overlap][data-dot][data-pulse].',
  ],
  commonMistakes: [
    'Omettere label: lo screen reader legge un numero senza contesto.',
    'Usare pulse in modo permanente: riservalo a novità recenti.',
    'Mettere l’indicatore dentro un elemento con overflow nascosto: viene tagliato.',
  ],
  examples: [
    { name: 'Basic', title: 'Base', description: 'Conteggi su IconButton e pallino di presenza su un avatar.' },
    { name: 'PlacementsAndTones', title: 'Posizioni e toni', description: 'Quattro angoli con overlap circolare e tutti i toni.' },
    { name: 'LiveCount', title: 'Conteggio controllato', description: 'Overflow “99+”, nascosto a zero e pulse sulle novità.' },
  ],
  status: { implemented: true, documented: true, tests: ['components/IndicatorBadge/IndicatorBadge.test.tsx'], limits: [] },
};
