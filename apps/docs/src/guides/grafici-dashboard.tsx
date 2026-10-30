import { BarChart, DonutChart, Grid, KpiCard, Link, LineChart, Stack } from '@dev-community/ui';
import { Code, DocSection, RefTable } from '../components/Doc';

const MONTHS = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu'];

function LiveDashboard() {
  return (
    <Stack gap={4}>
      <Grid minItemWidth="13rem" gap={3}>
        <KpiCard
          label="Ricavi"
          value={48250}
          formatOptions={{ style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }}
          trend={{ direction: 'up', value: '+8,4%' }}
          sparkline={[31, 35, 33, 40, 44, 48]}
          description="Ultimi 30 giorni"
        />
        <KpiCard label="Ordini" value={1284} trend={{ direction: 'up', value: '+3,1%' }} sparkline={[980, 1010, 1100, 1150, 1210, 1284]} />
        <KpiCard
          label="Resi"
          value={0.021}
          formatOptions={{ style: 'percent', maximumFractionDigits: 1 }}
          trend={{ direction: 'down', value: '−0,4 pt', sentiment: 'positive' }}
        />
      </Grid>
      <Grid minItemWidth="18rem" gap={3}>
        <LineChart
          title="Ricavi mensili"
          description="Migliaia di euro, primo semestre"
          categories={MONTHS}
          series={[
            { id: 'online', label: 'Online', data: [21, 24, 22, 28, 31, 34] },
            { id: 'negozi', label: 'Negozi', data: [10, 11, 11, 12, 13, 14] },
          ]}
          variant="area"
        />
        <DonutChart
          title="Ordini per canale"
          data={[
            { id: 'web', label: 'Web', value: 642 },
            { id: 'app', label: 'App', value: 418 },
            { id: 'telefono', label: 'Telefono', value: 224 },
          ]}
        />
      </Grid>
      <BarChart
        title="Ticket per area"
        orientation="horizontal"
        categories={['Fatturazione', 'Accesso e credenziali', 'Spedizioni', 'Resi']}
        series={[
          { id: 'aperti', label: 'Aperti', data: [12, 7, 15, 4] },
          { id: 'chiusi', label: 'Chiusi', data: [30, 22, 41, 18] },
        ]}
        layout="stacked"
      />
    </Stack>
  );
}

