import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '../../../test/axe';
import { PlanSwitcher } from './PlanSwitcher';

describe('PlanSwitcher', () => {
  it('marks the selected option and reports changes', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { container } = render(<PlanSwitcher label="Billing period" options={[{ id: 'month', label: 'Monthly' }, { id: 'year', label: 'Yearly' }]} value="month" onChange={onChange} />);
    expect(screen.getByRole('button', { name: 'Monthly' })).toHaveAttribute('aria-pressed', 'true');
    await user.click(screen.getByRole('button', { name: 'Yearly' }));
    expect(onChange).toHaveBeenCalledWith('year');
    expect(await axe(container)).toHaveNoViolations();
  });
});
