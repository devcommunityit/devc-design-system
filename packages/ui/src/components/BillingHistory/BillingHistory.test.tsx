import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '../../../test/axe';
import { BillingHistory } from './BillingHistory';

describe('BillingHistory', () => {
  it('renders semantic invoice rows and calls the supplied action', async () => {
    const onDownload = vi.fn();
    const { container } = render(<BillingHistory title="Billing history" records={[{ id: 'i1', description: 'Annual plan', date: 'Oct 12', amount: '€80', status: 'Paid' }]} downloadLabel="Download" onDownload={onDownload} />);
    expect(screen.getByRole('row', { name: /Annual plan Oct 12 €80 Paid/ })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Download' }));
    expect(onDownload).toHaveBeenCalledWith('i1');
    expect(await axe(container)).toHaveNoViolations();
  });
});
