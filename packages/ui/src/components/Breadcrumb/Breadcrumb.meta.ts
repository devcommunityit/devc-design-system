import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['Breadcrumb', 'BreadcrumbItem'],
  name: 'Breadcrumb',
  slug: 'breadcrumb',
  category: 'navigation',
  summary: 'Mostra la posizione della pagina nella gerarchia e permette di risalire ai livelli superiori.',
  whenToUse: ['Strutture gerarchiche profonde (sezioni, sottosezioni, dettaglio).'],
  whenNotToUse: ['Flussi sequenziali: usa Stepper.', 'Siti piatti con un solo livello.'],
  props: [
    { name: 'maxItems', type: 'number', description: 'Oltre questo numero gli elementi centrali vengono compressi in un pulsante “…” espandibile.' },
    { name: 'aria-label', type: 'string', default: 'messages.breadcrumb', description: 'Nome del landmark.' },
    { name: 'BreadcrumbItem: href', type: 'string', description: 'Destinazione. Senza href l’elemento è la pagina corrente.' },
    { name: 'BreadcrumbItem: isCurrent', type: 'boolean', description: 'Forza aria-current="page".' },
    { name: 'BreadcrumbItem: linkProps', type: 'LinkProps', description: 'Props per il link interno (routerOptions, target…).' },
  ],
  inherits: 'Attributi HTML di <nav> e <li>.',
  keyboard: [{ keys: 'Tab', action: 'Scorre i link e il pulsante di espansione.' }],
  accessibility: [
    'Landmark nav con lista ordinata.',
    'La pagina corrente ha aria-current="page" e non è un link.',
    'I separatori sono decorativi (aria-hidden) e si specchiano in RTL.',
  ],
  responsive: ['Gli elementi vanno a capo; con maxItems la traccia resta breve su mobile.'],
  customization: ['Colori: text.secondary per i link, text.primary per la pagina corrente.'],
  commonMistakes: ['Rendere la pagina corrente un link a sé stessa.', 'Usare il breadcrumb come unica navigazione su mobile.'],
  examples: [
    { name: 'Basic', title: 'Base' },
    { name: 'Collapsed', title: 'Compresso con maxItems' },
    { name: 'FolderNavigation', title: 'Navigazione tra cartelle con stato', description: 'Il percorso è nello stato: linkProps.onPress torna a una cartella superiore, i pulsanti aprono le sottocartelle.' },
    { name: 'LongLabels', title: 'Etichette lunghe e pagina corrente con href', description: 'Le voci lunghe vanno a capo in un contenitore stretto; isCurrent rende l’ultima voce pagina corrente anche con href.' },
  ],
  status: { implemented: true, documented: true, tests: ['components/Breadcrumb/Breadcrumb.test.tsx'], limits: [] },
  apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/',
};
