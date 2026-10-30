import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { axe } from '../../../test/axe';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { PasswordInput } from './PasswordInput';

describe('PasswordInput', () => {
  it('toggles visibility with a real, labelled button and keeps the value', async () => {
    const user = userEvent.setup();
    const { container } = render(<PasswordInput label="Password" />);
    const input = screen.getByLabelText('Password');
    expect(input).toHaveAttribute('type', 'password');
    expect(input).toHaveAttribute('autocomplete', 'current-password');
    await user.type(input, 's3cret');
    await user.click(screen.getByRole('button', { name: 'Show password' }));
    expect(input).toHaveAttribute('type', 'text');
    expect(input).toHaveValue('s3cret');
    await user.click(screen.getByRole('button', { name: 'Hide password' }));
    expect(input).toHaveAttribute('type', 'password');
    expect(await axe(container)).toHaveNoViolations();
  });

  it('localizes the toggle label', () => {
    render(
      <LocaleProvider locale="it-IT">
        <PasswordInput label="Password" autoComplete="new-password" />
      </LocaleProvider>,
    );
    expect(screen.getByRole('button', { name: 'Mostra password' })).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toHaveAttribute('autocomplete', 'new-password');
  });
});