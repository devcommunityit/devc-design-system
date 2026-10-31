import { ShareButtons, Stack } from '@dev-community/ui';

const article = {
  url: 'https://devcommunity.it/blog/react-aria-accessibilita',
  title: 'Componenti accessibili con React Aria: guida pratica',
  text: 'Come costruiamo il design system della community partendo dall’accessibilità.',
};

export function Basic() {
  return <ShareButtons {...article} />;
}

export function Pill() {
  return (
    <ShareButtons
      {...article}
      variant="pill"
      size="sm"
      aria-label="Condividi l’articolo"
      networks={['linkedin', 'x', 'whatsapp', 'telegram', 'bluesky', 'email']}
    />
  );
}

/** Analytics: `onShare` reports the channel used. */
export function WithAnalytics() {
  return (
    <ShareButtons
      url="https://devcommunity.it/eventi/meetup-milano-novembre"
      title="Meetup di novembre a Milano"
      text="Ci vediamo al meetup di novembre: talk su TypeScript e design system!"
      tone="brand"
      networks={['linkedin', 'whatsapp', 'telegram']}
      onShare={(target) => console.info('condivisione', target)}
    />
  );
}

export function Inverse() {
  return (
    <div
      style={{
        padding: 'var(--dc-space-8)',
        borderRadius: 'var(--dc-radius-xl)',
        backgroundColor: 'var(--dc-color-surface-inverse)',
        color: 'var(--dc-color-text-inverse)',
      }}
    >
      <Stack gap={3}>
        <ShareButtons {...article} tone="inverse" showNativeShare={false} />
        <ShareButtons {...article} tone="inverse" variant="pill" showCopy={false} networks={['linkedin', 'x']} />
      </Stack>
    </div>
  );
}
