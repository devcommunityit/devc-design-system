import { useState } from 'react';
import {
  BarChart,
  Grid,
  KpiCard,
  Leaderboard,
  PostList,
  SkeletonChart,
  SkeletonGroup,
  SkeletonText,
  Stack,
  Switch,
} from '@devcommunityit/ui';
import { Code, DocSection, RefTable } from '../components/Doc';

const POSTS = [
  {
    id: 'keda',
    title: 'AKS + KEDA: autoscaling event-driven',
    thumbLabel: 'K8s',
    author: 'Marco Rossi',
    meta: '6 min',
    votes: 186,
  },
  {
    id: 'copilot',
    title: 'Copilot agent mode: 10 prompt quotidiani',
    thumbLabel: 'GH',
    tone: 'data-2' as const,
    author: 'Sara Leone',
    meta: '4 min',
    votes: 241,
  },
  {
    id: 'bicep',
    title: 'Bicep: moduli riusabili',
    thumbLabel: 'IaC',
    tone: 'data-6' as const,
    author: 'Luca Bianchi',
    meta: '7 min',
    votes: 97,
  },
];

const PEOPLE = [
  { id: 'sara', name: 'Sara Leone', subtitle: '12 articoli', points: 2840 },
  { id: 'giulia', name: 'Giulia Conti', subtitle: '8 articoli', points: 2115 },
  { id: 'marco', name: 'Marco Rossi', subtitle: '96 risposte', points: 1760 },
];

function LiveExample() {
  const [isLoading, setIsLoading] = useState(true);
  return (
    <Stack gap={4}>
      <Switch isSelected={isLoading} onChange={setIsLoading}>
        Simula caricamento
      </Switch>
      <SkeletonGroup isLoading={isLoading} label="Caricamento della dashboard…" loadedLabel="Dashboard caricata" animation="wave">
        <Stack gap={4}>
          <Grid minItemWidth="13rem" gap={3}>
            <KpiCard isLoading={isLoading} label="Iscritti" value={1284} sparkline={isLoading ? [] : [980, 1040, 1120, 1190, 1284]} />
            <KpiCard isLoading={isLoading} label="Biglietti" value={342} trend={{ direction: 'up', value: '+12%' }} />
            <KpiCard isLoading={isLoading} label="Post" value={57} />
          </Grid>
          <Grid minItemWidth="18rem" gap={3}>
            {isLoading ? (
              <SkeletonChart variant="bar" />
            ) : (
              <BarChart
                title="Iscrizioni per trimestre"
                categories={['Q1', 'Q2', 'Q3', 'Q4']}
                series={[
                  {
                    id: 'iscritti',
                    label: 'Iscritti',
                    data: [220, 310, 280, 474],
                  },
                ]}
              />
            )}
            <Leaderboard isLoading={isLoading} loadingRows={3} title="Top contributor" items={PEOPLE} />
          </Grid>
          <PostList isLoading={isLoading} loadingRows={3} aria-label="Post popolari" items={POSTS} />
        </Stack>
      </SkeletonGroup>
    </Stack>
  );
}

