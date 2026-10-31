import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '../../../test/axe';
import { CouponInput } from './CouponInput';

describe('CouponInput', () => {
  it('keeps value controlled and passes it to the apply callback', async () => {
    const onApply = vi.fn();
    const { container } = render(<CouponInput label="Coupon" value="WELCOME" onChange={() => undefined} onApply={onApply} status="idle" applyLabel="Apply" />);
    fireEvent.submit(screen.getByRole('button', { name: 'Apply' }).closest('form')!);
    expect(onApply).toHaveBeenCalledWith('WELCOME');
    expect(await axe(container)).toHaveNoViolations();
  });
});
