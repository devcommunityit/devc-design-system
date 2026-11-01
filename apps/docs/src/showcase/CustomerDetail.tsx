import { Mail, Pencil, Trash2 } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import {
  AlertDialog,
  Avatar,
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Card,
  CardBody,
  DescriptionList,
  Drawer,
  EmptyState,
  Form,
  Grid,
  Heading,
  Inline,
  LinkButton,
  Select,
  ListBoxItem,
  Stack,
  Statistic,
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
  Textarea,
  Timeline,
  TimelineItem,
  useToast,
} from '@devcommunityit/ui';
import {
  actions,
  customerStatusLabel,
  customerStatusTone,
  euro,
  formatDay,
  orderStatusLabel,
  orderStatusTone,
  simulateLatency,
  useShowcaseData,
  type Customer,
  type Plan,
} from './data';

const plans: Plan[] = ['Base', 'Professional', 'Enterprise'];

function EditDrawer({ customer, isOpen, onOpenChange }: { customer: Customer; isOpen: boolean; onOpenChange: (open: boolean) => void }) {
  const toast = useToast();
  const [saving, setSaving] = useState(false);
  const [plan, setPlan] = useState<Plan>(customer.plan);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const text = (name: string) => String(data.get(name) ?? '').trim();
    setSaving(true);
    void simulateLatency().then(() => {
      actions.updateCustomer(customer.id, {
        contact: text('contact'),
        email: text('email'),
        phone: text('phone') || null,
        plan,
        notes: text('notes') || null,
      });
      setSaving(false);
      onOpenChange(false);
      toast.show({ title: 'Cliente aggiornato', description: 'Modifica salvata in memoria (simulazione).', tone: 'success' });
    });
  };

  return (
    <Drawer title={`Modifica ${customer.name}`} description="Le modifiche restano in memoria fino al ricaricamento." isOpen={isOpen} onOpenChange={onOpenChange}>
      <Form onSubmit={onSubmit} id="edit-customer">
        <Stack gap={4}>
          <TextField name="contact" label="Referente" defaultValue={customer.contact} isRequired />
          <TextField name="email" type="email" label="Email" defaultValue={customer.email} isRequired />
          <TextField name="phone" type="tel" label="Telefono" description="Facoltativo" defaultValue={customer.phone ?? ''} />
          <Select label="Piano" selectedKey={plan} onSelectionChange={(key) => setPlan(plans.find((p) => p === key) ?? plan)}>
            {plans.map((p) => (
              <ListBoxItem key={p} id={p}>
                {p}
              </ListBoxItem>
            ))}
          </Select>
          <Textarea name="notes" label="Note interne" defaultValue={customer.notes ?? ''} rows={4} />
          <Inline gap={2} justify="end">
            <Button variant="ghost" onPress={() => onOpenChange(false)}>
              Annulla
            </Button>
            <Button type="submit" isPending={saving}>
              Salva
            </Button>
          </Inline>
        </Stack>
      </Form>
    </Drawer>
  );
}

