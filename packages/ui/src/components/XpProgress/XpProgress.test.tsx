import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from '../../../test/axe';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { XpProgress } from './XpProgress';

describe('XpProgress', () => {
  it('formats XP and uses the existing progressbar pattern', () => {
    render(
      <LocaleProvider locale="en-US">
        <XpProgress label="XP to next level" currentXp={740} targetXp={1000} level={12} />
      </LocaleProvider>,
    );
    expect(screen.getByText('Level 12')).toBeInTheDocument();
    expect(screen.getByRole('progressbar', { name: 'XP to next level' })).toHaveAttribute('aria-valuenow', '740');
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '1000');
    expect(screen.getByText('740 / 1,000 XP')).toBeInTheDocument();
  });

  it('handles invalid and out-of-range values accessibly', async () => {
    const { container } = render(
      <LocaleProvider locale="en-US">
        <XpProgress label="XP progress" currentXp={-5} targetXp={0} />
      </LocaleProvider>,
    );
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
    expect(await axe(container)).toHaveNoViolations();
  });
});
