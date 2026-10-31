import { render, screen, within } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { axe } from '../../../test/axe';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { getSocialNetwork, socialNetworks } from './networks';
import { SocialLinks, type SocialLinkItem } from './SocialLinks';

const items: SocialLinkItem[] = [
  { network: 'github', href: 'https://github.com/dev-community' },
  { network: 'linkedin', href: 'https://www.linkedin.com/company/dev-community' },
  { network: 'email', href: 'mailto:ciao@devcommunity.it' },
];

describe('SocialLinks', () => {
  it('renders a labelled list of icon links with hidden names and forwards the ref', () => {
    const ref = createRef<HTMLUListElement>();
    render(<SocialLinks ref={ref} aria-label="Follow us" data-testid="social" items={items} />);
    const list = screen.getByRole('list', { name: 'Follow us' });
    expect(ref.current).toBe(list);
    expect(list).toHaveAttribute('data-testid', 'social');
    expect(within(list).getAllByRole('listitem')).toHaveLength(3);
    const github = screen.getByRole('link', { name: 'GitHub profile (opens in a new tab)' });
    expect(github).toHaveAttribute('href', 'https://github.com/dev-community');
    expect(github).toHaveAttribute('target', '_blank');
    expect(github).toHaveAttribute('rel', 'noopener noreferrer');
    expect(github).toHaveAttribute('data-network', 'github');
    expect(github.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('keeps mailto links in the same tab', () => {
    render(<SocialLinks aria-label="Contacts" items={items} />);
    const email = screen.getByRole('link', { name: 'Email profile' });
    expect(email).not.toHaveAttribute('target');
    expect(email).not.toHaveAttribute('rel');
  });

  it('shows names in pill and list variants and honours label and icon overrides', () => {
    render(
      <SocialLinks
        aria-label="Social"
        variant="list"
        openInNewTab={false}
        items={[
          { network: 'youtube', href: 'https://youtube.com/@dc' },
          { network: 'rss', href: '/feed.xml', label: 'Article feed', icon: <span data-testid="custom-icon" /> },
        ]}
      />,
    );
    const youtube = screen.getByRole('link', { name: 'YouTube' });
    expect(youtube).not.toHaveAttribute('target');
    expect(screen.getByRole('link', { name: 'Article feed' })).toContainElement(screen.getByTestId('custom-icon'));
    expect(screen.getByRole('list')).toHaveAttribute('data-variant', 'list');
  });

  it('localizes accessible names', () => {
    render(
      <LocaleProvider locale="it-IT">
        <SocialLinks aria-label="Seguici" items={items.slice(0, 1)} />
      </LocaleProvider>,
    );
    expect(screen.getByRole('link', { name: 'Profilo GitHub (si apre in una nuova scheda)' })).toBeInTheDocument();
  });

  it('falls back to a generic icon and capitalised name for custom networks', () => {
    expect(getSocialNetwork('github')).toBe(socialNetworks.github);
    expect(getSocialNetwork('codepen').name).toBe('Codepen');
    render(<SocialLinks aria-label="Social" variant="pill" items={[{ network: 'codepen', href: 'https://codepen.io/dc' }]} />);
    expect(screen.getByRole('link', { name: 'Codepen (opens in a new tab)' })).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <div>
        <SocialLinks aria-label="Icons" items={items} />
        <SocialLinks aria-label="Pills" variant="pill" tone="brand" items={items} />
        <SocialLinks aria-label="Footer" variant="list" tone="inverse" size="sm" items={items} />
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
