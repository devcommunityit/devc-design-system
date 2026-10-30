import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['Link'],
  name: 'Link',
  slug: 'link',
  category: 'typography',
  summary: 'Collegamento ipertestuale reale (<a href>) basato su react-aria-components Link, compatibile con qualunque router tramite RouterProvider.',
  whenToUse: ['Navigare verso un’altra pagina o sezione, anche esterna.'],
  whenNotToUse: ['Per eseguire un’azione: usa Button.', 'Per un link con aspetto di pulsante: usa LinkButton.'],
  props: [
    { name: 'href', type: 'string', description: 'Destinazione. Senza href viene renderizzato uno <span role="link">: evitalo.' },
    { name: 'variant', type: "'inline' | 'standalone'", default: "'inline'", description: 'inline è sottolineato nel testo; standalone si sottolinea all’hover/focus.' },
    { name: 'external', type: 'boolean', default: 'false', description: 'Apre in una nuova scheda con rel="noopener noreferrer", icona e testo nascosto localizzato.' },
    { name: 'target / rel', type: 'string', description: 'Attributi nativi (ignorati se external).' },
  ],
  inherits: 'Props di react-aria-components Link (onPress, routerOptions, download, hrefLang…) e attributi DOM.',
  keyboard: [{ keys: 'Enter', action: 'Segue il link.' }],
  accessibility: [
    'I link inline sono sottolineati: non si distinguono solo per colore (WCAG 1.4.1).',
    'Il link esterno annuncia “(si apre in una nuova scheda)” tramite testo nascosto tradotto.',
  ],
  responsive: ['Gli URL lunghi vanno a capo senza causare overflow (overflow-wrap).'],
  customization: ['Colore: token color.text.link; selettore .dc-typography-link[data-variant].'],
  commonMistakes: ['Testo del link generico (“clicca qui”): il testo deve descrivere la destinazione.'],
  examples: [
    { name: 'Inline', title: 'Nel testo' },
    { name: 'External', title: 'Esterno' },
    { name: 'Standalone', title: 'Autonomo (navigazione)' },
  ],
  status: { implemented: true, documented: true, tests: ['components/Typography/Typography.test.tsx'], limits: [] },
};