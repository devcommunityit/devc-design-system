import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['Avatar', 'AvatarGroup', 'getInitials'],
  name: 'Avatar',
  slug: 'avatar',
  category: 'data',
  summary: 'Rappresentazione di una persona o entità con immagine o iniziali di fallback.',
  whenToUse: ['Elenchi di utenti, autori, assegnatari.', 'Gruppi compatti di partecipanti (AvatarGroup).'],
  whenNotToUse: ['Come unico identificativo: affianca il nome quando lo spazio lo consente.'],
  props: [
    { name: 'name', type: 'string', required: true, description: 'Nome della persona: nome accessibile e sorgente delle iniziali.' },
    { name: 'src', type: 'string', description: 'URL dell’immagine; in caso di errore si mostrano le iniziali.' },
    { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'", description: 'Dimensione.' },
    { name: 'shape', type: "'circle' | 'square'", default: "'circle'", description: 'Forma.' },
    { name: 'fallback', type: 'ReactNode', description: 'Contenuto alternativo alle iniziali (es. icona).' },
    { name: 'isDecorative', type: 'boolean', default: 'false', description: 'Nasconde l’avatar alle tecnologie assistive quando il nome è già scritto accanto.' },
    { name: 'AvatarGroup.max', type: 'number', description: 'Numero massimo visibile; il resto diventa “+N”.' },
  ],
  inherits: 'Attributi HTML di <span> (Avatar) e <div> (AvatarGroup).',
  keyboard: [],
  accessibility: ['role="img" con aria-label = name.', 'Il contatore “+N” ha un nome localizzato (“altri N”).', 'Colore di fallback deterministico dal nome: non veicola informazioni.'],
  responsive: ['Dimensioni fisse per allineamento ottico; scegli size in base al contesto.'],
  customization: ['className/style; token --dc-color-surface-*, palette dei toni di fallback.'],
  commonMistakes: ['Ripetere il nome due volte per gli screen reader: usa isDecorative se il testo è accanto.'],
  examples: [
    { name: 'Basic', title: 'Iniziali, forma e immagine non disponibile' },
    { name: 'Sizes', title: 'Dimensioni' },
    { name: 'Group', title: 'Gruppo con overflow' },
    { name: 'WithName', title: 'Con nome visibile' },
  ],
  status: { implemented: true, documented: true, tests: ['components/Data.test.tsx'], limits: ['Nessun indicatore di presenza (online/offline) incluso.'] },
};