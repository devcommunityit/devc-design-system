import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['QuickAction'],
  name: 'QuickAction',
  slug: 'quick-action',
  category: 'dashboard',
  summary:
    'Riquadro scorciatoia con icona, etichetta e descrizione opzionale, per le griglie di azioni rapide dei pannelli di amministrazione. È un vero <a href> o un <button>.',
  whenToUse: [
    'Griglie di scorciatoie verso le sezioni più usate (utenti, chiavi API, impostazioni).',
    'Azioni frequenti eseguite sul posto (esporta, sincronizza) con onPress.',
  ],
  whenNotToUse: [
    'Navigazione principale del portale: usa NavList o Sidebar.',
    'Azioni secondarie in una barra: usa Button o IconButton.',
    'Contenuti ricchi con più link: usa Card.',
  ],
  props: [
    { name: 'icon', type: 'ReactNode', required: true, description: 'Icona decorativa (aria-hidden).' },
    { name: 'label', type: 'ReactNode', required: true, description: 'Etichetta visibile; con la descrizione forma il nome accessibile.' },
    { name: 'description', type: 'ReactNode', description: 'Testo secondario breve.' },
    { name: 'badge', type: 'ReactNode', description: 'Elemento finale, es. Badge con un conteggio (incluso nel nome accessibile).' },
    { name: 'href', type: 'string', description: 'Se presente renderizza un <a href> (props del Link react-aria: target, rel, routerOptions…).' },
    { name: 'onPress', type: '(e: PressEvent) => void', description: 'Senza href renderizza un <button> (props del Button react-aria).' },
    { name: 'isDisabled', type: 'boolean', default: 'false', description: 'Disabilita il riquadro.' },
    { name: 'layout', type: "'vertical' | 'horizontal'", default: "'vertical'", description: 'Icona sopra (riquadro) o accanto (riga) al testo.' },
  ],
  inherits: 'Tutte le props di react-aria-components Link (con href) o Button (senza href) e gli attributi DOM globali.',
  keyboard: [
    { keys: 'Tab', action: 'Sposta il focus sul riquadro.' },
    { keys: 'Enter', action: 'Segue il link o attiva il pulsante.' },
    { keys: 'Space', action: 'Attiva il pulsante (solo variante <button>).' },
  ],
  accessibility: [
    'Elemento nativo <a href> o <button>: nessun div cliccabile.',
    'Disponi più riquadri in una lista (<ul>/<li>) così gli screen reader ne annunciano il numero.',
    'Area minima 44px; focus ring visibile e bordo di sistema in forced-colors; lo stato disabilitato usa GrayText.',
  ],
  responsive: ['Riempie la cella: usa Grid con minItemWidth per griglie che si adattano senza breakpoint.'],
  customization: [
    'Token: --dc-look-fill-tonal (icona nel look expressive), --dc-look-radius-container.',
    'Selettori stabili: .dc-quick-action-action[data-layout], stati [data-hovered], [data-pressed], [data-focus-visible], [data-disabled].',
  ],
  commonMistakes: [
    'Usare onPress con window.location per navigare: passa href.',
    'Etichette lunghe: il riquadro è una scorciatoia, la descrizione deve restare breve.',
  ],
  examples: [
    { name: 'Basic', title: 'Base' },
    { name: 'AdminGrid', title: 'Griglia di amministrazione' },
    { name: 'Horizontal', title: 'Layout orizzontale' },
    { name: 'AsButton', title: 'Come pulsante', description: 'Azione sul posto con stato locale.' },
    { name: 'Disabled', title: 'Disabilitato' },
  ],
  status: {
    implemented: true,
    documented: true,
    tests: ['components/QuickAction/QuickAction.test.tsx'],
    limits: ['Non include uno stato pending: disabilita il riquadro e aggiorna la descrizione durante l’azione, annunciando l’esito con una live region.'],
  },
};
