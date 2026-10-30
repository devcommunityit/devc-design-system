import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { axe } from '../../../test/axe';
import { Radio, RadioGroup } from './RadioGroup';

describe('RadioGroup', () => {
  it('selects with arrow keys (roving focus) and exposes the group name', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <>
        <RadioGroup label="Spedizione" defaultValue="standard" description="Tempi indicativi">
          <Radio value="standard">Standard</Radio>
          <Radio value="express" description="Consegna in 24 ore">
            Express
          </Radio>
          <Radio value="pickup" isDisabled>
            Ritiro
          </Radio>
        </RadioGroup>
        <button type="button">dopo</button>
      </>,
    );
    expect(screen.getByRole('radiogroup', { name: 'Spedizione' })).toHaveAccessibleDescription('Tempi indicativi');
    await user.tab();
    expect(screen.getByRole('radio', { name: 'Standard' })).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    const express = screen.getByRole('radio', { name: 'Express' });
    expect(express).toBeChecked();
    expect(express).toHaveAccessibleDescription(/Consegna in 24 ore/);
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('radio', { name: 'Standard' })).toBeChecked();
    await user.tab();
    expect(screen.getByRole('button', { name: 'dopo' })).toHaveFocus();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('works controlled and shows invalid state', async () => {
    const user = userEvent.setup();
    function Demo() {
      const [value, setValue] = useState<string | null>(null);
      return (
        <>
          <RadioGroup label="Piano" value={value} onChange={setValue} isInvalid={value === null} errorMessage="Scegli un piano">
            <Radio value="free">Free</Radio>
            <Radio value="pro">Pro</Radio>
          </RadioGroup>
          <output>{value ?? 'nessuno'}</output>
        </>
      );
    }
    render(<Demo />);
    expect(screen.getByText('Scegli un piano')).toBeInTheDocument();
    await user.click(screen.getByText('Pro'));
    expect(screen.getByRole('status')).toHaveTextContent('pro');
    expect(screen.queryByText('Scegli un piano')).not.toBeInTheDocument();
  });
});