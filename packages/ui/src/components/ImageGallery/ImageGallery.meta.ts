import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['ImageGallery', 'type ImageGalleryProps', 'type GalleryImage'],
  name: 'ImageGallery',
  slug: 'image-gallery',
  category: 'data',
  summary: 'Galleria di miniature con visualizzatore modale e navigazione da tastiera.',
  whenToUse: ['Mostrare una raccolta di immagini e ingrandirle senza lasciare la pagina.'],
  whenNotToUse: ['Per modificare o ritagliare un’immagine usa ImageCropper.'],
  props: [
    { name: 'aria-label', type: 'string', required: true, description: 'Nome della galleria.' },
    { name: 'images', type: 'readonly GalleryImage[]', required: true, description: 'Immagini con id, src, alt e miniature o didascalie opzionali.' },
    { name: 'selectedId / defaultSelectedId / onSelectionChange', type: 'string | null', description: 'Immagine attiva; null chiude il visualizzatore.' },
  ],
  keyboard: [{ keys: 'Tab / Invio / Escape', action: 'Apri la galleria, raggiungi i controlli e chiudi il dialogo.' }, { keys: 'Frecce / Home / Fine', action: 'Naviga le immagini nel visualizzatore; le frecce rispettano RTL.' }],
  accessibility: ['Usa Dialog per gestire focus, chiusura e nome accessibile.', 'Le miniature sono pulsanti con nome accessibile.'],
  responsive: ['La griglia si adatta alla larghezza disponibile.'],
  customization: ['Colori, bordi e spaziature usano i token.'],
  commonMistakes: ['Fornire testi alternativi descrittivi e id univoci.'],
  examples: [{ name: 'Gallery', title: 'Galleria di immagini' }],
  status: { implemented: true, documented: true, tests: ['components/ImageGallery/ImageGallery.test.tsx'], limits: ['Non carica file né applica modifiche alle immagini.'] },
};
