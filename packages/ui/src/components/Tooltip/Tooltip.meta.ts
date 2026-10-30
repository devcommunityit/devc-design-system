import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['Tooltip', 'TooltipContent'],
  name: 'Tooltip',
  slug: 'tooltip',
  category: 'data',
  summary: 'Breve descrizione testuale mostrata al passaggio del mouse o al focus da tastiera.',
  whenToUse: ['Chiarire la funzione di un controllo, soprattutto icon button.', 'Mostrare scorciatoie da tastiera.'],
  whenNotToUse: ['Informazioni essenziali o contenuto interattivo: usa Popover o testo visibile.', 'Su dispositivi touch come unico canale: il tooltip non compare al tocco.'],
  props: [
    { name: 'content', type: 'ReactNode', required: true, description: 'Testo del tooltip (non interattivo).' },
    { name: 'children', type: 'ReactElement', required: true, description: 'Trigger focalizzabile della libreria (Button, IconButton, Link…) o avvolto in Focusable di react-aria.' },
    { name: 'placement', type: "'top' | 'bottom' | 'start' | 'end' | …", default: "'top'", description: 'Posizione preferita; si ribalta se manca spazio.' },
    { name: 'delay', type: 'number', default: '500', description: 'Ritardo di apertura al passaggio del mouse (ms). Il focus da tastiera apre subito.' },
    { name: 'showArrow', type: 'boolean', description: 'Mostra la freccia verso il trigger.' },
    { name: 'isOpen / defaultOpen / onOpenChange', type: 'TooltipTrigger', description: 'Stato controllato o non controllato.' },
  ],
  inherits: 'Props di TooltipTrigger di react-aria-components.',
  keyboard: [
    { keys: 'Tab', action: 'Il focus sul trigger mostra il tooltip.' },
    { keys: 'Escape', action: 'Nasconde il tooltip senza spostare il focus.' },
  ],
  accessibility: ['Collegato al trigger con aria-describedby: integra, non sostituisce, il nome accessibile.', 'Chiudibile con Escape senza spostare il focus (WCAG 1.4.13); il contenuto deve restare breve.', 'Renderizzato nel portal del ThemeProvider di origine.'],
  responsive: ['Larghezza massima limitata; testo a capo automaticamente.'],
  customization: ['className su Tooltip; TooltipContent per composizioni personalizzate con TooltipTrigger.'],
  commonMistakes: ['Usare un <span> come trigger: non è focalizzabile.', 'Inserire link o pulsanti nel tooltip.'],
  examples: [
    { name: 'Basic', title: 'Base' },
    { name: 'Placements', title: 'Posizionamento (logico, rispetta RTL)' },
    { name: 'IconToolbar', title: 'Barra di icon button' },
    { name: 'Controlled', title: 'Stato controllato e apertura immediata', description: 'isOpen + onOpenChange con delay={0}; il contenuto cambia dopo l’azione del pulsante.' },
    { name: 'Variants', title: 'Testo lungo, senza freccia e disattivato', description: 'Scorciatoia nel testo, contenuto lungo che va a capo, showArrow={false} e isDisabled controllato da uno Switch. L’informazione resta disponibile anche come testo visibile.' },
  ],
  status: { implemented: true, documented: true, tests: ['components/Data.test.tsx'], limits: ['Non disponibile su touch (comportamento intenzionale del pattern).'] },
  apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/',
};