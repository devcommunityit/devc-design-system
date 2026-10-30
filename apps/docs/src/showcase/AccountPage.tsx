import { LogOut, Monitor, Smartphone } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import {
  AlertDialog,
  Avatar,
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  DescriptionList,
  Form,
  Grid,
  Heading,
  Inline,
  PasswordInput,
  Progress,
  Stack,
  Tab,
  TabList,
  TabPanel,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Tabs,
  Text,
  TextField,
  useToast,
} from '@dev-community/ui';
import { euro, formatDay, simulateLatency } from './data';

interface Session {
  id: string;
  device: string;
  kind: 'desktop' | 'mobile';
  place: string;
  lastSeen: string;
  current?: boolean;
}

const initialSessions: Session[] = [
  { id: 's1', device: 'Firefox su Windows', kind: 'desktop', place: 'Milano, IT', lastSeen: 'Attiva ora', current: true },
  { id: 's2', device: 'Safari su iPhone', kind: 'mobile', place: 'Milano, IT', lastSeen: 'Ieri, 21:14' },
  { id: 's3', device: 'Chrome su macOS', kind: 'desktop', place: 'Bologna, IT', lastSeen: '3 dic 2025' },
];

const invoices = [
  { id: 'FT-2025-0112', date: '2025-12-01', amount: 49, status: 'Da pagare' as const },
  { id: 'FT-2025-0098', date: '2025-11-01', amount: 49, status: 'Pagata' as const },
  { id: 'FT-2025-0085', date: '2025-10-01', amount: 49, status: 'Pagata' as const },
];

/** Rough, local indication only: real strength rules belong to the server. */
function passwordScore(value: string): number {
  let score = 0;
  if (value.length >= 12) score += 1;
  if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score += 1;
  if (/\d/.test(value)) score += 1;
  if (/[^A-Za-z0-9]/.test(value)) score += 1;
  return score;
}

function ProfileTab() {
  const toast = useToast();
  const [profile, setProfile] = useState({ name: 'Giulia Bianchi', email: 'giulia.bianchi@northwind.example', role: 'Responsabile commerciale' });
  const [saving, setSaving] = useState(false);
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const next = { name: String(data.get('name') ?? '').trim(), email: String(data.get('email') ?? '').trim(), role: String(data.get('role') ?? '').trim() };
    setSaving(true);
    void simulateLatency().then(() => {
      setProfile(next);
      setSaving(false);
      toast.show({ title: 'Profilo aggiornato', description: 'Salvato solo in memoria (simulazione).', tone: 'success' });
    });
  };
  return (
    <Grid columns={{ base: 1, lg: 3 }} gap={4}>
      <Card variant="outlined">
        <CardBody>
          <Stack gap={3} align="center" className="sc-center">
            <Avatar name={profile.name} size="xl" />
            <Stack gap={1}>
              <Text weight="semibold">{profile.name}</Text>
              <Text variant="body-sm" tone="secondary" className="sc-break">
                {profile.email}
              </Text>
            </Stack>
            <Badge tone="brand">Piano Professional</Badge>
          </Stack>
        </CardBody>
      </Card>
      <Card variant="outlined" className="sc-span-2">
        <CardHeader headingLevel={2} title="Dati personali" />
        <CardBody>
          <Form onSubmit={onSubmit}>
            <Stack gap={4}>
              <TextField name="name" label="Nome e cognome" defaultValue={profile.name} isRequired autoComplete="name" />
              <TextField name="email" type="email" label="Email" defaultValue={profile.email} isRequired autoComplete="email" />
              <TextField name="role" label="Ruolo" defaultValue={profile.role} />
              <Inline justify="end">
                <Button type="submit" isPending={saving}>
                  Salva profilo
                </Button>
              </Inline>
            </Stack>
          </Form>
        </CardBody>
      </Card>
    </Grid>
  );
}

