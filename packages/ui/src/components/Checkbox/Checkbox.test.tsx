import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '../../../test/axe';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { Button } from '../Button';
import { Form } from '../Field';
import { Checkbox, CheckboxGroup } from './Checkbox';

describe('Checkbox', () => {
  it('toggles uncontrolled with mouse and Space, with label and description', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { container } = render(
      <Checkbox onChange={onChange} description="Una email al mese">
        Newsletter
      </Checkbox>,
    );
    const box = screen.getByRole('checkbox', { name: 'Newsletter' });
    expect(box).toHaveAccessibleDescription('Una email al mese');
    await user.click(screen.getByText('Newsletter'));
    expect(box).toBeChecked();
    await user.keyboard(' ');
    expect(box).not.toBeChecked();
    expect(onChange.mock.calls).toEqual([[true], [false]]);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('supports controlled and indeterminate state', async () => {
    const user = userEvent.setup();
    function Demo() {
      const [checked, setChecked] = useState(false);
      return (
        <Checkbox isSelected={checked} isIndeterminate={!checked} onChange={setChecked}>
          Tutti
        </Checkbox>
      );
    }
    render(<Demo />);
    const box = screen.getByRole('checkbox', { name: 'Tutti' });
    expect(box).toHaveProperty('indeterminate', true);
    await user.click(box);
    expect(box).toBeChecked();
    expect(box).toHaveProperty('indeterminate', false);
  });

  it('shows a required error on submit and is disabled/read-only aware', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((e: { preventDefault: () => void }) => e.preventDefault());
    render(
      <LocaleProvider locale="it-IT">
        <Form onSubmit={onSubmit}>
          <Checkbox name="terms" isRequired errorMessage="Accetta i termini per continuare">
            Accetto i termini
          </Checkbox>
          <Checkbox isDisabled>Disabilitato</Checkbox>
          <Checkbox isReadOnly defaultSelected>
            Sola lettura
          </Checkbox>
          <Button type="submit">Invia</Button>
        </Form>
      </LocaleProvider>,
    );
    await user.click(screen.getByRole('button', { name: 'Invia' }));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(await screen.findByText('Accetta i termini per continuare')).toBeInTheDocument();
    await waitFor(() => expect(screen.getByRole('checkbox', { name: 'Accetto i termini' })).toHaveFocus());
    expect(screen.getByRole('checkbox', { name: 'Disabilitato' })).toBeDisabled();
    const ro = screen.getByRole('checkbox', { name: 'Sola lettura' });
    await user.click(ro);
    expect(ro).toBeChecked();
    await user.click(screen.getByRole('checkbox', { name: 'Accetto i termini' }));
    await user.click(screen.getByRole('button', { name: 'Invia' }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });
});

describe('CheckboxGroup', () => {
  it('manages an array value with a group label and Italian required marker', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { container } = render(
      <LocaleProvider locale="it-IT">
        <CheckboxGroup label="Canali" defaultValue={['email']} onChange={onChange} isRequired>
          <Checkbox value="email">Email</Checkbox>
          <Checkbox value="sms">SMS</Checkbox>
        </CheckboxGroup>
      </LocaleProvider>,
    );
    const group = screen.getByRole('group', { name: /Canali/ });
    expect(group).toHaveTextContent('obbligatorio');
    expect(screen.getByRole('checkbox', { name: 'Email' })).toBeChecked();
    await user.click(screen.getByRole('checkbox', { name: 'SMS' }));
    expect(onChange).toHaveBeenLastCalledWith(['email', 'sms']);
    expect(await axe(container)).toHaveNoViolations();
  });
});