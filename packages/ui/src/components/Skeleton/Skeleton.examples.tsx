import { useState } from 'react';
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Grid,
  Inline,
  KpiCard,
  Skeleton,
  SkeletonAvatar,
  SkeletonCard,
  SkeletonChart,
  SkeletonComment,
  SkeletonForm,
  SkeletonGroup,
  SkeletonKanban,
  SkeletonKpi,
  SkeletonList,
  SkeletonPage,
  SkeletonProfile,
  SkeletonTable,
  SkeletonText,
  Stack,
  Switch,
  Text,
} from '@dev-community/ui';

export function Shapes() {
  return (
    <SkeletonGroup>
      <Stack gap={3}>
        <Inline gap={3} align="center">
          <Skeleton shape="circle" width="3rem" />
          <Skeleton lines={2} width="60%" />
        </Inline>
        <Skeleton shape="rect" height="8rem" />
        <Skeleton shape="rect" radius="control" width="8rem" height="var(--dc-density-control-height-md)" />
      </Stack>
    </SkeletonGroup>
  );
}

export function Wave() {
  return (
    <SkeletonGroup animation="wave" label="Caricamento dell’articolo…">
      <Stack gap={4}>
        <SkeletonAvatar size="lg" lines={2} />
        <SkeletonText heading lines={4} />
      </Stack>
    </SkeletonGroup>
  );
}

export function Cards() {
  return (
    <SkeletonGroup animation="wave" label="Caricamento degli articoli…">
      <Grid minItemWidth="16rem" gap={4}>
        <SkeletonCard media lines={2} />
        <SkeletonCard avatar lines={3} actions={2} />
        <SkeletonCard media mediaRatio="4 / 3" heading lines={1} actions={1} />
      </Grid>
    </SkeletonGroup>
  );
}

export function ListAndTable() {
  return (
    <SkeletonGroup label="Caricamento dei dati…">
      <Stack gap={6}>
        <SkeletonList rows={4} trailing variant="card" />
        <SkeletonTable rows={5} columns={5} />
        <SkeletonTable rows={3} columns={6} responsive="scroll" />
      </Stack>
    </SkeletonGroup>
  );
}

export function Dashboard() {
  return (
    <SkeletonGroup animation="wave" label="Caricamento della dashboard…">
      <Stack gap={4}>
        <Grid minItemWidth="12rem" gap={4}>
          <SkeletonKpi icon />
          <SkeletonKpi sparkline />
          <SkeletonKpi icon sparkline />
        </Grid>
        <Grid minItemWidth="16rem" gap={4}>
          <SkeletonChart variant="bar" />
          <SkeletonChart variant="line" />
          <SkeletonChart variant="area" />
          <SkeletonChart variant="donut" height="10rem" />
        </Grid>
      </Stack>
    </SkeletonGroup>
  );
}

export function Form() {
  return (
    <div style={{ maxInlineSize: '28rem' }}>
      <SkeletonGroup label="Caricamento del modulo…">
        <SkeletonForm fields={3} textarea />
      </SkeletonGroup>
    </div>
  );
}

export function Page() {
  return (
    <SkeletonGroup animation="wave" label="Caricamento della pagina…">
      <SkeletonPage cards={3} />
    </SkeletonGroup>
  );
}

export function LoadingSwap() {
  const [loading, setLoading] = useState(true);
  return (
    <Stack gap={4}>
      <Switch isSelected={loading} onChange={setLoading}>
        Simula caricamento
      </Switch>
      <SkeletonGroup
        isLoading={loading}
        animation="wave"
        label="Caricamento degli indicatori…"
        loadedLabel="Indicatori aggiornati"
        skeleton={
          <Grid minItemWidth="12rem" gap={4}>
            <SkeletonKpi sparkline />
            <SkeletonKpi sparkline />
          </Grid>
        }
      >
        <Grid minItemWidth="12rem" gap={4}>
          <KpiCard
            label="Iscritti"
            value={1284}
            trend={{ direction: 'up', value: '+6,4%', label: 'rispetto al mese scorso' }}
            sparkline={[980, 1020, 1100, 1090, 1180, 1230, 1284]}
          />
          <KpiCard
            label="Eventi pubblicati"
            value={42}
            trend={{ direction: 'down', value: '-2', label: 'rispetto al mese scorso' }}
            sparkline={[48, 46, 47, 45, 44, 43, 42]}
          />
        </Grid>
      </SkeletonGroup>
    </Stack>
  );
}

export function Toggle() {
  const [loading, setLoading] = useState(true);
  return (
    <Stack gap={3}>
      <Button size="sm" variant="secondary" onPress={() => setLoading((l) => !l)}>
        {loading ? 'Mostra contenuto' : 'Mostra skeleton'}
      </Button>
      <SkeletonGroup isLoading={loading} skeleton={<SkeletonText lines={3} />}>
        <Text>Il contenuto reale occupa lo stesso spazio dello skeleton, evitando spostamenti del layout.</Text>
      </SkeletonGroup>
    </Stack>
  );
}

export function CardPlaceholder() {
  const [loading, setLoading] = useState(true);
  return (
    <Stack gap={3}>
      <Button size="sm" variant="secondary" onPress={() => setLoading((l) => !l)}>
        {loading ? 'Mostra la scheda caricata' : 'Simula di nuovo il caricamento'}
      </Button>
      <div style={{ maxInlineSize: '24rem' }}>
        <SkeletonGroup
          isLoading={loading}
          label="Caricamento del profilo…"
          skeleton={<SkeletonCard avatar media lines={3} actions={2} />}
        >
          <Card>
            <CardHeader
              headingLevel={3}
              media={<Avatar name="Giulia Bianchi" isDecorative />}
              title="Giulia Bianchi"
              subtitle="Product designer · Bologna"
            />
            <CardBody>
              <Stack gap={3}>
                <Text>
                  Coordina il design system del portale clienti e cura le linee guida di accessibilità per i team di sviluppo.
                </Text>
                <Inline gap={2}>
                  <Badge tone="success" dot>
                    Disponibile
                  </Badge>
                  <Badge tone="info">12 progetti</Badge>
                </Inline>
              </Stack>
            </CardBody>
          </Card>
        </SkeletonGroup>
      </div>
    </Stack>
  );
}

export function ListPlaceholder() {
  return (
    <SkeletonGroup label="Caricamento dei contatti…">
      <SkeletonList rows={4} trailing />
    </SkeletonGroup>
  );
}

/** Community presets: profile grid, comment thread with replies and a board. */
export function CommunityPresets() {
  return (
    <SkeletonGroup label="Caricamento della community…" animation="wave">
      <Grid minItemWidth="14rem" gap={4}>
        <SkeletonProfile />
        <SkeletonProfile stats={2} actions={2} />
      </Grid>
      <div style={{ marginBlock: 'var(--dc-space-6)' }}>
        <SkeletonComment rows={2} replies={2} />
      </div>
      <SkeletonKanban columns={3} cards={3} />
    </SkeletonGroup>
  );
}
