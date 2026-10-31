import { render, screen } from '@testing-library/react';
import { createRef, type ReactElement } from 'react';
import { describe, expect, it } from 'vitest';
import { axe } from '../../../test/axe';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { AchievementBadge, AchievementBadgeGroup } from './AchievementBadge';

const en = (ui: ReactElement) => render(<LocaleProvider locale="en-US">{ui}</LocaleProvider>);
const icon = <svg data-testid="icon" />;

describe('AchievementBadge', () => {
  it('renders title, tier name, earned date, ref and DOM props', () => {
    const ref = createRef<HTMLDivElement>();
    en(
      <AchievementBadge
        ref={ref}
        data-testid="a"
        icon={icon}
        title="First talk"
        tier="gold"
        description="Spoke at a meetup"
        earnedAt={new Date(2026, 2, 12)}
      />,
    );
    const root = screen.getByTestId('a');
    expect(ref.current).toBe(root);
    expect(root).toHaveAttribute('data-tier', 'gold');
    expect(root).toHaveAttribute('data-shape', 'hexagon');
    expect(root).toHaveAttribute('data-size', 'md');
    expect(root).toHaveAttribute('data-layout', 'stacked');
    expect(root).not.toHaveAttribute('data-locked');
    expect(screen.getByText('First talk')).toBeInTheDocument();
    expect(screen.getByText('Gold')).toBeInTheDocument();
    expect(screen.getByText('Earned on Mar 12, 2026')).toBeInTheDocument();
    expect(screen.getByTestId('icon').closest('[aria-hidden="true"]')).not.toBeNull();
  });

  it('localizes tier and date, and uses tierLabel for the brand tier', () => {
    render(
      <LocaleProvider locale="it-IT">
        <AchievementBadge icon={icon} title="Primo talk" tier="silver" earnedAt="2026-03-12T10:00:00" />
        <AchievementBadge icon={icon} title="Fondatore" tierLabel="Founder" headingLevel={3} />
        <AchievementBadge icon={icon} title="Senza nome" earnedAt="not a date" />
      </LocaleProvider>,
    );
    expect(screen.getByText('Argento')).toBeInTheDocument();
    expect(screen.getByText('Ottenuto il 12 mar 2026')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Fondatore' })).toBeInTheDocument();
    expect(screen.getByText('Founder')).toBeInTheDocument();
    expect(screen.getAllByText(/Ottenuto/)).toHaveLength(1);
  });

  it('shows locked state with progress and hides the earned date', () => {
    en(
      <AchievementBadge
        data-testid="a"
        icon={icon}
        title="10 pull requests"
        tier="bronze"
        isLocked
        earnedAt={new Date(2026, 0, 1)}
        progress={{ value: 6, max: 10 }}
      />,
    );
    expect(screen.getByTestId('a')).toHaveAttribute('data-locked', 'true');
    expect(screen.getByText('Locked')).toBeInTheDocument();
    expect(screen.getByText('Bronze')).toBeInTheDocument();
    expect(screen.queryByText(/Earned on/)).not.toBeInTheDocument();
    const bar = screen.getByRole('progressbar', { name: /10 pull requests/ });
    expect(bar).toHaveAttribute('aria-valuenow', '6');
    expect(bar).toHaveAttribute('aria-valuemax', '10');
    expect(bar).toHaveAttribute('aria-valuetext', '6 / 10');
  });

  it('renders a group as a list of items without axe violations', async () => {
    const { container } = en(
      <AchievementBadgeGroup aria-label="Earned badges" data-testid="g">
        <AchievementBadge icon={icon} title="Author" tier="platinum" shape="circle" size="sm" />
        <AchievementBadge icon={icon} title="Mentor" tier="gold" isLocked progress={{ value: 1, max: 3 }} layout="inline" size="lg" />
      </AchievementBadgeGroup>,
    );
    expect(screen.getByRole('list', { name: 'Earned badges' })).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(await axe(container)).toHaveNoViolations();
  });
});
