import { ClipboardList, Euro, FileText, Settings, ShoppingCart, Sparkles, UserPlus, Users } from 'lucide-react';
import { useMemo, useState, type MouseEvent } from 'react';
import {
  ActivityCard,
  BarChart,
  Card,
  CardBody,
  ComparisonCard,
  DonutChart,
  FunnelChart,
  GaugeChart,
  GoalCard,
  Grid,
  HeatmapChart,
  HeroCard,
  Heading,
  KpiCard,
  LineChart,
  LinkButton,
  NavList,
  PromoBanner,
  QuickAction,
  RadarChart,
  RadialBarChart,
  RankingCard,
  ScatterChart,
  Stack,
  Text,
  Toggle,
  ToggleGroup,
  type ChartSeries,
  type NavListItem,
  type Selection,
} from '@devcommunityit/ui';
import { formatDay, orderStatusLabel, orderStatusTone, useShowcaseData, type OrderStatus, type Plan, type Region } from './data';

const MONTHS = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];
const QUARTERS = ['T1', 'T2', 'T3', 'T4'];
const REGIONS: Region[] = ['Nord', 'Centro', 'Sud e isole'];
const PLANS: Plan[] = ['Base', 'Professional', 'Enterprise'];
const STATUSES: OrderStatus[] = ['da-spedire', 'spedito', 'consegnato', 'annullato'];
const BIMESTERS = ['Gen–Feb', 'Mar–Apr', 'Mag–Giu', 'Lug–Ago', 'Set–Ott', 'Nov–Dic'];
const WEEKDAYS = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];
// Deterministic monthly revenue target used only for the demo comparison.
const MONTHLY_TARGET = 40000;

const sections: NavListItem[] = [
  { id: 'panoramica', label: 'Panoramica', href: '#panoramica' },
  { id: 'andamento', label: 'Andamento', href: '#andamento' },
  { id: 'composizione', label: 'Composizione', href: '#composizione' },
  { id: 'analisi', label: 'Analisi', href: '#analisi' },
  { id: 'obiettivi', label: 'Obiettivi e attività', href: '#obiettivi' },
  { id: 'azioni', label: 'Azioni rapide', href: '#azioni' },
];

const euroCompact: Intl.NumberFormatOptions = { style: 'currency', currency: 'EUR', notation: 'compact', maximumFractionDigits: 1 };
const euroFull: Intl.NumberFormatOptions = { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 };
const euroFormatter = new Intl.NumberFormat('it-IT', euroFull);

function monthOf(iso: string): number {
  return Number(iso.slice(5, 7)) - 1;
}

/** Monday-first weekday index of an ISO calendar date. */
function weekdayOf(iso: string): number {
  return (new Date(`${iso}T00:00:00Z`).getUTCDay() + 6) % 7;
}

