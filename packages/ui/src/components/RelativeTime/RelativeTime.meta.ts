import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['RelativeTime', 'selectRelativeUnit'],
  name: 'RelativeTime',
  slug: 'relative-time',
  category: 'data',
  summary:
    'Tempo relativo (“3 minuti fa”, “domani”) in un elemento <time datetime> semantico, formattato con Intl.RelativeTimeFormat secondo la locale; la data assoluta è nel title.',
  whenToUse: ['Attività recenti, notifiche, commenti, ultimo aggiornamento.'],
  whenNotToUse: ['Scadenze, appuntamenti o dati legali: mostra la data e l’ora assolute.', 'Date senza orario (compleanni, giorni di calendario): usa Intl.DateTimeFormat su un CalendarDate.'],
  props: [
    { name: 'date', type: 'Date | string | number', required: true, description: 'Istante: Date, stringa ISO 8601 con offset o millisecondi epoch.' },
    { name: 'now', type: 'Date | string | number', description: 'Istante di riferimento: output deterministico, senza aggiornamenti (test, SSR, elenchi).' },
    { name: 'updateInterval', type: 'number', default: '60000', description: 'Intervallo di aggiornamento in ms senza now; 0 disattiva.' },
    { name: 'numeric', type: "'auto' | 'always'", default: "'auto'", description: '“ieri” oppure “1 giorno fa”.' },
    { name: 'formatStyle', type: "'long' | 'short' | 'narrow'", default: "'long'", description: 'Lunghezza delle unità.' },
    { name: 'absoluteFormat', type: 'Intl.DateTimeFormatOptions', default: "{ dateStyle: 'long', timeStyle: 'short' }", description: 'Formato della data assoluta nel title.' },
    { name: 'selectRelativeUnit(diffMs)', type: '{ value: number; unit: Intl.RelativeTimeFormatUnit }', description: 'Funzione pura che sceglie l’unità (es. 90 minuti → 2 ore).' },
  ],
  inherits: 'Attributi HTML di <time> (className, style, title, data-*); ref sull’elemento.',
  keyboard: [],
  accessibility: [
    'Il testo relativo è letto normalmente; datetime contiene l’istante ISO per macchine e tecnologie assistive.',
    'Il title non è accessibile a tutti (touch, tastiera): se l’orario esatto conta, mostralo anche come testo.',
    'Gli aggiornamenti periodici non sono annunciati (nessuna regione live) per non disturbare.',
  ],
  responsive: ['Testo inline; formatStyle="short" riduce la lunghezza negli spazi stretti.'],
  customization: ['Locale dal LocaleProvider; stili tramite className.'],
  commonMistakes: [
    'Passare stringhe ISO senza offset (“2024-06-12T10:00”): sono interpretate nel fuso del browser.',
    'Calcolare il tempo relativo sul server senza now: testo diverso tra server e client (l’avviso di hydration è soppresso, ma il testo cambia).',
  ],
  examples: [
    { name: 'Basic', title: 'Ultimo aggiornamento' },
    { name: 'PastAndFuture', title: 'Passato e futuro' },
    { name: 'EnglishShort', title: 'Inglese, stile breve' },
    { name: 'Live', title: 'Aggiornamento automatico' },
  ],
  status: {
    implemented: true,
    documented: true,
    tests: ['components/RelativeTime/RelativeTime.test.tsx'],
    limits: ['Mesi e anni sono approssimati (30 e 365 giorni).', 'Con una data non valida non renderizza nulla e mostra un avviso in sviluppo.'],
  },
};
