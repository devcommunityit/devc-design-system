import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from '../../../test/axe';
import { AudienceSegmentBuilder } from './AudienceSegmentBuilder';

describe('AudienceSegmentBuilder', () => {
  it('renders controlled filters with labelled controls', async () => {
    const { container } = render(<AudienceSegmentBuilder title="Audience rules" fields={[{ id: 'plan', label: 'Plan' }]} operators={[{ id: 'equals', label: 'equals' }]} filters={[{ id: 'f1', field: 'plan', operator: 'equals', value: 'Pro' }]} onFilterChange={() => undefined} onAddFilter={() => undefined} onRemoveFilter={() => undefined} />);
    expect(screen.getByRole('region', { name: 'Audience rules' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Value' })).toHaveValue('Pro');
    expect(await axe(container)).toHaveNoViolations();
  });
});
