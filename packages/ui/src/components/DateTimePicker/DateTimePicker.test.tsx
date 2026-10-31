import { CalendarDateTime, getLocalTimeZone, parseZonedDateTime, today } from '@internationalized/date';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '../../../test/axe';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { DateTimePicker } from './DateTimePicker';

const it_ = (ui: React.ReactNode) => render(<LocaleProvider locale="it-IT">{ui}</LocaleProvider>);

describe('DateTimePicker', () => {
  it('shows date and time segments in one field and has no a11y violations', async () => {
    const { container } = it_(<DateTimePicker label="Appuntamento" defaultValue={new CalendarDateTime(2025, 6, 10, 9, 30)} />);
    const segments = within(screen.getByRole('group', { name: 'Appuntamento' })).getAllByRole('spinbutton');
    expect(segments).toHaveLength(5);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('picks a date then a time in the same popover, which stays open until Done', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    it_(<DateTimePicker label="Inizio" onChange={onChange} placeholderValue={new CalendarDateTime(2025, 6, 1, 0, 0)} />);
    await user.click(screen.getByRole('button', { name: /Apri calendario/ }));
    const dialog = await screen.findByRole('dialog');
    await user.click(within(dialog).getByRole('button', { name: /\b12 giugno 2025/ }));
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await user.click(within(dialog).getByRole('option', { name: '14:30' }));
    expect(onChange).toHaveBeenLastCalledWith(new CalendarDateTime(2025, 6, 12, 14, 30));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await user.click(within(dialog).getByRole('button', { name: 'Fatto' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('keeps the time when the day changes and the zone when the time changes', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    it_(<DateTimePicker label="Riunione" defaultValue={parseZonedDateTime('2025-06-10T09:30[Europe/Rome]')} onChange={onChange} hideTimeZone />);
    await user.click(screen.getByRole('button', { name: /Apri calendario/ }));
    const dialog = await screen.findByRole('dialog');
    await user.click(within(dialog).getByRole('button', { name: /\b11 giugno 2025/ }));
    expect(onChange.mock.lastCall?.[0].toString()).toBe('2025-06-11T09:30:00+02:00[Europe/Rome]');
    await user.click(within(dialog).getByRole('option', { name: '16:00' }));
    expect(onChange.mock.lastCall?.[0].toString()).toBe('2025-06-11T16:00:00+02:00[Europe/Rome]');
  });

  it('disables slots before minValue on the minimum day and unavailable times', async () => {
    const user = userEvent.setup();
    it_(
      <DateTimePicker
        label="Consegna"
        defaultValue={new CalendarDateTime(2025, 6, 10, 12, 0)}
        minValue={new CalendarDateTime(2025, 6, 10, 10, 0)}
        isTimeUnavailable={(t) => t.hour === 13}
        timeStep={60}
      />,
    );
    await user.click(screen.getByRole('button', { name: /Apri calendario/ }));
    const dialog = await screen.findByRole('dialog');
    const list = within(dialog).getByRole('listbox', { name: 'Scegli orario' });
    expect(within(list).getAllByRole('option')).toHaveLength(24);
    expect(within(list).getByRole('option', { name: '09:00' })).toHaveAttribute('aria-disabled', 'true');
    expect(within(list).getByRole('option', { name: '10:00' })).not.toHaveAttribute('aria-disabled');
    expect(within(list).getByRole('option', { name: '13:00' })).toHaveAttribute('aria-disabled', 'true');
    expect(within(list).getByRole('option', { name: '12:00' })).toHaveAttribute('aria-selected', 'true');
  });

  it('sets now with the Now button and applies presets keeping the time', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    it_(<DateTimePicker label="Promemoria" defaultValue={new CalendarDateTime(2025, 6, 10, 8, 15)} onChange={onChange} presets="default" />);
    await user.click(screen.getByRole('button', { name: /Apri calendario/ }));
    let dialog = await screen.findByRole('dialog');
    await user.click(within(within(dialog).getByRole('group', { name: 'Scorciatoie' })).getByRole('button', { name: 'Domani' }));
    const tomorrow = today(getLocalTimeZone()).add({ days: 1 });
    expect(onChange).toHaveBeenLastCalledWith(new CalendarDateTime(tomorrow.year, tomorrow.month, tomorrow.day, 8, 15));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());

    await user.click(screen.getByRole('button', { name: /Apri calendario/ }));
    dialog = await screen.findByRole('dialog');
    await user.click(within(dialog).getByRole('button', { name: 'Adesso' }));
    const value = onChange.mock.lastCall?.[0] as CalendarDateTime;
    const now = today(getLocalTimeZone());
    expect(value).toBeInstanceOf(CalendarDateTime);
    expect([value.year, value.month, value.day]).toEqual([now.year, now.month, now.day]);
    expect(value.second).toBe(0);
  });

  it('clears the value with the clear button', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    it_(<DateTimePicker label="Scadenza" defaultValue={new CalendarDateTime(2025, 6, 10, 8, 0)} onChange={onChange} isClearable />);
    await user.click(screen.getByRole('button', { name: 'Cancella' }));
    expect(onChange).toHaveBeenLastCalledWith(null);
    expect(screen.queryByRole('button', { name: 'Cancella' })).not.toBeInTheDocument();
    expect(within(screen.getByRole('group', { name: 'Scadenza' })).getAllByRole('spinbutton')[0]).toHaveFocus();
  });

  it('commits only when both date and time are chosen, in any order', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    it_(<DateTimePicker label="Evento" onChange={onChange} placeholderValue={new CalendarDateTime(2025, 6, 1, 0, 0)} />);
    await user.click(screen.getByRole('button', { name: /Apri calendario/ }));
    const dialog = await screen.findByRole('dialog');
    await user.click(within(dialog).getByRole('option', { name: '10:00' }));
    expect(onChange).not.toHaveBeenCalled();
    await user.click(within(dialog).getByRole('button', { name: /\b3 giugno 2025/ }));
    expect(onChange).toHaveBeenLastCalledWith(new CalendarDateTime(2025, 6, 3, 10, 0));
  });
});
