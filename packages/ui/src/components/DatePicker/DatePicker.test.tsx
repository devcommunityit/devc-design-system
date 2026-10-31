import { CalendarDate, getLocalTimeZone, parseZonedDateTime, startOfMonth, endOfMonth, today } from '@internationalized/date';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { Form } from 'react-aria-components';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '../../../test/axe';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { ThemeProvider } from '../../theme/ThemeProvider';
import { DatePicker, DateRangePicker } from './DatePicker';

describe('DatePicker', () => {
  it('types a date by segments and keeps a CalendarDate (no time zone shift)', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { container } = render(<DatePicker label="Birth date" onChange={onChange} placeholderValue={new CalendarDate(2000, 1, 1)} />);
    const group = screen.getByRole('group', { name: 'Birth date' });
    const segments = within(group).getAllByRole('spinbutton');
    expect(segments).toHaveLength(3);
    await user.click(segments[0] ?? group);
    await user.keyboard('03152024');
    expect(onChange).toHaveBeenLastCalledWith(new CalendarDate(2024, 3, 15));
    expect(await axe(container)).toHaveNoViolations();
  });

  it('opens the calendar in the theme portal, picks a date and restores focus', async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [value, setValue] = useState<CalendarDate | null>(new CalendarDate(2025, 6, 10));
      return (
        <>
          <DatePicker<CalendarDate> label="Data" value={value} onChange={setValue} firstDayOfWeek="mon" />
          <output>{value?.toString() ?? 'none'}</output>
        </>
      );
    }
    render(
      <ThemeProvider persistence={false}>
        <LocaleProvider locale="it-IT">
          <Controlled />
        </LocaleProvider>
      </ThemeProvider>,
    );
    const button = screen.getByRole('button', { name: /Apri calendario/ });
    await user.click(button);
    const dialog = await screen.findByRole('dialog');
    expect(dialog.closest('[data-dc-portal]')).not.toBeNull();
    const headers = within(dialog).getAllByRole('columnheader', { hidden: true });
    expect(headers[0]).toHaveTextContent(/lun/i);
    expect(document.activeElement).toHaveTextContent('10');
    await user.keyboard('{ArrowRight}{Enter}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByText('2025-06-11')).toBeInTheDocument();
    await waitFor(() => expect(button).toHaveFocus());
  });

  it('validates required, min/max and preserves ZonedDateTime values', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
    const zoned = parseZonedDateTime('2025-06-10T09:30[Europe/Rome]');
    const onChange = vi.fn();
    render(
      <Form onSubmit={onSubmit}>
        <DatePicker label="Due" name="due" isRequired errorMessage="Required date" />
        <DatePicker label="Meeting" defaultValue={zoned} onChange={onChange} granularity="minute" hideTimeZone />
        <DatePicker label="Bounded" defaultValue={new CalendarDate(2025, 1, 10)} minValue={new CalendarDate(2025, 2, 1)} />
        <button type="submit">Send</button>
      </Form>,
    );
    await user.click(screen.getByRole('button', { name: 'Send' }));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText('Required date')).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Bounded' }).closest('[data-invalid]')).not.toBeNull();
    const day = within(screen.getByRole('group', { name: 'Meeting' })).getAllByRole('spinbutton')[1];
    if (!day) throw new Error('missing day segment');
    expect(day).toHaveAttribute('aria-valuenow', '10');
    await user.click(day);
    await user.keyboard('{ArrowUp}');
    await user.click(document.body);
    const next = onChange.mock.lastCall?.[0];
    expect(next?.toString()).toBe('2025-06-11T09:30:00+02:00[Europe/Rome]');
  });
});

