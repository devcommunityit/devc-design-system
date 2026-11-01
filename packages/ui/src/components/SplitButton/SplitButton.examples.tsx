import { Copy, FileDown, Save, Send, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { MenuItem, MenuSeparator, SplitButton, Stack, Text, type Key } from '@devcommunityit/ui';

const labels: Record<string, string> = {
  'save-copy': 'Salva come copia',
  'save-template': 'Salva come modello',
  export: 'Esporta PDF',
  discard: 'Scarta bozza',
};

export function Basic() {
  const [last, setLast] = useState('nessuna');
  return (
    <Stack gap={3} align="start">
      <SplitButton
        startIcon={<Save />}
        onPress={() => setLast('Salva')}
        onAction={(key: Key) => setLast(labels[String(key)] ?? String(key))}
        disabledKeys={['save-template']}
        menu={
          <>
            <MenuItem id="save-copy" icon={<Copy />}>Salva come copia</MenuItem>
            <MenuItem id="save-template">Salva come modello</MenuItem>
            <MenuItem id="export" icon={<FileDown />}>Esporta PDF</MenuItem>
            <MenuSeparator />
            <MenuItem id="discard" icon={<Trash2 />} tone="danger">Scarta bozza</MenuItem>
          </>
        }
      >
        Salva
      </SplitButton>
      <Text variant="body-sm" tone="secondary">Ultima azione: {last}</Text>
    </Stack>
  );
}

/** The primary action is pending for 1.5 s (local simulation); the menu stays available. */
export function Pending() {
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState('Draft');
  return (
    <Stack gap={3} align="start">
      <SplitButton
        variant="secondary"
        startIcon={<Send />}
        isPending={pending}
        menuLabel="More send options"
        onPress={() => {
          setPending(true);
          window.setTimeout(() => {
            setPending(false);
            setStatus('Sent (simulated)');
          }, 1500);
        }}
        onAction={(key) => setStatus(key === 'schedule' ? 'Scheduled for tomorrow 9:00 (simulated)' : 'Sent as test (simulated)')}
        menu={
          <>
            <MenuItem id="schedule">Schedule send</MenuItem>
            <MenuItem id="test">Send test email</MenuItem>
          </>
        }
      >
        Send
      </SplitButton>
      <Text variant="body-sm" tone="secondary">Status: {status}</Text>
    </Stack>
  );
}

export function SizesAndDisabled() {
  const [last, setLast] = useState('nessuna');
  return (
    <Stack gap={3} align="start">
      <SplitButton size="sm" variant="outline" onPress={() => setLast('Piccolo')} onAction={() => setLast('Piccolo › Duplica')} menu={<MenuItem id="dup">Duplica</MenuItem>}>
        Piccolo
      </SplitButton>
      <SplitButton size="lg" onPress={() => setLast('Grande')} onAction={() => setLast('Grande › Duplica')} menu={<MenuItem id="dup">Duplica</MenuItem>}>
        Grande
      </SplitButton>
      <SplitButton isDisabled menu={<MenuItem id="dup">Duplica</MenuItem>}>
        Disabilitato
      </SplitButton>
      <Text variant="body-sm" tone="secondary">Ultima azione: {last}</Text>
    </Stack>
  );
}
