import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { axe } from '../../../test/axe';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { getShareUrl, ShareButtons } from './ShareButtons';

const content = { url: 'https://devcommunity.it/blog/a b?x=1&y=2', title: 'React Aria & a11y', text: 'Leggi la guida!' };

function mockClipboard(writeText: (text: string) => Promise<void>) {
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
}

function mockShare(share: ((data: ShareData) => Promise<void>) | undefined) {
  Object.defineProperty(navigator, 'share', { configurable: true, writable: true, value: share });
}

describe('getShareUrl', () => {
  const u = encodeURIComponent(content.url);
  it('builds encoded intent URLs for every network', () => {
    expect(getShareUrl('linkedin', content)).toBe(`https://www.linkedin.com/sharing/share-offsite/?url=${u}`);
    expect(getShareUrl('x', content)).toBe(`https://x.com/intent/post?url=${u}&text=Leggi%20la%20guida!`);
    expect(getShareUrl('facebook', content)).toBe(`https://www.facebook.com/sharer/sharer.php?u=${u}`);
    expect(getShareUrl('whatsapp', content)).toBe(`https://wa.me/?text=${encodeURIComponent(`Leggi la guida! ${content.url}`)}`);
    expect(getShareUrl('telegram', content)).toBe(`https://t.me/share/url?url=${u}&text=Leggi%20la%20guida!`);
    expect(getShareUrl('email', content)).toBe(
      `mailto:?subject=React%20Aria%20%26%20a11y&body=${encodeURIComponent(`Leggi la guida! ${content.url}`)}`,
    );
    expect(getShareUrl('bluesky', content)).toBe(`https://bsky.app/intent/compose?text=${encodeURIComponent(`Leggi la guida! ${content.url}`)}`);
  });

  it('falls back to the title and omits empty parameters', () => {
    const url = 'https://dc.it/e';
    expect(getShareUrl('x', { url })).toBe('https://x.com/intent/post?url=https%3A%2F%2Fdc.it%2Fe');
    expect(getShareUrl('x', { url, title: 'Meetup' })).toBe('https://x.com/intent/post?url=https%3A%2F%2Fdc.it%2Fe&text=Meetup');
    expect(getShareUrl('telegram', { url })).toBe('https://t.me/share/url?url=https%3A%2F%2Fdc.it%2Fe');
    expect(getShareUrl('email', { url })).toBe('mailto:?body=https%3A%2F%2Fdc.it%2Fe');
    expect(getShareUrl('whatsapp', { url })).toBe('https://wa.me/?text=https%3A%2F%2Fdc.it%2Fe');
  });
});

describe('ShareButtons', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    mockShare(undefined);
  });

  it('renders a labelled group of share links and forwards the ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(<ShareButtons ref={ref} {...content} showNativeShare={false} />);
    const group = screen.getByRole('group', { name: 'Share' });
    expect(ref.current).toBe(group);
    const linkedin = screen.getByRole('link', { name: 'Share on LinkedIn (opens in a new tab)' });
    expect(linkedin).toHaveAttribute('href', getShareUrl('linkedin', content));
    expect(linkedin).toHaveAttribute('target', '_blank');
    expect(linkedin).toHaveAttribute('rel', 'noopener noreferrer');
    const email = screen.getByRole('link', { name: 'Share on Email' });
    expect(email).not.toHaveAttribute('target');
    expect(screen.getAllByRole('link')).toHaveLength(4);
    expect(screen.queryByRole('button', { name: 'Share' })).not.toBeInTheDocument();
  });

  it('hides the native button when navigator.share is missing', () => {
    mockShare(undefined);
    render(<ShareButtons {...content} />);
    expect(screen.queryByRole('button', { name: 'Share' })).not.toBeInTheDocument();
  });

  it('calls navigator.share and reports it', async () => {
    const user = userEvent.setup();
    const share = vi.fn().mockResolvedValue(undefined);
    mockShare(share);
    const onShare = vi.fn();
    render(<ShareButtons {...content} networks={['x']} showCopy={false} onShare={onShare} />);
    await user.click(await screen.findByRole('button', { name: 'Share' }));
    expect(share).toHaveBeenCalledWith(content);
    await waitFor(() => expect(onShare).toHaveBeenCalledWith('native'));
  });

  it('ignores a dismissed native share', async () => {
    const user = userEvent.setup();
    mockShare(vi.fn().mockRejectedValue(new DOMException('cancel', 'AbortError')));
    const onShare = vi.fn();
    render(<ShareButtons {...content} onShare={onShare} />);
    await user.click(await screen.findByRole('button', { name: 'Share' }));
    expect(onShare).not.toHaveBeenCalled();
  });

  it('copies the link, announces it and reports it', async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    mockClipboard(writeText);
    const onShare = vi.fn();
    render(<ShareButtons {...content} showNativeShare={false} onShare={onShare} />);
    const button = screen.getByRole('button', { name: 'Copy link' });
    await user.click(button);
    expect(writeText).toHaveBeenCalledWith(content.url);
    expect(onShare).toHaveBeenCalledWith('copy');
    expect(screen.getByRole('status')).toHaveTextContent('Link copied');
    expect(button).toHaveAttribute('data-status', 'copied');
    expect(button).toHaveAccessibleName('Link copied');
  });

  it('reports network presses and shows names in the pill variant', async () => {
    const user = userEvent.setup();
    const onShare = vi.fn();
    render(<ShareButtons {...content} variant="pill" networks={['email']} showCopy={false} onShare={onShare} />);
    const link = screen.getByRole('link', { name: 'Share on Email' });
    expect(link).toHaveTextContent('Email');
    link.addEventListener('click', (event) => event.preventDefault());
    await user.click(link);
    expect(onShare).toHaveBeenCalledWith('email');
  });

  it('localizes labels', () => {
    render(
      <LocaleProvider locale="it-IT">
        <ShareButtons {...content} showNativeShare={false} networks={['linkedin']} />
      </LocaleProvider>,
    );
    expect(screen.getByRole('group', { name: 'Condividi' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Condividi su LinkedIn (si apre in una nuova scheda)' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Copia link' })).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    mockShare(vi.fn().mockResolvedValue(undefined));
    const { container } = render(
      <div>
        <ShareButtons {...content} />
        <ShareButtons {...content} variant="pill" tone="brand" aria-label="Share the article" />
      </div>,
    );
    await screen.findAllByRole('button', { name: 'Share' });
    expect(await axe(container)).toHaveNoViolations();
  });
});
