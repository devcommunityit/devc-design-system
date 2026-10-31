import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '../../../test/axe';
import { CheckInScanner } from './CheckInScanner';

describe('CheckInScanner', () => {
  it('submits a trimmed manual code and renders the optional host viewport', () => {
    const onCheckIn = vi.fn();
    const onCodeChange = vi.fn();
    render(<CheckInScanner title="Check in" code="  A-12 " onCodeChange={onCodeChange} onCheckIn={onCheckIn} scannerViewport={<p>Host viewport</p>} />);
    expect(screen.getByText('Host viewport')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Check in' }));
    expect(onCheckIn).toHaveBeenCalledWith('A-12');
  });

  it('has no axe violations', async () => {
    const { container } = render(<CheckInScanner title="Check in" code="" onCodeChange={() => {}} onCheckIn={() => {}} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