export function AdminDashboard() {
  const { orders, customers } = useShowcaseData();
  const [currentSection, setCurrentSection] = useState('panoramica');
  const [promoVisible, setPromoVisible] = useState(true);
  const [layout, setLayout] = useState<Selection>(new Set(['stacked']));
  const stacked = layout === 'all' || layout.has('stacked');

  const data = useMemo(() => {
    const valid = orders.filter((o) => o.status !== 'annullato');
    const regionOf = new Map(customers.map((c) => [c.id, c.region]));
    const revenue = MONTHS.map((_, m) => valid.filter((o) => monthOf(o.date) === m).reduce((s, o) => s + o.total, 0));
    const ordersPerMonth = MONTHS.map((_, m) => orders.filter((o) => monthOf(o.date) === m).length);
    const byRegion: ChartSeries[] = REGIONS.map((region) => ({
      id: region,
      label: region,
      data: QUARTERS.map((_, q) =>
        valid.filter((o) => Math.floor(monthOf(o.date) / 3) === q && regionOf.get(o.customerId) === region).reduce((s, o) => s + o.total, 0),
      ),
    }));
    const byStatus = STATUSES.map((status) => ({ id: status, label: orderStatusLabel[status], value: orders.filter((o) => o.status === status).length }));
    const byPlan = PLANS.map((plan) => ({ id: plan, label: plan, value: customers.filter((c) => c.plan === plan).length }));
    const total = revenue.reduce((s, v) => s + v, 0);
    const quarterRevenue = QUARTERS.map((_, q) => revenue.slice(q * 3, q * 3 + 3).reduce((s, v) => s + v, 0));
    const byBimester: ChartSeries[] = REGIONS.map((region) => ({
      id: region,
      label: region,
      data: BIMESTERS.map((_, b) =>
        valid.filter((o) => Math.floor(monthOf(o.date) / 2) === b && regionOf.get(o.customerId) === region).reduce((s, o) => s + o.total, 0),
      ),
    }));
    const heatmap = WEEKDAYS.map((_, d) => MONTHS.map((_, m) => valid.filter((o) => weekdayOf(o.date) === d && monthOf(o.date) === m).reduce((s, o) => s + o.total, 0)));
    const shippedOrDelivered = orders.filter((o) => o.status === 'spedito' || o.status === 'consegnato').length;
    const delivered = orders.filter((o) => o.status === 'consegnato').length;
    const funnel = [
      { id: 'ricevuti', label: 'Ricevuti', value: orders.length },
      { id: 'confermati', label: 'Confermati', value: valid.length },
      { id: 'spediti', label: 'Spediti', value: shippedOrDelivered },
      { id: 'consegnati', label: 'Consegnati', value: delivered },
    ];
    const perCustomer = customers.map((c) => {
      const own = valid.filter((o) => o.customerId === c.id);
      return { customer: c, orders: own.length, items: own.reduce((s, o) => s + o.items, 0), revenue: own.reduce((s, o) => s + o.total, 0) };
    });
    const scatter = PLANS.map((plan) => ({
      id: plan,
      label: plan,
      points: perCustomer.filter((p) => p.customer.plan === plan && p.orders > 0).map((p) => ({ x: p.items, y: p.revenue, label: p.customer.name, size: p.orders })),
    }));
    const topCustomers = [...perCustomer]
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)
      .map((p) => ({ id: p.customer.id, label: p.customer.name, value: p.revenue, description: `${p.customer.city} · ${p.customer.plan}` }));
    const nameOf = new Map(customers.map((c) => [c.id, c.name]));
    const recent = [...orders]
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 5)
      .map((o) => ({
        id: o.id,
        actor: nameOf.get(o.customerId) ?? o.customerId,
        action: `ordine ${o.id} da ${euroFormatter.format(o.total)} · ${orderStatusLabel[o.status].toLowerCase()}`,
        time: formatDay(o.date),
        dateTime: o.date,
        tone: orderStatusTone[o.status],
      }));
    const lastQ = revenue.slice(9).reduce((s, v) => s + v, 0);
    const prevQ = revenue.slice(6, 9).reduce((s, v) => s + v, 0);
    return {
      revenue,
      ordersPerMonth,
      byRegion,
      byStatus,
      byPlan,
      total,
      quarterRevenue,
      byBimester,
      heatmap,
      funnel,
      scatter,
      topCustomers,
      recent,
      delivered,
      quarterChange: prevQ === 0 ? 0 : (lastQ - prevQ) / prevQ,
      active: customers.filter((c) => c.status === 'attivo').length,
      trials: customers.filter((c) => c.status === 'in-prova').length,
      toShip: orders.filter((o) => o.status === 'da-spedire').length,
    };
  }, [orders, customers]);

  const pct = new Intl.NumberFormat('it-IT', { style: 'percent', signDisplay: 'exceptZero', maximumFractionDigits: 1 });
  const lastOrders = data.ordersPerMonth[11] ?? 0;
  const prevOrders = data.ordersPerMonth[10] ?? 0;
  const ordersDelta = lastOrders - prevOrders;

  const goToSection = (id: string, event: MouseEvent<Element>) => {
    event.preventDefault();
    setCurrentSection(id);
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ block: 'start' });
      target.focus({ preventScroll: true });
    }
  };

  return (
    <Stack gap={6}>
      <HeroCard
        variant="brand"
        icon={<Sparkles />}
        eyebrow="Pannello di amministrazione · dati dimostrativi 2025"
        title="Bentornata, Giulia"
        headingLevel={1}
        description={`Ci sono ${data.toShip} ordini da spedire e ${data.trials} clienti in prova da seguire.`}
        actions={
          <>
            <LinkButton href="/showcase/elenco" variant="secondary">
              Apri clienti
            </LinkButton>
            <LinkButton href="/showcase/modulo" variant="secondary">
              Nuova richiesta
            </LinkButton>
          </>
        }
      />

      <NavList label="Sezioni della dashboard" orientation="horizontal" variant="underline" items={sections} currentId={currentSection} onNavigate={goToSection} />

      {promoVisible && (
        <PromoBanner
          tone="accent"
          href="/showcase/impostazioni"
          icon={<Settings />}
          title="Completa la configurazione del workspace"
          description="Imposta notifiche e preferenze di lingua per tutto il team."
          onDismiss={() => setPromoVisible(false)}
        />
      )}

      <section id="panoramica" tabIndex={-1} aria-labelledby="admin-overview" className="sc-admin-section">
        <Stack gap={3}>
          <Heading level={2} size="title-lg" id="admin-overview">
            Panoramica
          </Heading>
          <Grid minItemWidth="15rem" gap={4}>
            <KpiCard
              variant="vivid"
              label="Ricavi 2025"
              value={data.total}
              formatOptions={euroFull}
              icon={<Euro />}
              trend={{ direction: data.quarterChange > 0 ? 'up' : data.quarterChange < 0 ? 'down' : 'neutral', value: pct.format(data.quarterChange), label: 'T4 rispetto a T3' }}
              sparkline={data.revenue}
            />
            <KpiCard
              variant="tinted"
              label="Ordini a dicembre"
              value={lastOrders}
              icon={<ShoppingCart />}
              trend={{ direction: ordersDelta > 0 ? 'up' : ordersDelta < 0 ? 'down' : 'neutral', value: `${ordersDelta > 0 ? '+' : ''}${ordersDelta}`, label: 'rispetto a novembre' }}
              sparkline={data.ordersPerMonth}
            />
            <KpiCard label="Clienti attivi" value={data.active} icon={<Users />} description={`${data.trials} in prova`} />
            <KpiCard label="Ordini da spedire" value={data.toShip} icon={<ClipboardList />} description="Su tutto l'anno" />
          </Grid>
        </Stack>
      </section>

      <section id="andamento" tabIndex={-1} aria-labelledby="admin-trend" className="sc-admin-section">
        <Stack gap={3}>
          <Heading level={2} size="title-lg" id="admin-trend">
            Andamento
          </Heading>
          <Card>
            <CardBody>
              <LineChart
                appearance="vivid"
                title="Ricavi mensili e obiettivo"
                description="Ordini non annullati, in euro. L'obiettivo è un valore fisso dimostrativo."
                variant="area"
                categories={MONTHS}
                series={[
                  { id: 'ricavi', label: 'Ricavi', data: data.revenue },
                  { id: 'obiettivo', label: 'Obiettivo', data: MONTHS.map(() => MONTHLY_TARGET) },
                ]}
                formatOptions={euroCompact}
              />
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <Stack gap={3}>
                <ToggleGroup aria-label="Disposizione delle barre" selectionMode="single" disallowEmptySelection selectedKeys={layout} onSelectionChange={setLayout}>
                  <Toggle id="stacked">Impilate</Toggle>
                  <Toggle id="grouped">Affiancate</Toggle>
                </ToggleGroup>
                <BarChart
                  appearance="vivid"
                  title="Ricavi per area geografica"
                  description="Totale trimestrale per area del cliente."
                  categories={QUARTERS}
                  series={data.byRegion}
                  layout={stacked ? 'stacked' : 'grouped'}
                  formatOptions={euroCompact}
                />
              </Stack>
            </CardBody>
          </Card>
        </Stack>
      </section>

      <section id="composizione" tabIndex={-1} aria-labelledby="admin-mix" className="sc-admin-section">
        <Stack gap={3}>
          <Heading level={2} size="title-lg" id="admin-mix">
            Composizione
          </Heading>
          <Grid minItemWidth="18rem" gap={4}>
            <Card>
              <CardBody>
                <DonutChart appearance="vivid" title="Clienti per piano" data={data.byPlan} centerLabel="Clienti" />
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <BarChart appearance="vivid" title="Ordini per stato" description="Numero di ordini nel 2025." orientation="horizontal" categories={data.byStatus.map((s) => s.label)} series={[{ id: 'ordini', label: 'Ordini', data: data.byStatus.map((s) => s.value) }]} showLegend={false} />
              </CardBody>
            </Card>
          </Grid>
        </Stack>
      </section>

      <section id="analisi" tabIndex={-1} aria-labelledby="admin-analysis" className="sc-admin-section">
        <Stack gap={3}>
          <Heading level={2} size="title-lg" id="admin-analysis">
            Analisi
          </Heading>
          <Grid minItemWidth="18rem" gap={4}>
            <Card>
              <CardBody>
                <GaugeChart
                  appearance="vivid"
                  title="Ricavi rispetto all'obiettivo annuale"
                  description="Obiettivo dimostrativo: 12 mesi × obiettivo mensile."
                  value={data.total}
                  max={MONTHLY_TARGET * 12 * 1.2}
                  target={MONTHLY_TARGET * 12}
                  bands={[
                    { to: MONTHLY_TARGET * 12 * 0.6, tone: 'danger' },
                    { to: MONTHLY_TARGET * 12 * 0.9, tone: 'warning' },
                    { to: MONTHLY_TARGET * 12 * 1.2, tone: 'success' },
                  ]}
                  label="Ricavi 2025"
                  formatOptions={euroCompact}
                />
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <RadialBarChart
                  appearance="vivid"
                  title="Obiettivi trimestrali"
                  description="Ricavi per trimestre rispetto all'obiettivo."
                  data={QUARTERS.map((q, i) => ({ id: q, label: q, value: data.quarterRevenue[i] ?? 0, max: MONTHLY_TARGET * 3 }))}
                  formatOptions={euroCompact}
                />
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <FunnelChart appearance="vivid" title="Imbuto degli ordini" description="Dalla ricezione alla consegna, 2025." data={data.funnel} />
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <RadarChart appearance="vivid" title="Stagionalità per area" description="Ricavi per bimestre." axes={BIMESTERS} series={data.byBimester} formatOptions={euroCompact} />
              </CardBody>
            </Card>
          </Grid>
          <Card>
            <CardBody>
              <HeatmapChart
                appearance="vivid"
                title="Ricavi per giorno della settimana"
                description="Ricavi degli ordini non annullati per mese e giorno, 2025."
                rows={WEEKDAYS}
                columns={MONTHS}
                values={data.heatmap}
                colorIndex={1}
                formatOptions={euroCompact}
              />
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <ScatterChart
                appearance="vivid"
                title="Clienti: articoli e ricavi"
                description="Ogni bolla è un cliente: articoli acquistati, ricavi e numero di ordini (dimensione)."
                series={data.scatter}
                xLabel="Articoli"
                yLabel="Ricavi"
                yFormatOptions={euroCompact}
              />
            </CardBody>
          </Card>
        </Stack>
      </section>

      <section id="obiettivi" tabIndex={-1} aria-labelledby="admin-goals" className="sc-admin-section">
        <Stack gap={3}>
          <Heading level={2} size="title-lg" id="admin-goals">
            Obiettivi e attività
          </Heading>
          <Grid minItemWidth="18rem" gap={4}>
            <GoalCard label="Ordini consegnati" value={data.delivered} target={orders.length} icon={<ClipboardList />} description="Sul totale degli ordini ricevuti." />
            <ComparisonCard
              label="Ricavi trimestrali"
              current={{ label: 'T4', value: data.quarterRevenue[3] ?? 0 }}
              previous={{ label: 'T3', value: data.quarterRevenue[2] ?? 0 }}
              formatOptions={euroFull}
              description="Ordini non annullati."
            />
            <RankingCard title="Migliori clienti" items={data.topCustomers} formatOptions={euroFull} barStyle="gradient" />
            <ActivityCard title="Ultimi ordini" items={data.recent} />
          </Grid>
        </Stack>
      </section>

      <section id="azioni" tabIndex={-1} aria-labelledby="admin-actions" className="sc-admin-section">
        <Stack gap={3}>
          <Heading level={2} size="title-lg" id="admin-actions">
            Azioni rapide
          </Heading>
          <Text tone="secondary">Collegamenti alle altre pagine del portale dimostrativo.</Text>
          <Grid as="ul" minItemWidth="13rem" gap={3} className="sc-plain-list">
            <li>
              <QuickAction href="/showcase/modulo" icon={<UserPlus />} label="Nuova richiesta" description="Form con validazione" />
            </li>
            <li>
              <QuickAction href="/showcase/elenco" icon={<Users />} label="Clienti" description="Elenco con filtri" />
            </li>
            <li>
              <QuickAction href="/showcase/dettaglio" icon={<FileText />} label="Scheda cliente" description="Pagina di dettaglio" />
            </li>
            <li>
              <QuickAction href="/showcase/impostazioni" icon={<Settings />} label="Impostazioni" description="Preferenze del portale" />
            </li>
          </Grid>
        </Stack>
      </section>
    </Stack>
  );
}
