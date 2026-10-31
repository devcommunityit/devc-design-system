import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '../../../test/axe';
import { VolunteerShiftPicker } from './VolunteerShiftPicker';

describe('VolunteerShiftPicker', () => {
  it('reports an available shift and disables unavailable options', async () => {
    const onChange = vi.fn();
    const { container } = render(<VolunteerShiftPicker label="Pick a shift" value={null} onChange={onChange} shifts={[
      { id: 'am', label: 'Morning' }, { id: 'pm', label: 'Afternoon', isAvailable: false },
    ]} />);
    expect(screen.getByRole('radio', { name: 'Afternoon' })).toBeDisabled();
    await userEvent.setup().click(screen.getByRole('radio', { name: 'Morning' }));
    expect(onChange).toHaveBeenCalledWith('am');
    expect(await axe(container)).toHaveNoViolations();
  });
});
