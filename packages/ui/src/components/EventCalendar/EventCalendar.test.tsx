import { parseDate } from '@internationalized/date';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '../../../test/axe';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { EventCalendar } from './EventCalendar';

describe('EventCalendar', () => {
  it('navigates periods, changes view and shows multi-day events', async () => {
    const user = userEvent.setup();
    const onEventPress = vi.fn();
    const { container } = render(
      <LocaleProvider locale="en-US">
        <EventCalendar aria-label="Events" defaultDate={parseDate('2026-11-12')} events={[
          { id: 'workshop', title: 'Workshop', startDate: parseDate('2026-11-12'), endDate: parseDate('2026-11-13') },
        ]} onEventPress={onEventPress} />
      </LocaleProvider>,
    );
    expect(screen.getAllByRole('button', { name: 'Workshop' })).toHaveLength(2);
    await user.click(screen.getAllByRole('button', { name: 'Workshop' })[0]!);
    expect(onEventPress).toHaveBeenCalledWith(expect.objectContaining({ id: 'workshop' }));
    await user.selectOptions(screen.getByRole('combobox', { name: 'View' }), 'day');
    expect(within(screen.getByRole('table')).getAllByRole('button', { name: 'Workshop' })).toHaveLength(1);
    await user.click(screen.getByRole('button', { name: 'Next period' }));
    expect(screen.getByRole('status')).toHaveTextContent('November 13, 2026');
    expect(await axe(container)).toHaveNoViolations();
  });

  it('rejects events whose end precedes their start', () => {
    expect(() => render(<EventCalendar aria-label="Events" events={[{ id: 'bad', title: 'Bad', startDate: parseDate('2026-11-13'), endDate: parseDate('2026-11-12') }]} />)).toThrow(/endDate precedes startDate/);
  });
});