function SecurityTab() {
  const toast = useToast();
  const [sessions, setSessions] = useState(initialSessions);
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [current, setCurrent] = useState('');
  const [saving, setSaving] = useState(false);
  const score = passwordScore(next);
  const mismatch = confirm.length > 0 && confirm !== next;

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!current || score < 3 || mismatch || !confirm) return;
    setSaving(true);
    void simulateLatency().then(() => {
      setSaving(false);
      setCurrent('');
      setNext('');
      setConfirm('');
      toast.show({ title: 'Simulazione completata', description: 'Nessuna password è stata modificata: il cambio password spetta al tuo backend.', tone: 'info' });
    });
  };

  return (
    <Stack gap={4}>
      <Card variant="outlined">
        <CardHeader headingLevel={2} title="Cambia password" subtitle="Dimostrativo: nessuna credenziale viene verificata o salvata." />
        <CardBody>
          <Form onSubmit={onSubmit} className="sc-form-narrow">
            <Stack gap={4}>
              <PasswordInput label="Password attuale" value={current} onChange={setCurrent} isRequired autoComplete="current-password" />
              <PasswordInput
                label="Nuova password"
                description="Almeno 12 caratteri con maiuscole, minuscole, numeri o simboli."
                value={next}
                onChange={setNext}
                isRequired
                autoComplete="new-password"
                isInvalid={next.length > 0 && score < 3}
                errorMessage="La password è troppo debole."
              />
              <Progress
                label="Robustezza indicativa"
                value={score * 25}
                valueLabel={['Molto debole', 'Debole', 'Discreta', 'Buona', 'Ottima'][score]}
                showValue
                tone={score < 2 ? 'danger' : score < 3 ? 'warning' : 'success'}
                size="sm"
              />
              <PasswordInput
                label="Conferma nuova password"
                value={confirm}
                onChange={setConfirm}
                isRequired
                autoComplete="new-password"
                isInvalid={mismatch}
                errorMessage="Le password non coincidono."
              />
              <Inline justify="end">
                <Button type="submit" isPending={saving} isDisabled={!current || score < 3 || !confirm || mismatch}>
                  Aggiorna password
                </Button>
              </Inline>
            </Stack>
          </Form>
        </CardBody>
      </Card>

      <Card variant="outlined">
        <CardHeader headingLevel={2} title="Sessioni attive" subtitle="Elenco dimostrativo." />
        <CardBody>
          <Stack as="ul" gap={3} className="sc-plain-list">
            {sessions.map((s) => (
              <li key={s.id} className="sc-session">
                <Inline gap={3} align="center" wrap={false} className="sc-min0">
                  {s.kind === 'desktop' ? <Monitor aria-hidden="true" /> : <Smartphone aria-hidden="true" />}
                  <Stack gap={0} className="sc-min0">
                    <Text weight="medium">
                      {s.device} {s.current ? <Badge tone="success" size="sm">Questo dispositivo</Badge> : null}
                    </Text>
                    <Text variant="body-sm" tone="secondary">
                      {s.place} · {s.lastSeen}
                    </Text>
                  </Stack>
                </Inline>
                {s.current ? null : (
                  <Button
                    size="sm"
                    variant="outline"
                    startIcon={<LogOut />}
                    aria-label={`Disconnetti ${s.device}`}
                    onPress={() => {
                      setSessions((list) => list.filter((x) => x.id !== s.id));
                      toast.show({ title: `${s.device} disconnesso`, description: 'Simulazione locale.', tone: 'success' });
                    }}
                  >
                    Disconnetti
                  </Button>
                )}
              </li>
            ))}
          </Stack>
        </CardBody>
      </Card>
    </Stack>
  );
}

function BillingTab() {
  return (
    <Stack gap={4}>
      <Card variant="outlined">
        <CardHeader headingLevel={2} title="Piano attuale" />
        <CardBody>
          <DescriptionList
            layout="grid"
            items={[
              { id: 'plan', term: 'Piano', description: 'Professional, mensile' },
              { id: 'price', term: 'Importo', description: `${euro.format(49)} + IVA al mese` },
              { id: 'renewal', term: 'Prossimo rinnovo', description: formatDay('2026-01-01') },
              { id: 'method', term: 'Metodo di pagamento', description: 'Bonifico SEPA (dato dimostrativo)' },
            ]}
          />
        </CardBody>
      </Card>
      <Table scrollRegionLabel="Fatture">
        <TableHead>
          <TableRow>
            <TableHeaderCell>Fattura</TableHeaderCell>
            <TableHeaderCell>Data</TableHeaderCell>
            <TableHeaderCell>Stato</TableHeaderCell>
            <TableHeaderCell align="end">Importo</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {invoices.map((i) => (
            <TableRow key={i.id}>
              <TableHeaderCell scope="row">{i.id}</TableHeaderCell>
              <TableCell>{formatDay(i.date)}</TableCell>
              <TableCell>
                <Badge tone={i.status === 'Pagata' ? 'success' : 'warning'}>{i.status}</Badge>
              </TableCell>
              <TableCell numeric>{euro.format(i.amount)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Stack>
  );
}

export function AccountPage() {
  const toast = useToast();
  const [confirmDelete, setConfirmDelete] = useState(false);
  return (
    <Stack gap={5}>
      <Heading level={1} size="headline-md">
        Account
      </Heading>
      <Tabs>
        <TabList aria-label="Sezioni dell’account">
          <Tab id="profile">Profilo</Tab>
          <Tab id="security">Sicurezza</Tab>
          <Tab id="billing">Fatturazione</Tab>
        </TabList>
        <TabPanel id="profile">
          <ProfileTab />
        </TabPanel>
        <TabPanel id="security">
          <SecurityTab />
        </TabPanel>
        <TabPanel id="billing">
          <BillingTab />
        </TabPanel>
      </Tabs>
      <Card variant="outlined" className="sc-danger-zone">
        <CardHeader headingLevel={2} title="Elimina account" subtitle="Operazione irreversibile in un portale reale." />
        <CardBody>
          <Button variant="danger" onPress={() => setConfirmDelete(true)}>
            Elimina account…
          </Button>
        </CardBody>
      </Card>
      <AlertDialog
        isOpen={confirmDelete}
        onOpenChange={setConfirmDelete}
        tone="danger"
        title="Eliminare l’account?"
        confirmLabel="Elimina"
        cancelLabel="Annulla"
        onConfirm={() => {
          setConfirmDelete(false);
          toast.show({ title: 'Simulazione: nessun account eliminato', description: 'In produzione questa azione va confermata e gestita dal server.', tone: 'info' });
        }}
      >
        Tutti i dati associati verrebbero eliminati. In questo template non viene eliminato nulla.
      </AlertDialog>
    </Stack>
  );
}
