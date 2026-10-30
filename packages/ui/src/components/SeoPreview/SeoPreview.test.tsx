import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { axe } from '../../../test/axe';
import { SeoPreview } from './SeoPreview';

describe('SeoPreview', () => {
  it('renders editorial text without inserting HTML or creating a fake link', () => {
    const ref = createRef<HTMLElement>();
    render(<SeoPreview ref={ref} title="<b>Title</b>" url="https://example.test/article" description="Description" siteName="My site" />);
    expect(ref.current).toBe(screen.getByRole('figure', { name: 'Search result preview' }));
    expect(screen.getByText('<b>Title</b>')).toBeInTheDocument();
    expect(ref.current?.querySelector('b')).toBeNull();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('updates when the editorial values change', () => {
    const { rerender } = render(<SeoPreview title="Before" url="/before" description="Old" />);
    rerender(<SeoPreview title="After" url="/after" description="New" />);
    expect(screen.queryByText('Before')).not.toBeInTheDocument();
    expect(screen.getByText('After')).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(<SeoPreview title="Design system" url="https://example.test" description="Components for modern portals." />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
