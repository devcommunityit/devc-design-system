import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  entry: 'widgets',
  exports: ['ImageCropper', 'type ImageCropperProps', 'type ImageCrop', 'type ImageCropResult'],
  name: 'ImageCropper',
  slug: 'image-cropper',
  category: 'forms',
  summary: 'Selezione e ritaglio di un’immagine con puntatore o campi numerici.',
  whenToUse: ['Ritagliare avatar e altre immagini prima di salvarle o caricarle.'],
  whenNotToUse: ['Per visualizzare immagini senza modificarle usa ImageGallery.'],
  props: [
    { name: 'aria-label', type: 'string', required: true, description: 'Nome del componente.' },
    { name: 'src', type: 'string', required: true, description: 'Sorgente dell’immagine.' },
    { name: 'alt', type: 'string', required: true, description: 'Testo alternativo dell’immagine.' },
    { name: 'crossOrigin', type: "'anonymous' | 'use-credentials'", default: "'anonymous'", description: 'Modalità CORS; le credenziali sono opzionali.' },
    { name: 'onCrop', type: '(result: ImageCropResult) => void | Promise<void>', required: true, description: 'Riceve il rettangolo e il Blob ritagliato.' },
    { name: 'crop / defaultCrop / onCropChange', type: 'ImageCrop', description: 'Rettangolo in pixel dell’immagine originale.' },
    { name: 'mimeType / quality / onError', type: 'string / number / function', description: 'Formato e qualità del Blob e gestione degli errori.' },
  ],
  keyboard: [{ keys: 'Tab / frecce', action: 'Modifica posizione e dimensioni tramite i campi numerici.' }],
  accessibility: ['I campi numerici consentono di selezionare la stessa area senza trascinamento.', 'Gli errori sono annunciati.'],
  responsive: ['L’immagine si ridimensiona mantenendo le coordinate nei pixel originali.'],
  customization: ['Bordo e maschera usano i token.'],
  commonMistakes: ['Le immagini remote richiedono CORS corretto per la lettura del canvas.', 'Il salvataggio e il caricamento restano responsabilità del consumer.'],
  examples: [{ name: 'Crop', title: 'Ritaglio' }],
  status: { implemented: true, documented: true, tests: ['components/ImageCropper/ImageCropper.test.tsx'], limits: ['Rettangolo libero, senza rotazione o rapporto fisso.'] },
};
