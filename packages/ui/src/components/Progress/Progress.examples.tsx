import { useEffect, useState } from 'react';
import { Button, CircularProgress, Inline, Progress, Stack, Switch, Text } from '@devcommunityit/ui';

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
type StorageTone = 'brand' | 'warning' | 'danger';

function toneFor(value: number): StorageTone {
  if (value >= 90) return 'danger';
  if (value >= 70) return 'warning';
  return 'brand';
}

export function Controlled() {
  const [value, setValue] = useState(40);
  const tone = toneFor(value);
  const step = (delta: number) => setValue((v) => Math.min(100, Math.max(0, v + delta)));
  return (
    <Stack gap={3}>
      <Progress label="Spazio di archiviazione" value={value} tone={tone} valueLabel={`${value} GB di 100 GB`} />
      <Inline gap={4} align="center">
        <CircularProgress value={value} tone={tone} aria-label="Spazio di archiviazione (circolare)" />
        <Text>
          Valore corrente: {value} GB{tone === 'danger' ? ' — quasi pieno' : tone === 'warning' ? ' — attenzione' : ''}
        </Text>
      </Inline>
      <Inline gap={2}>
        <Button size="sm" variant="secondary" onPress={() => step(-10)} isDisabled={value <= 0}>
          −10 GB
        </Button>
        <Button size="sm" variant="secondary" onPress={() => step(10)} isDisabled={value >= 100}>
          +10 GB
        </Button>
        <Button size="sm" variant="ghost" onPress={() => setValue(40)}>
          Ripristina
        </Button>
      </Inline>
    </Stack>
  );
}

export function SizesAndFormats() {
  const [indeterminate, setIndeterminate] = useState(false);
  return (
    <Stack gap={4}>
      <Switch isSelected={indeterminate} onChange={setIndeterminate}>
        Durata sconosciuta (indeterminato)
      </Switch>
      <Progress size="sm" label="Piccolo" value={indeterminate ? undefined : 30} />
      <Progress size="md" label="Medio" value={indeterminate ? undefined : 55} tone="success" />
      <Progress size="lg" label="Grande" value={indeterminate ? undefined : 80} tone="warning" />
      <Progress label="File caricati" value={7} minValue={0} maxValue={12} formatOptions={{ style: 'decimal' }} valueLabel="7 di 12 file" />
      <Progress aria-label="Avanzamento senza etichetta visibile" value={45} showValue={false} />
      <Progress label="Elaborazione dell’archivio storico degli ordini dal 2015 a oggi, inclusi resi e note di credito" value={12} />
    </Stack>
  );
}
