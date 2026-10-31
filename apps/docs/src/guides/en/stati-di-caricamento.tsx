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
} from '@dev-community/ui';
import { Code, DocSection, RefTable } from '../../components/Doc';

const POSTS = [
  {
    id: 'keda',
    title: 'AKS + KEDA: event-driven autoscaling',
    thumbLabel: 'K8s',
    author: 'Marco Rossi',
    meta: '6 min',
    votes: 186,
  },
  {
    id: 'copilot',
    title: 'Copilot agent mode: 10 everyday prompts',
    thumbLabel: 'GH',
    tone: 'data-2' as const,
    author: 'Sara Leone',
    meta: '4 min',
    votes: 241,
  },
  {
    id: 'bicep',
    title: 'Bicep: reusable modules',
    thumbLabel: 'IaC',
    tone: 'data-6' as const,
    author: 'Luca Bianchi',
    meta: '7 min',
    votes: 97,
  },
];

const PEOPLE = [
  { id: 'sara', name: 'Sara Leone', subtitle: '12 articles', points: 2840 },
  { id: 'giulia', name: 'Giulia Conti', subtitle: '8 articles', points: 2115 },
  { id: 'marco', name: 'Marco Rossi', subtitle: '96 answers', points: 1760 },
];

function LiveExample() {
  const [isLoading, setIsLoading] = useState(true);
  return (
    <Stack gap={4}>
      <Switch isSelected={isLoading} onChange={setIsLoading}>
        Simulate loading
      </Switch>
      <SkeletonGroup isLoading={isLoading} label="Loading dashboard…" loadedLabel="Dashboard loaded" animation="wave">
        <Stack gap={4}>
          <Grid minItemWidth="13rem" gap={3}>
            <KpiCard isLoading={isLoading} label="Members" value={1284} sparkline={isLoading ? [] : [980, 1040, 1120, 1190, 1284]} />
            <KpiCard isLoading={isLoading} label="Tickets" value={342} trend={{ direction: 'up', value: '+12%' }} />
            <KpiCard isLoading={isLoading} label="Posts" value={57} />
          </Grid>
          <Grid minItemWidth="18rem" gap={3}>
            {isLoading ? (
              <SkeletonChart variant="bar" />
            ) : (
              <BarChart
                title="Sign-ups per quarter"
                categories={['Q1', 'Q2', 'Q3', 'Q4']}
                series={[
                  {
                    id: 'iscritti',
                    label: 'Members',
                    data: [220, 310, 280, 474],
                  },
                ]}
              />
            )}
            <Leaderboard isLoading={isLoading} loadingRows={3} title="Top contributors" items={PEOPLE} />
          </Grid>
          <PostList isLoading={isLoading} loadingRows={3} aria-label="Popular posts" items={POSTS} />
        </Stack>
      </SkeletonGroup>
    </Stack>
  );
}

