import { AspectRatio, Grid } from '@dev-community/ui';

const placeholder = {
  display: 'grid',
  placeItems: 'center',
  inlineSize: '100%',
  blockSize: '100%',
  borderRadius: 'var(--dc-radius-md)',
  background: 'var(--dc-color-surface-muted)',
  color: 'var(--dc-color-text-secondary)',
};

export function Ratios() {
  return (
    <Grid columns={{ base: 1, sm: 3 }} gap={3}>
      {[
        { label: '16:9', ratio: 16 / 9 },
        { label: '4:3', ratio: 4 / 3 },
        { label: '1:1', ratio: 1 },
      ].map(({ label, ratio }) => (
        <AspectRatio key={label} ratio={ratio}>
          <div style={placeholder}>{label}</div>
        </AspectRatio>
      ))}
    </Grid>
  );
}