describe('DateRangePicker', () => {
  it('selects a range in the calendar', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { container } = render(
      <DateRangePicker label="Stay" onChange={onChange} defaultValue={{ start: new CalendarDate(2025, 6, 10), end: new CalendarDate(2025, 6, 12) }} />,
    );
    expect(within(screen.getByRole('group', { name: 'Stay' })).getAllByRole('spinbutton')).toHaveLength(6);
    expect(await axe(container)).toHaveNoViolations();
    await user.click(screen.getByRole('button', { name: /Open calendar/ }));
    const dialog = await screen.findByRole('dialog');
    await user.click(within(dialog).getByRole('button', { name: /June 20, 2025/ }));
    await user.click(within(dialog).getByRole('button', { name: /June 22, 2025/ }));
    expect(onChange).toHaveBeenLastCalledWith({ start: new CalendarDate(2025, 6, 20), end: new CalendarDate(2025, 6, 22) });
  });
});
describe('DatePicker extras', () => {
  it('applies a default preset, marks it current and closes the popover', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <LocaleProvider locale="it-IT">
        <DatePicker label="Data" onChange={onChange} presets="default" />
      </LocaleProvider>,
    );
    await user.click(screen.getByRole('button', { name: /Apri calendario/ }));
    const dialog = await screen.findByRole('dialog');
    const shortcuts = within(dialog).getByRole('group', { name: 'Scorciatoie' });
    expect(within(shortcuts).getAllByRole('button').map((b) => b.textContent)).toEqual(['Oggi', 'Domani', 'Tra una settimana']);
    await user.click(within(shortcuts).getByRole('button', { name: 'Domani' }));
    expect(onChange).toHaveBeenLastCalledWith(today(getLocalTimeZone()).add({ days: 1 }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await user.click(screen.getByRole('button', { name: /Apri calendario/ }));
    const again = await screen.findByRole('dialog');
    expect(within(again).getByRole('button', { name: 'Domani' })).toHaveAttribute('aria-current', 'true');
  });

  it('disables presets outside min/max', async () => {
    const user = userEvent.setup();
    const t = today(getLocalTimeZone());
    render(<DatePicker label="Date" presets="default" maxValue={t} />);
    await user.click(screen.getByRole('button', { name: /Open calendar/ }));
    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByRole('button', { name: 'Today' })).not.toBeDisabled();
    expect(within(dialog).getByRole('button', { name: 'Tomorrow' })).toBeDisabled();
  });

  it('jumps to a month and year with the header selects', async () => {
    const user = userEvent.setup();
    render(
      <LocaleProvider locale="it-IT">
        <DatePicker label="Nascita" defaultValue={new CalendarDate(2025, 6, 10)} />
      </LocaleProvider>,
    );
    await user.click(screen.getByRole('button', { name: /Apri calendario/ }));
    const dialog = await screen.findByRole('dialog');
    const year = within(dialog).getByRole('combobox', { name: 'Anno' });
    const month = within(dialog).getByRole('combobox', { name: 'Mese' });
    fireEvent.change(year, { target: { value: '1990' } });
    fireEvent.change(month, { target: { value: '2' } });
    expect(within(dialog).getByRole('grid')).toHaveAccessibleName(/febbraio 1990/i);
  });

  it('clears the value and the range value', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const onRange = vi.fn();
    render(
      <>
        <DatePicker label="Single" defaultValue={new CalendarDate(2025, 6, 10)} onChange={onChange} isClearable />
        <DateRangePicker
          label="Range"
          defaultValue={{ start: new CalendarDate(2025, 6, 10), end: new CalendarDate(2025, 6, 12) }}
          onChange={onRange}
          isClearable
          presets="default"
        />
      </>,
    );
    const [first, second] = screen.getAllByRole('button', { name: 'Clear' });
    if (!first || !second) throw new Error('missing clear buttons');
    await user.click(first);
    expect(onChange).toHaveBeenLastCalledWith(null);
    await user.click(second);
    expect(onRange).toHaveBeenLastCalledWith(null);
  });

  it('applies a range preset', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<DateRangePicker label="Report" onChange={onChange} presets="default" />);
    await user.click(screen.getByRole('button', { name: /Open calendar/ }));
    const dialog = await screen.findByRole('dialog');
    await user.click(within(dialog).getByRole('button', { name: 'This month' }));
    const t = today(getLocalTimeZone());
    expect(onChange).toHaveBeenLastCalledWith({ start: startOfMonth(t), end: endOfMonth(t) });
  });
});