export default function StatiDiCaricamento() {
  return (
    <>
      <DocSection title="When to use a skeleton">
        <p>
          A skeleton previews the <strong>shape</strong> of content coming from the network: it only makes sense for components that display
          loaded data (cards, lists, tables, charts). Buttons, fields, menus, and dialogs don’t need one: they are already there, at most
          disabled or showing a Spinner during an action.
        </p>
        <RefTable
          label="Which loading state to use"
          columns={['Situation', 'Solution', 'Notes']}
          rows={[
            [
              'Data component with a known layout',
              'The component’s isLoading prop',
              'The skeleton has the same shape: no layout shift.',
            ],
            [
              'Hand-composed area or component without isLoading',
              'SkeletonGroup + presets (SkeletonCard, SkeletonList…)',
              'Automatic skeleton → children swap.',
            ],
            ['Full page on first visit', 'SkeletonPage', 'Header, toolbar, and card grid.'],
            ['User action (save, submit)', 'Spinner or Button isPending', 'Not a content load.'],
            ['Measurable progress (upload)', 'Progress', 'Shows the percentage.'],
            ['Waits under 300 ms', 'Nothing', 'A skeleton would only cause flicker.'],
          ]}
        />
      </DocSection>

      <DocSection title="Components with isLoading">
        <RefTable
          label="Components and presets used"
          columns={['Component', 'Skeleton', 'What stays visible']}
          rows={[
            ['KpiCard', 'SkeletonKpi', 'Nothing: the whole card becomes a skeleton. sparkline and icon reserve space for the line and icon.'],
            ['ProfileCard', 'SkeletonProfile', 'Nothing; the number of stats follows stats when provided.'],
            ['ArticleCard / EventCard', 'SkeletonCard', 'Nothing; the cover follows the variant.'],
            ['PostList / DiscussionList', 'SkeletonList (loadingRows)', 'The <ul>/<ol> element with its frame.'],
            ['Leaderboard', 'SkeletonList (loadingRows)', 'Title and footer.'],
          ]}
        />
        <p>
          With <code>isLoading</code>, each component sets <code>aria-busy="true"</code> and contains hidden “Loading…” text that is{' '}
          <em>not</em> a live region, so a grid of cards doesn’t produce ten announcements. className and style are still applied: the
          skeleton occupies the same grid cell.
        </p>
        <Code>{`const { data, isLoading } = useQuery(...);

<KpiCard
  isLoading={isLoading}
  label="Members"
  value={data?.members ?? null}
  sparkline={data?.trend ?? []}   // [] reserves space for the line
/>

<PostList isLoading={isLoading} loadingRows={5} items={data?.posts} aria-label="Popular posts" />`}</Code>
      </DocSection>

      <DocSection title="One announcement per area">
        <p>
          For a dashboard or a page, wrap the area in <code>SkeletonGroup</code> without the <code>skeleton</code> prop (container
          mode): it announces the start of loading once and, with <code>loadedLabel</code>, its end, and it synchronizes the
          animation of the components inside it.
        </p>
        <LiveExample />
        <Code>{`<SkeletonGroup isLoading={isLoading} label="Loading dashboard…" loadedLabel="Dashboard loaded" animation="wave">
  <Grid minItemWidth="13rem" gap={3}>
    <KpiCard isLoading={isLoading} label="Members" value={data?.members ?? null} />
    <KpiCard isLoading={isLoading} label="Tickets" value={data?.tickets ?? null} />
  </Grid>
  {isLoading ? <SkeletonChart variant="bar" /> : <BarChart title="Sign-ups per quarter" categories={quarters} series={data.series} />}
</SkeletonGroup>`}</Code>
      </DocSection>

      <DocSection title="Components without isLoading">
        <p>
          For everything else, compose the presets with <code>SkeletonGroup</code>: SkeletonText, SkeletonAvatar, SkeletonCard, SkeletonList,
          SkeletonTable, SkeletonKpi, SkeletonChart, SkeletonForm, SkeletonPage, SkeletonProfile, SkeletonComment (threads and feeds), and
          SkeletonKanban (boards).
        </p>
        <p>
          Charts don’t have <code>isLoading</code>: inside a container <code>SkeletonGroup</code>, swap the chart with a{' '}
          <code>SkeletonChart</code> of the same type and height, as in the example above. <code>DataTable</code> already has its
          own <code>isLoading</code> (a loading indicator when there are no rows, a progress bar when rows are already present).
        </p>
        <div style={{ maxInlineSize: '32rem' }}>
          <SkeletonGroup isLoading skeleton={<SkeletonText lines={3} heading />}>
            <p>Content</p>
          </SkeletonGroup>
        </div>
        <Code>{`import { CommentThread, SkeletonComment, SkeletonGroup } from '@dev-community/ui';

<SkeletonGroup isLoading={isLoading} skeleton={<SkeletonComment rows={3} replies={1} />}>
  <CommentThread aria-label="Comments" comments={comments} />
</SkeletonGroup>`}</Code>
      </DocSection>

      <DocSection title="Best practices">
        <ul>
          <li>
            Show the skeleton only after ~300 ms or only on the first load; for subsequent updates keep the stale data
            (DataTable shows a progress bar).
          </li>
          <li>Don’t nest multiple SkeletonGroups with status text: each region adds its own announcement.</li>
          <li>
            Reserve the same height as the content (same number of rows, same chart height) to avoid layout shifts.
          </li>
          <li>The shapes are decorative (aria-hidden) and respect prefers-reduced-motion and forced-colors.</li>
        </ul>
      </DocSection>
    </>
  );
}
