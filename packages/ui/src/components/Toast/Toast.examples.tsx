import { useState } from 'react';
import {
  Button,
  Inline,
  Radio,
  RadioGroup,
  Stack,
  Text,
  ToastProvider,
  useToast,
  useToasts,
  type ToastOptions,
  type ToastProviderProps,
} from '@dev-community/ui';

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

function DurationsDemo() {
  const toast = useToast();
  const toasts = useToasts();
  const [lastId, setLastId] = useState<string | null>(null);
  const [closed, setClosed] = useState(0);
  const show = (options: ToastOptions) => setLastId(toast.show({ ...options, onClose: () => setClosed((n) => n + 1) }));
  const lastIsVisible = lastId !== null && toasts.some((item) => item.id === lastId);
  return (
    <Stack gap={3}>
      <Inline gap={2} wrap>
        <Button
          variant="secondary"
          onPress={() => show({ title: 'Bozza salvata', description: 'Si chiude da sola dopo 2 secondi.', tone: 'success', duration: 2000 })}
        >
          Breve (2 s)
        </Button>
        <Button variant="secondary" onPress={() => show({ title: 'Report in preparazione', description: 'Durata predefinita: 6 secondi.' })}>
          Predefinita (6 s)
        </Button>
        <Button
          variant="secondary"
          onPress={() =>
            show({ title: 'Manutenzione stasera alle 22:00', description: 'Resta visibile finché non la chiudi.', tone: 'warning', duration: null })
          }
        >
          Persistente
        </Button>
        <Button
          variant="outline"
          isDisabled={!lastIsVisible}
          onPress={() => {
            if (lastId !== null) toast.dismiss(lastId);
          }}
        >
          Chiudi l’ultimo
        </Button>
      </Inline>
      <Text variant="body-sm" tone="secondary">
        Toast attivi: {toasts.length} · chiusi finora: {closed}
      </Text>
    </Stack>
  );
}

export function Durations() {
  return (
    <ToastProvider>
      <DurationsDemo />
    </ToastProvider>
  );
}

type ToastPlacement = NonNullable<ToastProviderProps['placement']>;

const placements: Array<{ value: ToastPlacement; label: string }> = [
  { value: 'top-start', label: 'In alto, inizio' },
  { value: 'top-center', label: 'In alto, centro' },
  { value: 'top-end', label: 'In alto, fine' },
  { value: 'bottom-start', label: 'In basso, inizio' },
  { value: 'bottom-center', label: 'In basso, centro' },
  { value: 'bottom-end', label: 'In basso, fine' },
];

function QueueDemo({ maxVisible }: { maxVisible: number }) {
  const toast = useToast();
  const toasts = useToasts();
  const queued = Math.max(0, toasts.length - maxVisible);
  return (
    <Stack gap={3}>
      <Inline gap={2} wrap>
        <Button
          onPress={() => {
            toast.show({ title: 'Fattura 2025/0142 inviata', tone: 'success' });
            toast.show({ title: 'Promemoria creato', description: 'Ti avviseremo il 3 marzo.', tone: 'info' });
            toast.show({ title: 'Allegato troppo grande', description: 'Il limite è 10 MB.', tone: 'warning' });
          }}
        >
          Mostra 3 notifiche
        </Button>
        <Button variant="ghost" isDisabled={toasts.length === 0} onPress={() => toast.clear()}>
          Chiudi tutte
        </Button>
      </Inline>
      <Text variant="body-sm" tone="secondary">
        Visibili: {toasts.length - queued} · in coda: {queued}
      </Text>
    </Stack>
  );
}

export function Placement() {
  const [placement, setPlacement] = useState<ToastPlacement>('top-center');
  return (
    <ToastProvider placement={placement} maxVisible={2}>
      <Stack gap={4}>
        <RadioGroup
          label="Posizione delle notifiche"
          orientation="horizontal"
          value={placement}
          onChange={(value) => {
            const next = placements.find((option) => option.value === value);
            if (next) setPlacement(next.value);
          }}
        >
          {placements.map((option) => (
            <Radio key={option.value} value={option.value}>
              {option.label}
            </Radio>
          ))}
        </RadioGroup>
        <QueueDemo maxVisible={2} />
      </Stack>
    </ToastProvider>
  );
}