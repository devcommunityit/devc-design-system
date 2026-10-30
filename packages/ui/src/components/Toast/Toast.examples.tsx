import { Button, Inline, ToastProvider, useToast } from '@dev-community/ui';

function Demo() {
  const toast = useToast();
  return (
    <Inline gap={2} wrap>
      <Button onPress={() => toast.show({ title: 'Modifiche salvate', tone: 'success' })}>Successo</Button>
      <Button
        variant="secondary"
        onPress={() =>
          toast.show({
            title: 'Messaggio archiviato',
            tone: 'neutral',
            action: { label: 'Annulla', onAction: () => toast.show({ title: 'Messaggio ripristinato', tone: 'info' }) },
          })
        }
      >
        Con azione
      </Button>
      <Button
        variant="danger"
        onPress={() => toast.show({ title: 'Sincronizzazione non riuscita', description: 'Resterà visibile finché non la chiudi.', tone: 'danger' })}
      >
        Errore persistente
      </Button>
      <Button variant="ghost" onPress={() => toast.clear()}>
        Chiudi tutti
      </Button>
    </Inline>
  );
}

export function Basic() {
  return (
    <ToastProvider>
      <Demo />
    </ToastProvider>
  );
}