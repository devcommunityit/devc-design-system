import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['LiveIndicator', 'LiveIndicatorProps'],
  name: 'LiveIndicator',
  slug: 'live-indicator',
  category: 'community',
  summary:
    'Indicatore “in diretta”: punto rosso pulsante, etichetta “Live” localizzata e numero di spettatori opzionale formattato con Intl.',
  whenToUse: [
    'Segnalare una diretta streaming, un evento in corso o una sessione live.',
    'Card di eventi, hero, header di un player video.',
  ],
  whenNotToUse: [
    'Stato online di una persona: usa Avatar con un Badge di presenza.',
    'Notifiche o conteggi non legati a una diretta: usa Badge.',
  ],
  props: [
    { name: 'label', type: 'ReactNode', description: 'Etichetta visibile; predefinita “Live” (messages.live).' },
    { name: 'viewers', type: 'number', description: 'Spettatori collegati, mostrati dopo l’etichetta (messages.liveViewers).' },
    { name: 'formatOptions', type: 'Intl.NumberFormatOptions', description: 'Formato del numero di spettatori, es. { notation: "compact" }.' },
    { name: 'pulse', type: 'boolean', default: 'true', description: 'Anima il punto (sempre disattivato con prefers-reduced-motion).' },
  ],
  inherits: 'Attributi HTML di <span> (id, style, data-*, aria-*).',
  keyboard: [],
  accessibility: [
    'Testo visibile, senza ruolo: l’informazione non dipende dal solo colore del punto, che è decorativo (aria-hidden).',
    'Non è una live region: se il numero di spettatori cambia spesso evita di annunciarlo a ogni aggiornamento.',
    'Con prefers-reduced-motion il punto non pulsa; in forced-colors usa Mark con contorno.',
  ],
  responsive: ['Elemento inline compatto: va a capo con il testo circostante.'],
  customization: [
    'Token: --dc-color-feedback-danger per il punto; il testo eredita il colore (funziona su sfondi chiari e scuri).',
    'Selettori stabili: .dc-live-indicator-live[data-pulse], .dc-live-indicator-dot.',
  ],
  commonMistakes: [
    'Lasciarlo visibile a evento concluso: rimuovilo o sostituiscilo con un Badge “Replay”.',
    'Formattare a mano il numero di spettatori ignorando il locale.',
  ],
  examples: [
    { name: 'Basic', title: 'Base' },
    { name: 'WithViewers', title: 'Con spettatori', description: 'Numero formattato, anche compatto, su sfondo scuro.' },
  ],
  status: {
    implemented: true,
    documented: true,
    tests: ['components/LiveIndicator/LiveIndicator.test.tsx'],
    limits: ['Il colore del punto è fisso (feedback danger) per coerenza con la convenzione “on air”.'],
  },
};
