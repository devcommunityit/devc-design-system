import { ClipboardList, Euro, FileText, Settings, ShoppingCart, Sparkles, UserPlus, Users } from 'lucide-react';
import { useMemo, useState, type MouseEvent } from 'react';
import {
  BarChart,
  Card,
  CardBody,
  DonutChart,
  Grid,
  HeroCard,
  Heading,
  KpiCard,
  LineChart,
  LinkButton,
  NavList,
  PromoBanner,
  QuickAction,
  Stack,
  Text,
  Toggle,
  ToggleGroup,
  type ChartSeries,
  type NavListItem,
  type Selection,
} from '@dev-community/ui';
import { orderStatusLabel, useShowcaseData, type OrderStatus, type Plan, type Region } from './data';

const MONTHS = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];
const QUARTERS = ['T1', 'T2', 'T3', 'T4'];
const REGIONS: Region[] = ['Nord', 'Centro', 'Sud e isole'];
const PLANS: Plan[] = ['Base', 'Professional', 'Enterprise'];
const STATUSES: OrderStatus[] = ['da-spedire', 'spedito', 'consegnato', 'annullato'];
// Deterministic monthly revenue target used only for the demo comparison.
const MONTHLY_TARGET = 40000;

const sections: NavListItem[] = [
  { id: 'panoramica', label: 'Panoramica', href: '#panoramica' },
  { id: 'andamento', label: 'Andamento', href: '#andamento' },
  { id: 'composizione', label: 'Composizione', href: '#composizione' },
  { id: 'azioni', label: 'Azioni rapide', href: '#azioni' },
];

const euroCompact: Intl.NumberFormatOptions = { style: 'currency', currency: 'EUR', notation: 'compact', maximumFractionDigits: 1 };
const euroFull: Intl.NumberFormatOptions = { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 };

function monthOf(iso: string): number {
  return Number(iso.slice(5, 7)) - 1;
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
    const lastQ = revenue.slice(9).reduce((s, v) => s + v, 0);
    const prevQ = revenue.slice(6, 9).reduce((s, v) => s + v, 0);
    return {
      revenue,
      ordersPerMonth,
      byRegion,
      byStatus,
      byPlan,
      total,
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
              label="Ricavi 2025"
              value={data.total}
              formatOptions={euroFull}
              icon={<Euro />}
              trend={{ direction: data.quarterChange > 0 ? 'up' : data.quarterChange < 0 ? 'down' : 'neutral', value: pct.format(data.quarterChange), label: 'T4 rispetto a T3' }}
              sparkline={data.revenue}
            />
            <KpiCard
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
                <DonutChart title="Clienti per piano" data={data.byPlan} centerLabel="Clienti" />
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <BarChart title="Ordini per stato" description="Numero di ordini nel 2025." orientation="horizontal" categories={data.byStatus.map((s) => s.label)} series={[{ id: 'ordini', label: 'Ordini', data: data.byStatus.map((s) => s.value) }]} showLegend={false} />
              </CardBody>
            </Card>
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