export default function StatiDiCaricamento() {
  return (
    <>
      <DocSection title="Quando serve uno skeleton">
        <p>
          Uno skeleton anticipa la <strong>forma</strong> di un contenuto che arriva dalla rete: ha senso solo per i componenti che mostrano
          dati caricati (card, liste, tabelle, grafici). Pulsanti, campi, menu e dialog non ne hanno bisogno: sono già lì, al massimo sono
          disabilitati o mostrano uno Spinner durante un’azione.
        </p>
        <RefTable
          label="Quale stato di caricamento usare"
          columns={['Situazione', 'Soluzione', 'Note']}
          rows={[
            [
              'Componente di dati con layout noto',
              'Prop isLoading del componente',
              'Lo skeleton ha la stessa forma: niente salti di layout.',
            ],
            [
              'Area composta a mano o componente senza isLoading',
              'SkeletonGroup + preset (SkeletonCard, SkeletonList…)',
              'Sostituzione automatica skeleton → children.',
            ],
            ['Pagina intera al primo accesso', 'SkeletonPage', 'Intestazione, barra strumenti e griglia di card.'],
            ['Azione dell’utente (salva, invia)', 'Spinner o Button isPending', 'Non è un caricamento di contenuto.'],
            ['Avanzamento misurabile (upload)', 'Progress', 'Mostra la percentuale.'],
            ['Attese sotto i 300 ms', 'Niente', 'Lo skeleton causerebbe solo uno sfarfallio.'],
          ]}
        />
      </DocSection>

      <DocSection title="Componenti con isLoading">
        <RefTable
          label="Componenti e preset usati"
          columns={['Componente', 'Skeleton', 'Cosa resta visibile']}
          rows={[
            ['KpiCard', 'SkeletonKpi', 'Nulla: la card intera diventa skeleton. sparkline e icon riservano linea e icona.'],
            ['ProfileCard', 'SkeletonProfile', 'Nulla; il numero di statistiche segue stats se presente.'],
            ['ArticleCard / EventCard', 'SkeletonCard', 'Nulla; la cover segue la variante.'],
            ['PostList / DiscussionList', 'SkeletonList (loadingRows)', 'L’elemento <ul>/<ol> con la sua cornice.'],
            ['Leaderboard', 'SkeletonList (loadingRows)', 'Titolo e footer.'],
          ]}
        />
        <p>
          Con <code>isLoading</code> ogni componente imposta <code>aria-busy="true"</code> e contiene un testo nascosto «Caricamento…» che{' '}
          <em>non</em> è una regione live, così una griglia di card non produce dieci annunci. className e style restano applicati: lo
          skeleton occupa la stessa cella della griglia.
        </p>
        <Code>{`const { data, isLoading } = useQuery(...);

<KpiCard
  isLoading={isLoading}
  label="Iscritti"
  value={data?.members ?? null}
  sparkline={data?.trend ?? []}   // [] riserva lo spazio della linea
/>

<PostList isLoading={isLoading} loadingRows={5} items={data?.posts} aria-label="Post popolari" />`}</Code>
      </DocSection>

      <DocSection title="Un solo annuncio per area">
        <p>
          Per una dashboard o una pagina avvolgi l’area in <code>SkeletonGroup</code> senza la prop <code>skeleton</code> (modalità
          contenitore): annuncia una sola volta l’inizio e, con <code>loadedLabel</code>, la fine del caricamento, e sincronizza
          l’animazione dei componenti al suo interno.
        </p>
        <LiveExample />
        <Code>{`<SkeletonGroup isLoading={isLoading} label="Caricamento della dashboard…" loadedLabel="Dashboard caricata" animation="wave">
  <Grid minItemWidth="13rem" gap={3}>
    <KpiCard isLoading={isLoading} label="Iscritti" value={data?.members ?? null} />
    <KpiCard isLoading={isLoading} label="Biglietti" value={data?.tickets ?? null} />
  </Grid>
  {isLoading ? <SkeletonChart variant="bar" /> : <BarChart title="Iscrizioni per trimestre" categories={quarters} series={data.series} />}
</SkeletonGroup>`}</Code>
      </DocSection>

      <DocSection title="Componenti senza isLoading">
        <p>
          Per tutto il resto componi i preset con <code>SkeletonGroup</code>: SkeletonText, SkeletonAvatar, SkeletonCard, SkeletonList,
          SkeletonTable, SkeletonKpi, SkeletonChart, SkeletonForm, SkeletonPage, SkeletonProfile, SkeletonComment (thread e feed) e
          SkeletonKanban (board).
        </p>
        <p>
          I grafici non hanno <code>isLoading</code>: dentro un <code>SkeletonGroup</code> contenitore alterna il grafico con uno{' '}
          <code>SkeletonChart</code> dello stesso tipo e della stessa altezza, come nell’esempio sopra. <code>DataTable</code> ha già il
          proprio <code>isLoading</code> (indicatore di caricamento senza righe, barra di avanzamento con righe già presenti).
        </p>
        <div style={{ maxInlineSize: '32rem' }}>
          <SkeletonGroup isLoading skeleton={<SkeletonText lines={3} heading />}>
            <p>Contenuto</p>
          </SkeletonGroup>
        </div>
        <Code>{`import { CommentThread, SkeletonComment, SkeletonGroup } from '@devcommunityit/ui';

<SkeletonGroup isLoading={isLoading} skeleton={<SkeletonComment rows={3} replies={1} />}>
  <CommentThread aria-label="Commenti" comments={comments} />
</SkeletonGroup>`}</Code>
      </DocSection>

      <DocSection title="Buone pratiche">
        <ul>
          <li>
            Mostra lo skeleton solo dopo ~300 ms o solo al primo caricamento; per gli aggiornamenti successivi mantieni i dati vecchi
            (DataTable mostra una barra di avanzamento).
          </li>
          <li>Non annidare più SkeletonGroup con testo di stato: ogni regione aggiunge il proprio annuncio.</li>
          <li>
            Riserva la stessa altezza del contenuto (stesso numero di righe, stessa altezza del grafico) per evitare spostamenti del layout.
          </li>
          <li>Le forme sono decorative (aria-hidden) e rispettano prefers-reduced-motion e forced-colors.</li>
        </ul>
      </DocSection>
    </>
  );
}
