import { Inline, LiveIndicator } from '@devcommunityit/ui';

export function Basic() {
  return <LiveIndicator />;
}

/** On a dark surface the text inherits the inverse colour. */
export function WithViewers() {
  return (
    <Inline gap={4}>
      <LiveIndicator viewers={248} />
      <span
        style={{
          padding: 'var(--dc-space-3) var(--dc-space-4)',
          borderRadius: 'var(--dc-radius-lg)',
          backgroundColor: 'var(--dc-color-surface-inverse)',
          color: 'var(--dc-color-text-inverse)',
        }}
      >
        <LiveIndicator label="Live ora" viewers={12400} formatOptions={{ notation: 'compact' }} />
      </span>
    </Inline>
  );
}
