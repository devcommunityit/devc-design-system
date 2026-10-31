import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, type ReactElement } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '../../../test/axe';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { AnnouncementPill } from './AnnouncementPill';

const it_ = (ui: ReactElement) => render(<LocaleProvider locale="it-IT">{ui}</LocaleProvider>);

describe('AnnouncementPill', () => {
  it('renders a link with the localized badge, text and a decorative arrow', () => {
    const ref = createRef<HTMLElement>();
    const { container } = it_(
      <AnnouncementPill ref={ref} href="/cfs">
        Call for Speaker aperta
      </AnnouncementPill>,
    );
    const link = screen.getByRole('link', { name: 'Nuovo Call for Speaker aperta' });
    expect(ref.current).toBe(link);
    expect(link).toHaveAttribute('href', '/cfs');
    expect(link).toHaveAttribute('data-tone', 'brand');
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders a button with onPress', async () => {
    const onPress = vi.fn();
    it_(
      <AnnouncementPill onPress={onPress} tone="inverse">
        Novità
      </AnnouncementPill>,
    );
    const button = screen.getByRole('button', { name: 'Nuovo Novità' });
    expect(button).toHaveAttribute('data-tone', 'inverse');
    await userEvent.click(button);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('renders static text without arrow, with a custom or hidden badge', () => {
    const { container, rerender } = it_(
      <AnnouncementPill badge="Beta" data-testid="pill">
        Forum in anteprima
      </AnnouncementPill>,
    );
    const pill = screen.getByTestId('pill');
    expect(pill.tagName).toBe('SPAN');
    expect(pill).toHaveTextContent('Beta Forum in anteprima');
    expect(pill).not.toHaveAttribute('data-interactive');
    expect(container.querySelector('svg')).toBeNull();
    expect(screen.queryByRole('link')).toBeNull();
    rerender(
      <LocaleProvider locale="it-IT">
        <AnnouncementPill badge={null} data-testid="pill">
          Solo testo
        </AnnouncementPill>
      </LocaleProvider>,
    );
    expect(screen.getByTestId('pill')).toHaveTextContent(/^Solo testo$/);
  });

  it('has no axe violations', async () => {
    const { container } = it_(
      <div>
        <AnnouncementPill href="/cfs">Call for Speaker aperta</AnnouncementPill>
        <AnnouncementPill onPress={() => undefined}>Azione</AnnouncementPill>
        <AnnouncementPill>Statica</AnnouncementPill>
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
