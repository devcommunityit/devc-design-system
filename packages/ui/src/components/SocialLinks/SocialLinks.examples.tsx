import { Heading, SocialLinks, Stack } from '@devcommunityit/ui';

const community = [
  { network: 'github', href: 'https://github.com/dev-community-italia' },
  { network: 'linkedin', href: 'https://www.linkedin.com/company/dev-community-italia' },
  { network: 'youtube', href: 'https://www.youtube.com/@devcommunityitalia' },
  { network: 'discord', href: 'https://discord.gg/devcommunity' },
] as const;

export function Basic() {
  return <SocialLinks aria-label="Seguici sui social" items={[...community]} />;
}

export function Variants() {
  return (
    <Stack gap={5}>
      <SocialLinks aria-label="Profili social (icone)" variant="icon" items={[...community]} />
      <SocialLinks aria-label="Profili social (pillole)" variant="pill" items={[...community]} />
      <SocialLinks
        aria-label="Profili social (elenco)"
        variant="list"
        items={[
          ...community,
          { network: 'rss', href: '/feed.xml', label: 'Feed RSS degli articoli' },
          { network: 'email', href: 'mailto:ciao@devcommunity.it', label: 'ciao@devcommunity.it' },
        ]}
      />
    </Stack>
  );
}

export function SizesAndTones() {
  return (
    <Stack gap={5}>
      <SocialLinks aria-label="Social, piccoli" size="sm" items={[...community]} />
      <SocialLinks aria-label="Social, tono brand" tone="brand" items={[...community]} />
      <SocialLinks aria-label="Social, grandi con nome" size="lg" variant="pill" tone="brand" items={[...community]} />
    </Stack>
  );
}

/** Footer column “Seguiti” on a dark section. */
export function FooterInverse() {
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
        <Heading level={2} size="title-sm" tone="inherit" id="footer-social">
          Seguiti
        </Heading>
        <SocialLinks aria-labelledby="footer-social" variant="list" tone="inverse" items={[...community]} />
        <SocialLinks
          aria-label="Altri canali"
          tone="inverse"
          items={[
            { network: 'x', href: 'https://x.com/devcommunityit' },
            { network: 'bluesky', href: 'https://bsky.app/profile/devcommunity.it' },
            { network: 'mastodon', href: 'https://mastodon.uno/@devcommunity' },
            { network: 'telegram', href: 'https://t.me/devcommunityit' },
          ]}
        />
      </Stack>
    </div>
  );
}
