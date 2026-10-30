import { useEffect, useState } from 'react';
import { Button, CircularProgress, Inline, Progress, Stack } from '@dev-community/ui';

export function Linear() {
  return (
    <Stack gap={4}>
      <Progress label="Profilo completato" value={60} />
      <Progress label="Spazio usato" value={92} tone="warning" valueLabel="9,2 GB di 10 GB" />
      <Progress label="Sincronizzazione in corso" />
    </Stack>
  );
}

export function Circular() {
  return (
    <Inline gap={4} align="center">
      <CircularProgress value={25} size="sm" aria-label="Attività" />
      <CircularProgress value={70} aria-label="Obiettivo mensile" tone="success" />
      <CircularProgress value={90} size="lg" aria-label="Quota" tone="danger" />
      <CircularProgress aria-label="Caricamento" />
    </Inline>
  );
}

/** Simulazione locale: un timer fa avanzare il valore. */
export function Simulated() {
  const [value, setValue] = useState(0);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setValue((v) => (v >= 100 ? 100 : v + 10)), 300);
    return () => window.clearInterval(id);
  }, [running]);
  const done = value >= 100;
  return (
    <Stack gap={3}>
      <Progress label="Esportazione (simulata)" value={value} tone={done ? 'success' : 'brand'} />
      <Inline gap={2}>
        <Button size="sm" onPress={() => setRunning(true)} isDisabled={running && !done}>
          Avvia
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onPress={() => {
            setRunning(false);
            setValue(0);
          }}
        >
          Azzera
        </Button>
      </Inline>
    </Stack>
  );
}