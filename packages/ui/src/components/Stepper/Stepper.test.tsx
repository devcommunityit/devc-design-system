import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '../../../test/axe';
import { Stepper, type StepperStep } from './Stepper';

const steps: StepperStep[] = [
  { id: 'account', label: 'Account' },
  { id: 'profile', label: 'Profile', description: 'Name and role' },
  { id: 'billing', label: 'Billing' },
  { id: 'review', label: 'Review' },
];

describe('Stepper', () => {
  it('exposes status as text and aria-current on the current step', async () => {
    const { container } = render(<Stepper steps={steps} currentStep={2} />);
    const nav = screen.getByRole('navigation', { name: 'Step 3 of 4' });
    const listItems = nav.querySelectorAll('li');
    expect(listItems).toHaveLength(4);
    expect(listItems[2]).toHaveAttribute('aria-current', 'step');
    expect(listItems[0]).toHaveTextContent('Account, completed');
    expect(listItems[2]).toHaveTextContent('Billing, current');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('completed steps become buttons when onStepPress is provided', async () => {
    const user = userEvent.setup();
    const onStepPress = vi.fn();
    render(<Stepper steps={steps} currentStep={2} onStepPress={onStepPress} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(2);
    await user.click(screen.getByRole('button', { name: /Profile/ }));
    expect(onStepPress).toHaveBeenCalledWith(1, steps[1]);
  });

  it('marks errors with text, not only colour', () => {
    render(<Stepper steps={[{ id: 'a', label: 'Details', hasError: true }, { id: 'b', label: 'Done' }]} currentStep={1} />);
    expect(screen.getByText(/Details/).closest('li')).toHaveAttribute('data-status', 'error');
    expect(screen.getByText(/Details/)).toHaveTextContent('Details, error');
  });
});