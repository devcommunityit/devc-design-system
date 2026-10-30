import { act, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { RelativeTime, selectRelativeUnit } from './RelativeTime';

const NOW = Date.parse('2025-03-12T10:00:00Z');

describe('selectRelativeUnit', () => {
  it('picks the largest fitting unit', () => {
    expect(selectRelativeUnit(-30_000)).toEqual({ value: -30, unit: 'second' });
    expect(selectRelativeUnit(-90 * 60_000)).toEqual({ value: -2, unit: 'hour' });
    expect(selectRelativeUnit(24 * 3600_000)).toEqual({ value: 1, unit: 'day' });
    expect(selectRelativeUnit(-10 * 24 * 3600_000)).toEqual({ value: -1, unit: 'week' });
    expect(selectRelativeUnit(-400 * 24 * 3600_000)).toEqual({ value: -1, unit: 'year' });
    expect(selectRelativeUnit(0)).toEqual({ value: 0, unit: 'second' });
  });
});

describe('RelativeTime', () => {
  afterEach(() => vi.useRealTimers());

  it('renders a time element with ISO datetime and absolute title', () => {
    const ref = createRef<HTMLTimeElement>();
    render(<RelativeTime ref={ref} date="2025-03-12T09:57:00Z" now={NOW} data-testid="t" />);
    const time = screen.getByTestId('t');
    expect(ref.current).toBe(time);
    expect(time.tagName).toBe('TIME');
    expect(time).toHaveAttribute('datetime', '2025-03-12T09:57:00.000Z');
    expect(time).toHaveTextContent('3 minutes ago');
    expect(time.getAttribute('title')).toMatch(/2025/);
  });

  it('localizes with numeric auto and accepts Date and epoch inputs', () => {
    const { rerender } = render(
      <LocaleProvider locale="it-IT">
        <RelativeTime date={new Date(NOW - 24 * 3600_000)} now={NOW} data-testid="t" />
      </LocaleProvider>,
    );
    expect(screen.getByTestId('t')).toHaveTextContent('ieri');
    rerender(
      <LocaleProvider locale="it-IT">
        <RelativeTime date={NOW - 24 * 3600_000} now={NOW} numeric="always" data-testid="t" />
      </LocaleProvider>,
    );
    expect(screen.getByTestId('t')).toHaveTextContent('1 giorno fa');
  });

  it('updates on an interval when now is not provided', () => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
    render(<RelativeTime date={NOW} updateInterval={60_000} data-testid="t" />);
    expect(screen.getByTestId('t')).toHaveTextContent('now');
    act(() => {
      vi.advanceTimersByTime(2 * 60_000);
    });
    expect(screen.getByTestId('t')).toHaveTextContent('2 minutes ago');
  });

  it('renders nothing (and warns) for invalid dates', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const { container } = render(<RelativeTime date="not a date" now={NOW} />);
    expect(container).toBeEmptyDOMElement();
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });
});
