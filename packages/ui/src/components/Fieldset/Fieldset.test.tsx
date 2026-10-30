import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from '../../../test/axe';
import { TextField } from '../TextField';
import { Fieldset } from './Fieldset';

describe('Fieldset', () => {
  it('names the group with the legend and links description and error', async () => {
    const { container, rerender } = render(
      <Fieldset legend="Indirizzo di fatturazione" description="Come appare in fattura" errorMessage="Completa l’indirizzo">
        <TextField label="Via" />
      </Fieldset>,
    );
    const group = screen.getByRole('group', { name: 'Indirizzo di fatturazione' });
    expect(group).toHaveAccessibleDescription('Come appare in fattura');
    expect(screen.queryByText('Completa l’indirizzo')).not.toBeInTheDocument();
    rerender(
      <Fieldset legend="Indirizzo di fatturazione" description="Come appare in fattura" errorMessage="Completa l’indirizzo" isInvalid>
        <TextField label="Via" />
      </Fieldset>,
    );
    expect(group).toHaveAccessibleDescription('Come appare in fattura Completa l’indirizzo');
    expect(group).toHaveAttribute('data-invalid', 'true');
    expect(await axe(container)).toHaveNoViolations();
  });

  it('disables native descendants', () => {
    render(
      <Fieldset legend="Contatti" disabled>
        <input aria-label="Telefono" />
      </Fieldset>,
    );
    expect(screen.getByRole('textbox', { name: 'Telefono' })).toBeDisabled();
  });
});