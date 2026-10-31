import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '../../../test/axe';
import { NpsWidget } from './NpsWidget';

describe('NpsWidget', () => {
  it('reports a controlled score and exposes endpoint descriptions', async () => {
    const onChange = vi.fn();
    const { container } = render(<NpsWidget label="Recommend us?" value={null} onChange={onChange} lowLabel="Not likely" highLabel="Very likely" />);
    await userEvent.setup().click(screen.getByRole('radio', { name: '8' }));
    expect(onChange).toHaveBeenCalledWith(8);
    expect(screen.getByText('Not likely')).toBeInTheDocument();
    expect(screen.getByText('Very likely')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
});
