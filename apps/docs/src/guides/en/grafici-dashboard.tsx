import { BarChart, DonutChart, Grid, KpiCard, Link, LineChart, Stack } from '@devcommunityit/ui';
import { Code, DocSection, RefTable } from '../../components/Doc';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

function LiveDashboard() {
  return (
    <Stack gap={4}>
      <Grid minItemWidth="13rem" gap={3}>
        <KpiCard
          label="Revenue"
          value={48250}
          formatOptions={{ style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }}
          trend={{ direction: 'up', value: '+8.4%' }}
          sparkline={[31, 35, 33, 40, 44, 48]}
          description="Last 30 days"
        />
        <KpiCard label="Orders" value={1284} trend={{ direction: 'up', value: '+3.1%' }} sparkline={[980, 1010, 1100, 1150, 1210, 1284]} />
        <KpiCard
          label="Returns"
          value={0.021}
          formatOptions={{ style: 'percent', maximumFractionDigits: 1 }}
          trend={{ direction: 'down', value: '−0.4 pt', sentiment: 'positive' }}
        />
      </Grid>
      <Grid minItemWidth="18rem" gap={3}>
        <LineChart
          title="Monthly revenue"
          description="Thousands of euros, first half"
          categories={MONTHS}
          series={[
            { id: 'online', label: 'Online', data: [21, 24, 22, 28, 31, 34] },
            { id: 'negozi', label: 'Stores', data: [10, 11, 11, 12, 13, 14] },
          ]}
          variant="area"
        />
        <DonutChart
          title="Orders by channel"
          data={[
            { id: 'web', label: 'Web', value: 642 },
            { id: 'app', label: 'App', value: 418 },
            { id: 'telefono', label: 'Phone', value: 224 },
          ]}
        />
      </Grid>
      <BarChart
        title="Tickets by area"
        orientation="horizontal"
        categories={['Billing', 'Sign-in and credentials', 'Shipping', 'Returns']}
        series={[
          { id: 'aperti', label: 'Open', data: [12, 7, 15, 4] },
          { id: 'chiusi', label: 'Closed', data: [30, 22, 41, 18] },
        ]}
        layout="stacked"
      />
    </Stack>
  );
}

export default function GraficiDashboard() {
  return (
    <>
      <DocSection title="Choosing a chart">
        <RefTable
          label="Which chart to use"
          columns={['Question', 'Component', 'Notes']}
          rows={[
            ['How does it change over time?', 'LineChart (line or area variant)', 'Multiple comparable series; null leaves a gap, not a zero.'],
            ['Which category is largest?', 'Vertical or horizontal BarChart', 'Horizontal for long labels; stacked for parts of a whole.'],
            ['How is a total split?', 'DonutChart', 'Few slices (up to 6): beyond that, use a sorted BarChart.'],
            ['Compact trend next to a number', 'Sparkline or KpiCard with sparkline', 'Decorative: the value and change remain in the text.'],
            ['Single value with change', 'KpiCard / Statistic', 'The direction is announced in words, not just with color and an arrow.'],
          ]}
        />
        <p>
          Charts are dependency-free SVGs sized to their container. They don’t replace an analytics library: no zoom, continuous time
          axes, or smoothed curves (see the limitations on each component page).
        </p>
      </DocSection>

      <DocSection title="Live example">
        <p>A dashboard section built only with library components and deterministic local data. Change the theme or mode from the preferences menu: data colors follow the theme.</p>
        <LiveDashboard />
        <Code>{`import { Grid, KpiCard, LineChart } from '@devcommunityit/ui';

<Grid minItemWidth="13rem" gap={3}>
  <KpiCard
    label="Revenue"
    value={48250}
    formatOptions={{ style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }}
    trend={{ direction: 'up', value: '+8.4%' }}
    sparkline={[31, 35, 33, 40, 44, 48]}
  />
</Grid>

<LineChart
  title="Monthly revenue"
  description="Thousands of euros, first half"
  categories={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']}
  series={[{ id: 'online', label: 'Online', data: [21, 24, 22, 28, 31, 34] }]}
  variant="area"
/>`}</Code>
      </DocSection>

      <DocSection title="Data colors">
        <p>
          Series use the semantic roles <code>data.1</code>…<code>data.6</code> (variables <code>--dc-color-data-1</code>…), defined for every preset in
          light and dark mode and editable in the <Link href="/theme-builder">Theme Builder</Link> (“Data and charts” group). Beyond six series, colors
          repeat: reduce the number of series or group the smaller ones into “Other”.
        </p>
        <Code language="ts">{`import { createTheme } from '@devcommunityit/ui';

export const theme = createTheme({
  name: 'analytics',
  seed: '#3b5bdb',
  light: { 'data.1': '#3b5bdb', 'data.2': '#0f8a6a' },
  dark: { 'data.1': '#9db0ff', 'data.2': '#5fd4b0' },
});`}</Code>
        <p>
          Check the contrast of each series against the surface (at least 3:1 for graphical objects): the Theme Builder indicator flags it, but it
          doesn’t guarantee that similar colors can be told apart.
        </p>
      </DocSection>

      <DocSection title="Chart accessibility">
        <ul>
          <li>Every chart is a <code>figure</code> with a visible title; the “Show data table” button opens an equivalent table with a caption.</li>
          <li>The plot area is a navigable group: arrow keys move the active point and a live region announces the category and values.</li>
          <li>With multiple series, legend items are buttons with <code>aria-pressed</code> that show or hide a series.</li>
          <li>Information doesn’t rely on color alone: text legend, values in the table, markers on lines.</li>
          <li>Hovering shows values but isn’t announced: the same information is reachable by keyboard and in the table.</li>
        </ul>
      </DocSection>

      <DocSection title="Building an admin dashboard">
        <RefTable
          label="Dashboard components"
          columns={['Need', 'Component']}
          rows={[
            ['Welcome, summary, and primary action', 'HeroCard (brand or tertiary tone, decorative media)'],
            ['Clickable announcement (news, upgrade)', 'PromoBanner: the whole area is a link, optionally dismissible'],
            ['Shortcuts to frequent tasks', 'QuickAction in a Grid'],
            ['Key metrics', 'KpiCard, optionally with Sparkline'],
            ['Vertical or horizontal navigation, with or without icons', 'NavList (subtle, pill, underline; collapsible rail)'],
            ['Operational data', 'DataTable with filters and pagination'],
          ]}
        />
        <p>
          The complete template is in <Link href="/showcase/admin">Admin dashboard</Link>: it uses NavList for side navigation, KpiCard,
          charts, PromoBanner, and quick actions, with a period switcher that recalculates the data locally.
        </p>
      </DocSection>

      <DocSection title="Responsive">
        <ul>
          <li>Chart width follows the container; height is fixed (<code>height</code> prop), so the layout doesn’t jump.</li>
          <li>Use <code>Grid minItemWidth</code> to wrap KPIs and charts in narrow containers instead of relying on page breakpoints.</li>
          <li>With many categories on mobile, prefer a horizontal BarChart: long labels wrap instead of overlapping.</li>
        </ul>
      </DocSection>
    </>
  );
}
