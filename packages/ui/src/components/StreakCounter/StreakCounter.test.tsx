import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from '../../../test/axe';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { StreakCounter } from './StreakCounter';

describe('StreakCounter', () => {
  it('shows localized counts, singular/plural copy and an optional record', () => {
    render(
      <LocaleProvider locale="en-US">
        <StreakCounter days={7} longestStreak={21} />
      </LocaleProvider>,
    );
    expect(screen.getByRole('heading', { name: 'Current streak' })).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
    expect(screen.getByText('days')).toBeInTheDocument();
    expect(screen.getByText('Longest streak')).toBeInTheDocument();
    expect(screen.getByText('21 days')).toBeInTheDocument();
  });

  it('uses singular copy for one day and has no axe violations', async () => {
    const { container } = render(
      <LocaleProvider locale="en-US">
        <StreakCounter days={1} dayLabel="day" daysLabel="days" />
      </LocaleProvider>,
    );
    expect(screen.getByText('day')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
});
