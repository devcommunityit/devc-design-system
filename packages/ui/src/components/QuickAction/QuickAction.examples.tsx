import { Database, FileDown, KeyRound, Settings, UserPlus, Users } from 'lucide-react';
import { useState } from 'react';
import { Badge, Grid, QuickAction, Stack } from '@devcommunityit/ui';

export function Basic() {
  return (
    <div style={{ maxInlineSize: 240 }}>
      <QuickAction href="#utenti" icon={<Users />} label="Utenti" description="Gestisci accessi e ruoli" />
    </div>
  );
}

export function AdminGrid() {
  return (
    <Grid as="ul" minItemWidth="12rem" gap={3} style={{ listStyle: 'none', margin: 0, padding: 0 }}>
      <li>
        <QuickAction href="#invita" icon={<UserPlus />} label="Invita utente" description="Via email o link" />
      </li>
      <li>
        <QuickAction href="#chiavi" icon={<KeyRound />} label="API keys" description="Create and rotate keys" badge={<Badge tone="warning">2 in scadenza</Badge>} />
      </li>
      <li>
        <QuickAction href="#database" icon={<Database />} label="Database" description="Backup e ripristino" />
      </li>
      <li>
        <QuickAction href="#impostazioni" icon={<Settings />} label="Impostazioni" description="Workspace e fatturazione" />
      </li>
    </Grid>
  );
}

export function Horizontal() {
  return (
    <Stack gap={2} style={{ maxInlineSize: 360 }}>
      <QuickAction layout="horizontal" href="#utenti" icon={<Users />} label="Utenti" description="128 attivi" />
      <QuickAction layout="horizontal" href="#impostazioni" icon={<Settings />} label="Impostazioni" />
    </Stack>
  );
}

/** Button tiles run an action in place; here an export simulated with a timer. */
export function AsButton() {
  const [status, setStatus] = useState<'idle' | 'running' | 'done'>('idle');
  return (
    <Stack gap={2} style={{ maxInlineSize: 280 }}>
      <QuickAction
        icon={<FileDown />}
        label="Esporta utenti (CSV)"
        description={status === 'running' ? 'Esportazione in corso…' : 'Scarica l’elenco completo'}
        isDisabled={status === 'running'}
        onPress={() => {
          setStatus('running');
          window.setTimeout(() => setStatus('done'), 1200);
        }}
      />
      <p aria-live="polite">{status === 'done' ? 'Esportazione completata.' : ''}</p>
    </Stack>
  );
}

export function Disabled() {
  return (
    <div style={{ maxInlineSize: 240 }}>
      <QuickAction icon={<Database />} label="Ripristina backup" description="Nessun backup disponibile" isDisabled onPress={() => {}} />
    </div>
  );
}
