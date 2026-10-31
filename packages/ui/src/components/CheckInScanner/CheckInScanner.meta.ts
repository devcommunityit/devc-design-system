import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['CheckInScanner', 'CheckInScannerProps'],
  name: 'CheckInScanner',
  slug: 'check-in-scanner',
  category: 'community',
  summary: 'Interfaccia controllata per inserimento manuale del codice con viewport opzionale fornito dall’host.',
  whenToUse: ['Raccogliere un codice ticket per un flusso di check-in gestito dal consumer.'],
  whenNotToUse: ['Accedere alla fotocamera o scansionare codici: il componente non lo fa.'],
  props: [
    { name: 'code', type: 'string', required: true, description: 'Codice controllato dal consumer.' },
    { name: 'onCodeChange', type: '(code: string) => void', required: true, description: 'Aggiornamento controllato del campo.' },
    { name: 'onCheckIn', type: '(code: string) => void', required: true, description: 'Riceve il codice manuale inviato.' },
    { name: 'scannerViewport', type: 'ReactNode', description: 'Contenuto scanner opzionale creato e gestito dall’host.' },
  ],
  inherits: 'Attributi HTML di <section> eccetto title e onSubmit.',
  keyboard: [{ keys: 'Tab / Enter', action: 'Raggiunge il campo e invia il codice valido dal pulsante o da Enter.' }],
  accessibility: ['Campo manuale associato a una label; il pulsante resta disabilitato con codice vuoto o componente disabilitato.'],
  responsive: ['Il campo manuale e il pulsante vanno a capo quando lo spazio è limitato.'],
  customization: ['Usa token --dc-* e className sul contenitore.'],
  commonMistakes: ['Non passare componenti che aprono la fotocamera senza consenso e logica forniti dall’host.'],
  examples: [{ name: 'ManualEntry', title: 'Inserimento manuale' }, { name: 'HostViewport', title: 'Viewport fornito dall’host' }],
  status: { implemented: true, documented: true, tests: ['components/CheckInScanner/CheckInScanner.test.tsx'], limits: ['Nessun accesso alla camera e nessuna scansione eseguita dal componente.'] },
};
