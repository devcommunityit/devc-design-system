import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '../../../test/axe';
import { Countdown } from './Countdown';

describe('Countdown', () => {
  it('shows time units for a future target and expired content otherwise', () => {
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'));
    const { rerender } = render(<Countdown label="Starts soon" targetDate="2026-01-02T00:00:00Z" />);
    expect(screen.getByText('Days')).toBeInTheDocument();
    expect(screen.getByText('01')).toBeInTheDocument();
    rerender(<Countdown targetDate="2025-01-01T00:00:00Z" expiredContent="Started" />);
    expect(screen.getByText('Started')).toBeInTheDocument();
    vi.useRealTimers();
  });

  it('has no axe violations', async () => {
    const { container } = render(<Countdown targetDate="2030-01-01T00:00:00Z" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
