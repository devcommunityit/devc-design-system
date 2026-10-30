import { CalendarDate, isWeekend, type DateValue } from '@internationalized/date';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '../../../test/axe';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { Calendar, RangeCalendar } from './Calendar';

const june = new CalendarDate(2025, 6, 10);

describe('Calendar', () => {
  it('renders a localized month grid with configurable first day of week', async () => {
    const { container } = render(
      <LocaleProvider locale="it-IT">
        <Calendar aria-label="Data consegna" defaultValue={june} firstDayOfWeek="sun" />
      </LocaleProvider>,
    );
    expect(screen.getByRole('heading', { name: /giugno 2025/i })).toBeInTheDocument();
    const headers = within(screen.getByRole('grid')).getAllByRole('columnheader', { hidden: true });
    expect(headers).toHaveLength(7);
    expect(headers[0]).toHaveTextContent(/dom/i);
    expect(screen.getByRole('button', { name: 'Mese precedente' })).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('selects with the keyboard without shifting the calendar day (uncontrolled)', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Calendar aria-label="Date" defaultValue={june} onChange={onChange} />);
    await user.tab();
    await user.tab();
    await user.tab();
    expect(document.activeElement).toHaveTextContent('10');
    await user.keyboard('{ArrowRight}{ArrowDown}{Enter}');
    const value: DateValue | undefined = onChange.mock.lastCall?.[0];
    expect(value?.toString()).toBe('2025-06-18');
    expect(value).toBeInstanceOf(CalendarDate);
  });

  it('respects min/max, unavailable dates and controlled value', async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [value, setValue] = useState<CalendarDate | null>(null);
      return (
        <>
          <Calendar<CalendarDate>
            aria-label="Booking"
            value={value}
            onChange={setValue}
            focusedValue={june}
            minValue={new CalendarDate(2025, 6, 5)}
            maxValue={new CalendarDate(2025, 6, 25)}
            isDateUnavailable={(d) => isWeekend(d, 'it-IT')}
          />
          <output>{value?.toString() ?? 'none'}</output>
        </>
      );
    }
    render(<Controlled />);
    const cell = (name: RegExp) => screen.getByRole('button', { name });
    expect(cell(/June 4, 2025/)).toHaveAttribute('aria-disabled', 'true');
    expect(cell(/June 26, 2025/)).toHaveAttribute('aria-disabled', 'true');
    const saturday = cell(/Saturday, June 14, 2025/);
    await user.click(saturday);
    expect(screen.getByText('none')).toBeInTheDocument();
    await user.click(cell(/June 16, 2025/));
    expect(screen.getByText('2025-06-16')).toBeInTheDocument();
  });
});

describe('RangeCalendar', () => {
  it('selects a range with two clicks', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<RangeCalendar aria-label="Stay" defaultFocusedValue={june} onChange={onChange} visibleMonths={2} />);
    expect(screen.getAllByRole('grid')).toHaveLength(2);
    await user.click(screen.getByRole('button', { name: /June 10, 2025/ }));
    const julyGrid = screen.getAllByRole('grid')[1];
    if (!julyGrid) throw new Error('second month not rendered');
    await user.click(within(julyGrid).getByRole('button', { name: /July 2, 2025/ }));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith({ start: new CalendarDate(2025, 6, 10), end: new CalendarDate(2025, 7, 2) });
  });
});