export default function GraficiDashboard() {
  return (
    <>
      <DocSection title="Scegliere il grafico">
        <RefTable
          label="Quale grafico usare"
          columns={['Domanda', 'Componente', 'Note']}
          rows={[
            ['Come cambia nel tempo?', 'LineChart (variant line o area)', 'Più serie confrontabili; null lascia un vuoto, non uno zero.'],
            ['Quale categoria è più grande?', 'BarChart verticale o orizzontale', 'Orizzontale per etichette lunghe; stacked per parti di un totale.'],
            ['Come si divide un totale?', 'DonutChart', 'Poche fette (fino a 6): oltre, usa un BarChart ordinato.'],
            ['Tendenza compatta accanto a un numero', 'Sparkline o KpiCard con sparkline', 'Decorativa: il valore e la variazione restano nel testo.'],
            ['Valore singolo con variazione', 'KpiCard / Statistic', 'La direzione è annunciata a parole, non solo con colore e freccia.'],
          ]}
        />
        <p>
          I grafici sono SVG senza dipendenze esterne, dimensionati sul contenitore. Non sostituiscono una libreria di analisi: niente zoom, assi
          temporali continui o curve smussate (vedi i limiti in ogni pagina componente).
        </p>
      </DocSection>

      <DocSection title="Esempio dal vivo">
        <p>Una sezione di dashboard composta solo con componenti della libreria e dati locali deterministici. Cambia tema o modalità dal menu delle preferenze: i colori dei dati seguono il tema.</p>
        <LiveDashboard />
        <Code>{`import { Grid, KpiCard, LineChart } from '@dev-community/ui';

<Grid minItemWidth="13rem" gap={3}>
  <KpiCard
    label="Ricavi"
    value={48250}
    formatOptions={{ style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }}
    trend={{ direction: 'up', value: '+8,4%' }}
    sparkline={[31, 35, 33, 40, 44, 48]}
  />
</Grid>

<LineChart
  title="Ricavi mensili"
  description="Migliaia di euro, primo semestre"
  categories={['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu']}
  series={[{ id: 'online', label: 'Online', data: [21, 24, 22, 28, 31, 34] }]}
  variant="area"
/>`}</Code>
      </DocSection>

      <DocSection title="Colori dei dati">
        <p>
          Le serie usano i ruoli semantici <code>data.1</code>…<code>data.6</code> (variabili <code>--dc-color-data-1</code>…), definiti per ogni preset in
          modalità chiara e scura e modificabili nel <Link href="/theme-builder">Theme Builder</Link> (gruppo «Dati e grafici»). Oltre sei serie i colori si
          ripetono: riduci le serie o raggruppa le minori in «Altro».
        </p>
        <Code language="ts">{`import { createTheme } from '@dev-community/ui';

export const theme = createTheme({
  name: 'analytics',
  seed: '#3b5bdb',
  light: { 'data.1': '#3b5bdb', 'data.2': '#0f8a6a' },
  dark: { 'data.1': '#9db0ff', 'data.2': '#5fd4b0' },
});`}</Code>
        <p>
          Controlla il contrasto delle serie con la superficie (almeno 3:1 per elementi grafici): l’indicatore del Theme Builder lo segnala, ma non
          garantisce che colori vicini siano distinguibili tra loro.
        </p>
      </DocSection>

      <DocSection title="Accessibilità dei grafici">
        <ul>
          <li>Ogni grafico è una <code>figure</code> con titolo visibile; il pulsante «Mostra tabella dati» apre una tabella equivalente con didascalia.</li>
          <li>L’area del grafico è un gruppo navigabile: le frecce spostano il punto attivo e un’area live annuncia categoria e valori.</li>
          <li>Con più serie, le voci della legenda sono pulsanti con <code>aria-pressed</code> per mostrare o nascondere una serie.</li>
          <li>Le informazioni non dipendono solo dal colore: legenda testuale, valori in tabella, marker sulle linee.</li>
          <li>Il passaggio del mouse mostra i valori ma non viene annunciato: le stesse informazioni sono raggiungibili da tastiera e nella tabella.</li>
        </ul>
      </DocSection>

      <DocSection title="Comporre una dashboard di amministrazione">
        <RefTable
          label="Componenti per dashboard"
          columns={['Bisogno', 'Componente']}
          rows={[
            ['Benvenuto, riepilogo e azione principale', 'HeroCard (tono brand o tertiary, media decorativa)'],
            ['Comunicazione cliccabile (novità, upgrade)', 'PromoBanner: tutta l’area è un link, con eventuale chiusura'],
            ['Scorciatoie a funzioni frequenti', 'QuickAction in una Grid'],
            ['Metriche principali', 'KpiCard, opzionalmente con Sparkline'],
            ['Navigazione verticale o orizzontale, con o senza icone', 'NavList (subtle, pill, underline; rail comprimibile)'],
            ['Dati operativi', 'DataTable con filtri e paginazione'],
          ]}
        />
        <p>
          Il template completo è in <Link href="/showcase/admin">Dashboard di amministrazione</Link>: usa NavList come navigazione laterale, KpiCard,
          grafici, PromoBanner e azioni rapide, con un cambio di periodo che ricalcola i dati localmente.
        </p>
      </DocSection>

      <DocSection title="Responsive">
        <ul>
          <li>La larghezza dei grafici segue il contenitore; l’altezza è fissa (prop <code>height</code>), così il layout non salta.</li>
          <li>Usa <code>Grid minItemWidth</code> per far andare a capo KPI e grafici nei contenitori stretti invece dei breakpoint di pagina.</li>
          <li>Con molte categorie su mobile preferisci BarChart orizzontale: le etichette lunghe vanno a capo invece di sovrapporsi.</li>
        </ul>
      </DocSection>
    </>
  );
}
