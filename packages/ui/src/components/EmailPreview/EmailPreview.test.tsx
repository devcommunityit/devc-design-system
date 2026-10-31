import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { createEmailDocument } from '../EmailBuilder/emailDocument';
import { EmailPreview } from './EmailPreview';

describe('EmailPreview', () => {
  it('shows email metadata and a sandboxed, controlled preview', () => {
    const { container } = render(<EmailPreview title="Campaign preview" document={createEmailDocument()} previewDevice="desktop" onPreviewDeviceChange={() => undefined} subject="October update" />);
    expect(screen.getByRole('region', { name: 'Campaign preview' })).toBeInTheDocument();
    expect(screen.getByText('October update')).toBeInTheDocument();
    expect(container.querySelector('iframe')).toHaveAttribute('sandbox', '');
  });
});
