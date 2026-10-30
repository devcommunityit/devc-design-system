import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '../../../test/axe';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { PinInput } from './PinInput';

const cells = () => screen.getAllByRole('textbox');

describe('PinInput', () => {
  it('is a labelled group of named inputs that advances while typing', async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn();
    const onChange = vi.fn();
    const ref = createRef<HTMLDivElement>();
    const { container } = render(
      <PinInput ref={ref} label="Verification code" description="Sent by SMS" length={4} onChange={onChange} onComplete={onComplete} />,
    );
    const group = screen.getByRole('group', { name: 'Verification code' });
    expect(group).toHaveAccessibleDescription('Sent by SMS');
    expect(ref.current).toContainElement(group);
    expect(cells()).toHaveLength(4);
    expect(cells()[0]).toHaveAccessibleName('Character 1 of 4');
    expect(cells()[0]).toHaveAttribute('autocomplete', 'one-time-code');
    expect(cells()[0]).toHaveAttribute('inputmode', 'numeric');
    await user.click(cells()[0]!);
    await user.keyboard('1a2');
    expect(cells()[2]).toHaveFocus();
    expect(onChange).toHaveBeenLastCalledWith('12');
    await user.keyboard('34');
    expect(onComplete).toHaveBeenCalledWith('1234');
    expect(cells().map((c) => (c as HTMLInputElement).value)).toEqual(['1', '2', '3', '4']);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('handles Backspace, arrows and keeps the value contiguous', async () => {
    const user = userEvent.setup();
    render(<PinInput aria-label="PIN" length={4} defaultValue="12" />);
    await user.click(cells()[3]!);
    expect(cells()[2]).toHaveFocus();
    await user.keyboard('{Backspace}');
    expect(cells()[1]).toHaveFocus();
    expect((cells()[1] as HTMLInputElement).value).toBe('');
    await user.keyboard('{ArrowLeft}');
    expect(cells()[0]).toHaveFocus();
    await user.keyboard('{End}');
    expect(cells()[1]).toHaveFocus();
    await user.keyboard('{Home}');
    expect(cells()[0]).toHaveFocus();
  });

  it('fills every position on paste and ignores invalid characters', () => {
    const onComplete = vi.fn();
    render(<PinInput aria-label="Code" length={6} onComplete={onComplete} />);
    fireEvent.paste(cells()[0]!, { clipboardData: { getData: () => '12-34 56' } });
    expect(onComplete).toHaveBeenCalledWith('123456');
    expect(cells()[5]).toHaveFocus();
  });

  it('supports controlled, alphanumeric, masked, invalid and hidden input', async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [value, setValue] = useState('');
      return (
        <form aria-label="f">
          <PinInput label="Codice" type="alphanumeric" mask name="otp" length={3} value={value} onChange={(v) => setValue(v.toUpperCase())} isInvalid errorMessage="Codice errato" isRequired />
          <output>{value}</output>
        </form>
      );
    }
    const { container } = render(
      <LocaleProvider locale="it-IT">
        <Controlled />
      </LocaleProvider>,
    );
    const inputs = container.querySelectorAll<HTMLInputElement>('input[type="password"]');
    expect(inputs).toHaveLength(3);
    expect(inputs[0]).toHaveAccessibleName('Carattere 1 di 3');
    expect(inputs[0]).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('group', { name: /Codice/ })).toHaveAccessibleDescription('Codice errato');
    await user.click(inputs[0]!);
    await user.keyboard('a9');
    expect(screen.getByRole('status')).toHaveTextContent('A9');
    expect(container.querySelector<HTMLInputElement>('input[type="hidden"][name="otp"]')?.value).toBe('A9');
  });

  it('is fully disabled', () => {
    render(<PinInput aria-label="PIN" length={4} isDisabled />);
    for (const cell of cells()) expect(cell).toBeDisabled();
  });
});
