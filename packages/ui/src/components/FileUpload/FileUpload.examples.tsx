import { useEffect, useRef, useState } from 'react';
import { Alert, Button, FileUpload, Inline, Stack, Text, type FileUploadItem } from '@devcommunityit/ui';

export function Basic() {
  return <FileUpload label="Allegati" description="Trascina i file o usa il pulsante." />;
}

export function Constraints() {
  return (
    <FileUpload
      label="Foto del documento"
      accept={['image/png', 'image/jpeg', '.pdf']}
      maxSize={2 * 1024 * 1024}
      maxFiles={2}
      showPreviews
    />
  );
}

/**
 * SIMULAZIONE LOCALE: nessun file lascia il browser. Un timer fa avanzare la percentuale;
 * i file il cui nome contiene "errore" falliscono. In produzione sostituisci il timer con il tuo upload.
 */
export function SimulatedUpload() {
  const [items, setItems] = useState<FileUploadItem[]>([]);
  const timers = useRef(new Map<string, number>());

  useEffect(() => {
    const map = timers.current;
    return () => map.forEach((id) => window.clearInterval(id));
  }, []);

  const start = (added: FileUploadItem[]) => {
    for (const item of added) {
      const timer = window.setInterval(() => {
        setItems((prev) =>
          prev.map((i) => {
            if (i.id !== item.id) return i;
            const progress = (i.progress ?? 0) + 25;
            if (progress < 100) return { ...i, status: 'uploading', progress };
            window.clearInterval(timer);
            timers.current.delete(item.id);
            return i.file.name.toLowerCase().includes('errore')
              ? { ...i, status: 'error', progress: undefined, error: 'Il server simulato ha rifiutato il file.' }
              : { ...i, status: 'success', progress: 100 };
          }),
        );
      }, 400);
      timers.current.set(item.id, timer);
    }
  };

  const completed = items.filter((i) => i.status === 'success').length;
  return (
    <Stack gap={3}>
      <Alert tone="info" title="Simulazione">
        Nessun file viene inviato: l’avanzamento è simulato localmente.
      </Alert>
      <FileUpload label="Documenti" value={items} onChange={setItems} onFilesAdded={start} maxFiles={5} />
      <Inline gap={2} align="center">
        <Text variant="body-sm" tone="secondary">
          Caricati {completed} di {items.length}
        </Text>
        <Button variant="ghost" size="sm" isDisabled={items.length === 0} onPress={() => setItems([])}>
          Svuota elenco
        </Button>
      </Inline>
    </Stack>
  );
}

export function States() {
  return (
    <Stack gap={4}>
      <FileUpload label="Disabilitato" isDisabled />
      <FileUpload label="Obbligatorio" isInvalid errorMessage="Allega almeno un documento." allowsMultiple={false} />
    </Stack>
  );
}