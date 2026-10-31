import { Time } from '@internationalized/date';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '../../../test/axe';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { TimePicker } from './TimePicker';

const it_ = (ui: React.ReactNode) => render(<LocaleProvider locale="it-IT">{ui}</LocaleProvider>);

describe('TimePicker', () => {
  it('picks a slot from the popover, closes it and restores focus', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { container } = it_(<TimePicker label="Orario" defaultValue={new Time(9, 0)} onChange={onChange} />);
    expect(await axe(container)).toHaveNoViolations();
    const trigger = screen.getByRole('button', { name: 'Scegli orario' });
    await user.click(trigger);
    const list = await screen.findByRole('listbox', { name: 'Orari' });
    expect(within(list).getAllByRole('option')).toHaveLength(48);
    expect(within(list).getByRole('option', { name: '09:00' })).toHaveAttribute('aria-selected', 'true');
    await user.click(within(list).getByRole('option', { name: '14:30' }));
    expect(onChange).toHaveBeenLastCalledWith(new Time(14, 30));
    await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument());
    await waitFor(() => expect(trigger).toHaveFocus());
    const segments = within(screen.getByRole('group', { name: 'Orario' })).getAllByRole('spinbutton');
    expect(segments[0]).toHaveAttribute('aria-valuenow', '14');
  });

  it('disables slots outside min/max and unavailable ones; honours the step', async () => {
    const user = userEvent.setup();
    it_(
      <TimePicker
        label="Apertura"
        step={60}
        minValue={new Time(8, 0)}
        maxValue={new Time(18, 0)}
        isTimeUnavailable={(t) => t.hour === 13}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Scegli orario' }));
    const list = await screen.findByRole('listbox');
    expect(within(list).getAllByRole('option')).toHaveLength(24);
    expect(within(list).getByRole('option', { name: '07:00' })).toHaveAttribute('aria-disabled', 'true');
    expect(within(list).getByRole('option', { name: '13:00' })).toHaveAttribute('aria-disabled', 'true');
    expect(within(list).getByRole('option', { name: '18:00' })).not.toHaveAttribute('aria-disabled');
    expect(within(list).getByRole('option', { name: '19:00' })).toHaveAttribute('aria-disabled', 'true');
  });

  it('opens with Alt+ArrowDown, clears with the clear button and is controlled', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    it_(<TimePicker label="Sveglia" value={new Time(7, 15)} onChange={onChange} isClearable />);
    const segments = within(screen.getByRole('group', { name: 'Sveglia' })).getAllByRole('spinbutton');
    segments[0]?.focus();
    await user.keyboard('{Alt>}{ArrowDown}{/Alt}');
    const list = await screen.findByRole('listbox');
    // An off-grid value is still listed and selected.
    expect(within(list).getByRole('option', { name: '07:15' })).toHaveAttribute('aria-selected', 'true');
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument());
    await user.click(screen.getByRole('button', { name: 'Cancella' }));
    expect(onChange).toHaveBeenLastCalledWith(null);
  });

  it('disables the popover button when read-only', () => {
    it_(<TimePicker label="Fisso" defaultValue={new Time(10, 0)} isReadOnly />);
    expect(screen.getByRole('button', { name: 'Scegli orario' })).toBeDisabled();
  });
});
