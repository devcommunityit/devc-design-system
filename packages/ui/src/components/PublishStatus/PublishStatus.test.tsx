import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { axe } from '../../../test/axe';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { PublishStatus } from './PublishStatus';

describe('PublishStatus', () => {
  it('renders localized text and forwards ref, styles and attributes', () => {
    const ref = createRef<HTMLSpanElement>();
    render(<LocaleProvider locale="it-IT"><PublishStatus ref={ref} status="published" id="state" /></LocaleProvider>);
    expect(ref.current).toHaveAttribute('id', 'state');
    expect(ref.current).toHaveAttribute('data-publish-status', 'published');
    expect(screen.getByText('Pubblicato')).toBeInTheDocument();
  });

  it('allows an explicit label for scheduled dates', () => {
    render(<PublishStatus status="scheduled">Scheduled for tomorrow</PublishStatus>);
    expect(screen.getByText('Scheduled for tomorrow')).toBeInTheDocument();
  });

  it('has no axe violations for every status', async () => {
    const { container } = render(<><PublishStatus status="draft" /><PublishStatus status="published" /><PublishStatus status="scheduled" /><PublishStatus status="archived" /></>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
