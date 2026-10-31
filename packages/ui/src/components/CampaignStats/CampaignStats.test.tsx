import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from '../../../test/axe';
import { CampaignStats } from './CampaignStats';

describe('CampaignStats', () => {
  it('composes campaign values into labelled KPI cards', async () => {
    const { container } = render(<CampaignStats title="Campaign stats" stats={[{ id: 'opens', label: 'Opens', value: 72 }]} />);
    expect(screen.getByRole('region', { name: 'Campaign stats' })).toBeInTheDocument();
    expect(screen.getByText('Opens')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
});
