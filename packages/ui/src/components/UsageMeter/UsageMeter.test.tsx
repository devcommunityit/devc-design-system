import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from '../../../test/axe';
import { UsageMeter } from './UsageMeter';

describe('UsageMeter', () => {
  it('uses the existing Meter semantics with quota labels', async () => {
    const { container } = render(<UsageMeter label="Members" value={70} limit={100} unit="members" />);
    expect(screen.getByRole('meter', { name: 'Members' })).toHaveAttribute('aria-valuemax', '100');
    expect(screen.getByRole('meter')).toHaveAttribute('aria-valuetext', '70 members / 100 members');
    expect(await axe(container)).toHaveNoViolations();
  });
});