export function CustomerDetail() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { customers, orders } = useShowcaseData();
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const id = params.get('id') ?? customers[0]?.id;
  const customer = customers.find((c) => c.id === id);

  if (!customer) {
    return (
      <EmptyState
        headingLevel={1}
        title="Cliente non trovato"
        description={`Nessun cliente con codice “${id ?? ''}”: potrebbe essere stato eliminato in questa sessione.`}
        actions={<LinkButton href="/showcase/elenco">Torna ai clienti</LinkButton>}
      />
    );
  }

  const customerOrders = orders.filter((o) => o.customerId === customer.id).sort((a, b) => b.date.localeCompare(a.date));
  const total = customerOrders.filter((o) => o.status !== 'annullato').reduce((s, o) => s + o.total, 0);

  return (
    <Stack gap={5}>
      <Breadcrumb>
        <BreadcrumbItem href="/showcase/dashboard">Dashboard</BreadcrumbItem>
        <BreadcrumbItem href="/showcase/elenco">Clienti</BreadcrumbItem>
        <BreadcrumbItem>{customer.name}</BreadcrumbItem>
      </Breadcrumb>

      <Inline justify="between" align="center" gap={4}>
        <Inline gap={4} align="center" wrap={false} className="sc-min0">
          <Avatar name={customer.name} size="lg" shape="square" isDecorative />
          <Stack gap={1} className="sc-min0">
            <Heading level={1} size="headline-sm" className="sc-break">
              {customer.name}
            </Heading>
            <Inline gap={2} align="center">
              <Badge tone={customerStatusTone[customer.status]}>{customerStatusLabel[customer.status]}</Badge>
              <Text variant="body-sm" tone="secondary">
                {customer.id} · piano {customer.plan}
              </Text>
            </Inline>
          </Stack>
        </Inline>
        <Inline gap={2}>
          <LinkButton href={`mailto:${customer.email}`} variant="outline" startIcon={<Mail />}>
            Scrivi
          </LinkButton>
          <Button variant="secondary" startIcon={<Pencil />} onPress={() => setEditing(true)}>
            Modifica
          </Button>
          <Button variant="danger" startIcon={<Trash2 />} onPress={() => setConfirmDelete(true)}>
            Elimina
          </Button>
        </Inline>
      </Inline>

      <Grid columns={{ base: 1, sm: 3 }} gap={4}>
        <Card variant="outlined">
          <Statistic label="Ordini" value={customerOrders.length} size="sm" />
        </Card>
        <Card variant="outlined">
          <Statistic label="Valore ordini (esclusi annullati)" value={total} formatOptions={{ style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }} size="sm" />
        </Card>
        <Card variant="outlined">
          <Statistic label="Ultimo ordine" value={customerOrders[0] ? formatDay(customerOrders[0].date) : null} emptyValue="Nessuno" size="sm" />
        </Card>
      </Grid>

      <Tabs>
        <TabList aria-label="Sezioni del cliente">
          <Tab id="overview">Panoramica</Tab>
          <Tab id="orders" badge={<Badge size="sm">{customerOrders.length}</Badge>}>
            Ordini
          </Tab>
          <Tab id="activity">Attività</Tab>
        </TabList>
        <TabPanel id="overview">
          <Card variant="outlined">
            <CardBody>
              <DescriptionList
                layout="grid"
                dividers
                emptyValue="—"
                items={[
                  { id: 'contact', term: 'Referente', description: customer.contact },
                  { id: 'email', term: 'Email', description: customer.email },
                  { id: 'phone', term: 'Telefono', description: customer.phone },
                  { id: 'city', term: 'Sede', description: `${customer.city} (${customer.region})` },
                  { id: 'since', term: 'Cliente dal', description: formatDay(customer.since) },
                  { id: 'notes', term: 'Note interne', description: customer.notes },
                ]}
              />
            </CardBody>
          </Card>
        </TabPanel>
        <TabPanel id="orders">
          {customerOrders.length === 0 ? (
            <EmptyState size="sm" title="Nessun ordine" description="Questo cliente non ha ancora effettuato ordini." />
          ) : (
            <Table scrollRegionLabel={`Ordini di ${customer.name}`}>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Ordine</TableHeaderCell>
                  <TableHeaderCell>Data</TableHeaderCell>
                  <TableHeaderCell align="end">Articoli</TableHeaderCell>
                  <TableHeaderCell>Stato</TableHeaderCell>
                  <TableHeaderCell align="end">Totale</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {customerOrders.map((o) => (
                  <TableRow key={o.id}>
                    <TableHeaderCell scope="row">{o.id}</TableHeaderCell>
                    <TableCell>{formatDay(o.date)}</TableCell>
                    <TableCell numeric>{o.items}</TableCell>
                    <TableCell>
                      <Badge tone={orderStatusTone[o.status]}>{orderStatusLabel[o.status]}</Badge>
                    </TableCell>
                    <TableCell numeric>{euro.format(o.total)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TabPanel>
        <TabPanel id="activity">
          <Timeline>
            {customerOrders.slice(0, 4).map((o) => (
              <TimelineItem key={o.id} title={`Ordine ${o.id} — ${orderStatusLabel[o.status].toLowerCase()}`} time={formatDay(o.date)} dateTime={o.date} tone={orderStatusTone[o.status]}>
                {o.items} articoli · {euro.format(o.total)}
              </TimelineItem>
            ))}
            <TimelineItem title="Cliente acquisito" time={formatDay(customer.since)} dateTime={customer.since}>
              Piano iniziale {customer.plan}
            </TimelineItem>
          </Timeline>
        </TabPanel>
      </Tabs>

      <EditDrawer key={`${customer.id}-${String(editing)}`} customer={customer} isOpen={editing} onOpenChange={setEditing} />
      <AlertDialog
        isOpen={confirmDelete}
        onOpenChange={setConfirmDelete}
        tone="danger"
        title={`Eliminare ${customer.name}?`}
        confirmLabel="Elimina cliente"
        cancelLabel="Annulla"
        onConfirm={() => {
          actions.removeCustomers([customer.id]);
          setConfirmDelete(false);
          toast.show({ title: `${customer.name} eliminato`, description: 'Solo nei dati dimostrativi di questa sessione.', tone: 'success' });
          void navigate('/showcase/elenco');
        }}
      >
        Il cliente e i suoi {customerOrders.length} ordini verranno rimossi dai dati dimostrativi.
      </AlertDialog>
    </Stack>
  );
}
