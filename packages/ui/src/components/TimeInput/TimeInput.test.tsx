import { Time } from '@internationalized/date';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '../../../test/axe';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { TimeInput } from './TimeInput';

describe('TimeInput', () => {
  it('uses a 24h clock in it-IT and edits segments with the keyboard', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { container } = render(
      <LocaleProvider locale="it-IT">
        <TimeInput label="Orario" defaultValue={new Time(9, 30)} onChange={onChange} />
      </LocaleProvider>,
    );
    const segments = within(screen.getByRole('group', { name: 'Orario' })).getAllByRole('spinbutton');
    expect(segments).toHaveLength(2);
    segments[0]?.focus();
    await user.keyboard('{ArrowUp}');
    expect(onChange).toHaveBeenLastCalledWith(new Time(10, 30));
    expect(await axe(container)).toHaveNoViolations();
  });

  it('shows a day period segment in en-US and supports disabled', () => {
    render(<TimeInput label="Start" defaultValue={new Time(14, 0)} isDisabled />);
    const segments = within(screen.getByRole('group', { name: 'Start' })).getAllByRole('spinbutton');
    expect(segments).toHaveLength(3);
    expect(segments[0]).toHaveAttribute('aria-disabled', 'true');
  });
});