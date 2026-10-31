import { render, screen } from '@testing-library/react';
import { createRef, type ReactElement } from 'react';
import { describe, expect, it } from 'vitest';
import { axe } from '../../../test/axe';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { DateBadge } from './DateBadge';

const it_ = (ui: ReactElement) => render(<LocaleProvider locale="it-IT">{ui}</LocaleProvider>);

describe('DateBadge', () => {
  it('renders a <time> with ISO dateTime, short visual parts and the full date for assistive tech', () => {
    const ref = createRef<HTMLTimeElement>();
    const { container } = it_(<DateBadge ref={ref} date="2026-11-12" data-testid="d" />);
    const time = container.querySelector('time');
    expect(ref.current).toBe(time);
    expect(time).toHaveAttribute('datetime', '2026-11-12');
    expect(time).toHaveAttribute('data-variant', 'solid');
    expect(time).toHaveAttribute('data-size', 'md');
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('nov')).toBeInTheDocument();
    expect(screen.getByText('giovedì 12 novembre 2026')).toBeInTheDocument();
    expect(container.querySelector('[aria-hidden="true"]')).toHaveTextContent('12nov');
  });

  it('accepts Date and CalendarDate-like objects and shows the weekday', () => {
    const { container, rerender } = render(
      <LocaleProvider locale="en-US">
        <DateBadge date={{ year: 2027, month: 1, day: 15 }} showWeekday variant="gradient" size="sm" />
      </LocaleProvider>,
    );
    expect(container.querySelector('time')).toHaveAttribute('datetime', '2027-01-15');
    expect(container.querySelector('time')).toHaveAttribute('data-variant', 'gradient');
    expect(screen.getByText('Fri')).toBeInTheDocument();
    expect(screen.getByText('Jan')).toBeInTheDocument();
    rerender(
      <LocaleProvider locale="en-US">
        <DateBadge date={new Date(2026, 2, 5, 23, 30)} />
      </LocaleProvider>,
    );
    expect(container.querySelector('time')).toHaveAttribute('datetime', '2026-03-05');
  });

  it('reads the day in the given time zone', () => {
    const { container } = it_(<DateBadge date={new Date('2026-11-12T23:30:00Z')} timeZone="Asia/Tokyo" />);
    expect(container.querySelector('time')).toHaveAttribute('datetime', '2026-11-13');
  });

  it('renders nothing for invalid dates', () => {
    const { container } = it_(<DateBadge date="not a date" />);
    expect(container.querySelector('time')).toBeNull();
  });

  it('has no axe violations', async () => {
    const { container } = it_(
      <div>
        <DateBadge date="2026-11-12" />
        <DateBadge date="2026-11-27" variant="gradient" showWeekday />
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
