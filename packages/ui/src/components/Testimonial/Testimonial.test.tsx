import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from '../../../test/axe';
import { Testimonial } from './Testimonial';

describe('Testimonial', () => {
  it('renders a quote with a named attribution', async () => {
    const { container } = render(<Testimonial quote="A useful community." author="Riley Chen" authorRole="Member" />);
    expect(screen.getByText('A useful community.').closest('blockquote')).toBeInTheDocument();
    expect(screen.getByText('Riley Chen')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
});
