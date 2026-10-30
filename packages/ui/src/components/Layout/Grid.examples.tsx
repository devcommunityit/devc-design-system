import { Grid, GridItem } from '@dev-community/ui';

const cell = {
  padding: 'var(--dc-space-4)',
  borderRadius: 'var(--dc-radius-md)',
  background: 'var(--dc-color-surface-subtle)',
  border: '1px solid var(--dc-color-border-subtle)',
};

export function ResponsiveColumns() {
  return (
    <Grid columns={{ base: 1, sm: 2, lg: 4 }} gap={4}>
      {['Ricavi', 'Ordini', 'Clienti', 'Resi'].map((label) => (
        <div key={label} style={cell}>
          {label}
        </div>
      ))}
    </Grid>
  );
}

export function AutoFit() {
  return (
    <Grid minItemWidth="12rem" gap={3}>
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} style={cell}>
          Scheda {i + 1}
        </div>
      ))}
    </Grid>
  );
}

export function Spanning() {
  return (
    <Grid columns={{ base: 1, md: 3 }} gap={4}>
      <GridItem span={2} style={cell}>
        Contenuto principale (2 colonne)
      </GridItem>
      <div style={cell}>Pannello laterale</div>
      <GridItem span="full" style={cell}>
        Riga intera
      </GridItem>
    </Grid>
  );
}