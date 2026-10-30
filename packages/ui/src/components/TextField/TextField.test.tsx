import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState } from 'react';
import { Form } from 'react-aria-components';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '../../../test/axe';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { Field } from '../Field/Field';
import { TextField, Textarea } from './TextField';

describe('TextField', () => {
  it('associates label, description and error with the input', async () => {
    const user = userEvent.setup();
    render(
      <TextField label="Email" description="We never share it." errorMessage="Enter a valid email" type="email" isRequired />,
    );
    const input = screen.getByRole('textbox', { name: /Email/ });
    expect(input).toHaveAccessibleDescription('We never share it.');
    expect(input).toBeRequired();
    await user.type(input, 'nope');
    expect(input).toHaveValue('nope');
  });

  it('shows the error message and aria-invalid when isInvalid', () => {
    render(<TextField label="Name" isInvalid errorMessage="Required field" />);
    const input = screen.getByRole('textbox', { name: 'Name' });
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Required field');
  });

  it('validates on submit inside a Form and focuses the first invalid field', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
    render(
      <Form onSubmit={onSubmit}>
        <TextField label="City" name="city" isRequired errorMessage="City is required" />
        <button type="submit">Send</button>
      </Form>,
    );
    await user.click(screen.getByRole('button', { name: 'Send' }));
    expect(onSubmit).not.toHaveBeenCalled();
    const input = screen.getByRole('textbox', { name: /City/ });
    expect(input).toHaveFocus();
    expect(screen.getByText('City is required')).toBeInTheDocument();
    await user.type(input, 'Roma');
    await user.click(screen.getByRole('button', { name: 'Send' }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('supports custom validate functions', async () => {
    const user = userEvent.setup();
    render(
      <TextField
        label="Code"
        validationBehavior="aria"
        validate={(v) => (v.length > 0 && v.length < 3 ? 'At least 3 characters' : null)}
      />,
    );
    await user.type(screen.getByRole('textbox'), 'ab');
    expect(screen.getByText('At least 3 characters')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('works controlled and uncontrolled and forwards ref', async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLInputElement>();
    function Controlled() {
      const [value, setValue] = useState('a');
      return (
        <>
          <TextField label="Controlled" value={value} onChange={(v) => setValue(v.toUpperCase())} />
          <output>{value}</output>
        </>
      );
    }
    render(
      <>
        <Controlled />
        <TextField label="Uncontrolled" defaultValue="x" ref={ref} />
      </>,
    );
    await user.type(screen.getByRole('textbox', { name: 'Controlled' }), 'b');
    expect(screen.getByRole('textbox', { name: 'Controlled' })).toHaveValue('AB');
    await user.type(screen.getByRole('textbox', { name: 'Uncontrolled' }), 'y');
    expect(ref.current).toHaveValue('xy');
  });

  it('respects readonly and disabled', async () => {
    const user = userEvent.setup();
    render(
      <>
        <TextField label="RO" defaultValue="fixed" isReadOnly />
        <TextField label="Off" isDisabled />
      </>,
    );
    const ro = screen.getByRole('textbox', { name: 'RO' });
    await user.type(ro, 'zzz');
    expect(ro).toHaveValue('fixed');
    expect(ro).toHaveAttribute('readonly');
    expect(screen.getByRole('textbox', { name: 'Off' })).toBeDisabled();
  });

  it('localizes the required hint', () => {
    render(
      <LocaleProvider locale="it-IT">
        <TextField label="Nome" isRequired />
      </LocaleProvider>,
    );
    expect(screen.getByText(/obbligatorio/i)).toBeInTheDocument();
  });

  it('Textarea shows a counter and forwards ref', async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLTextAreaElement>();
    render(<Textarea label="Bio" maxLength={20} showCount ref={ref} />);
    await user.type(screen.getByRole('textbox', { name: 'Bio' }), 'hello');
    expect(screen.getByText('5/20')).toBeInTheDocument();
    expect(ref.current?.tagName).toBe('TEXTAREA');
  });

  it('Field wires ids and ARIA for custom controls', () => {
    render(
      <Field label="Custom" description="Help" errorMessage="Bad" isInvalid isRequired>
        {(props) => <input {...props} />}
      </Field>,
    );
    const input = screen.getByRole('textbox', { name: /Custom/ });
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-required', 'true');
    expect(input).toHaveAccessibleDescription(/Help/);
    expect(input).toHaveAccessibleDescription(/Bad/);
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <div>
        <TextField label="Email" description="Work email" />
        <TextField label="Name" isInvalid errorMessage="Required" />
        <Textarea label="Notes" />
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
