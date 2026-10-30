import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { axe } from '../../../test/axe';
import { NativeSelect } from './NativeSelect';

const options = [
  { value: 'it', label: 'Italia' },
  { value: 'fr', label: 'Francia' },
  { value: 'xx', label: 'Non disponibile', disabled: true },
];

describe('NativeSelect', () => {
  it('renders a labelled native select with placeholder and options', async () => {
    const user = userEvent.setup();
    const { container } = render(<NativeSelect label="Paese" description="Per la fatturazione" placeholder="Seleziona…" options={options} isRequired defaultValue="" />);
    const select = screen.getByRole('combobox', { name: /Paese/ });
    expect(select).toBeRequired();
    expect(select).toHaveAccessibleDescription('Per la fatturazione');
    expect(screen.getByRole('option', { name: 'Seleziona…' })).toBeDisabled();
    expect(screen.getByRole('option', { name: 'Non disponibile' })).toBeDisabled();
    await user.selectOptions(select, 'fr');
    expect(select).toHaveValue('fr');
    expect(await axe(container)).toHaveNoViolations();
  });

  it('links the error message when invalid and supports disabled', () => {
    render(<NativeSelect label="Paese" options={options} isInvalid errorMessage="Scegli un paese" isDisabled />);
    const select = screen.getByRole('combobox', { name: 'Paese' });
    expect(select).toHaveAttribute('aria-invalid', 'true');
    expect(select).toHaveAccessibleDescription('Scegli un paese');
    expect(select).toBeDisabled();
  });
});