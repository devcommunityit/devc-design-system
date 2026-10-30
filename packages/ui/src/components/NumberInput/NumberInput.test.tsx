import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { axe } from '../../../test/axe';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { NumberInput } from './NumberInput';

describe('NumberInput', () => {
  it('steps with buttons and arrow keys, clamped to min/max', async () => {
    const user = userEvent.setup();
    const { container } = render(<NumberInput label="Guests" defaultValue={1} minValue={1} maxValue={3} />);
    const input = screen.getByRole('textbox', { name: 'Guests' });
    const inc = screen.getByRole('button', { name: /Increase/ });
    const dec = screen.getByRole('button', { name: /Decrease/ });
    expect(dec).toBeDisabled();
    await user.click(inc);
    expect(input).toHaveValue('2');
    await user.click(input);
    await user.keyboard('{ArrowUp}{ArrowUp}{ArrowUp}');
    expect(input).toHaveValue('3');
    expect(inc).toBeDisabled();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('formats with the locale and works controlled', async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [v, setV] = useState(1234.5);
      return (
        <>
          <NumberInput label="Prezzo" value={v} onChange={setV} formatOptions={{ style: 'currency', currency: 'EUR' }} />
          <output>{v}</output>
        </>
      );
    }
    render(
      <LocaleProvider locale="it-IT">
        <Controlled />
      </LocaleProvider>,
    );
    const input = screen.getByRole('textbox', { name: 'Prezzo' });
    expect((input as HTMLInputElement).value).toMatch(/1234,50\s€/);
    await user.clear(input);
    await user.type(input, '10{Tab}');
    expect(screen.getByRole('status')).toHaveTextContent('10');
  });
});