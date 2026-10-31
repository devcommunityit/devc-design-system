import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '../../../test/axe';
import { Poll } from './Poll';

describe('Poll', () => {
  it('reports the selected option without submitting a vote', async () => {
    const onChange = vi.fn();
    const { container } = render(<Poll title="Choose one" options={[
      { id: 'a', label: 'Option A' }, { id: 'b', label: 'Option B' },
    ]} value={null} onChange={onChange} />);
    await userEvent.setup().click(screen.getByRole('radio', { name: 'Option B' }));
    expect(onChange).toHaveBeenCalledWith('b');
    expect(await axe(container)).toHaveNoViolations();
  });
});
