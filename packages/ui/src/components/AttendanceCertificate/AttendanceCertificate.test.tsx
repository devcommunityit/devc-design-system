import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from '../../../test/axe';
import { AttendanceCertificate } from './AttendanceCertificate';

describe('AttendanceCertificate', () => {
  it('displays recipient and event and links only when provided', () => {
    render(<AttendanceCertificate recipient="Taylor" eventName="Summit" certificateHref="/certificate" />);
    expect(screen.getByRole('article', { name: 'Taylor' })).toBeInTheDocument();
    expect(screen.getByText('Summit')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'View certificate' })).toHaveAttribute('href', '/certificate');
  });

  it('has no axe violations', async () => {
    const { container } = render(<AttendanceCertificate recipient="Taylor" eventName="Summit" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
