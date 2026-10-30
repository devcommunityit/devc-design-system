import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { axe } from '../../../test/axe';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { SourceList } from './SourceList';

const sources = [{ id: 'docs', title: 'Documentation', href: '/docs', description: 'Updated guide' }];

describe('SourceList', () => {
  it('renders real links and descriptions with a forwarded ref', () => {
    const ref = createRef<HTMLElement>();
    render(<SourceList ref={ref} sources={sources} />);
    expect(ref.current).toBe(screen.getByRole('region', { name: 'Sources' }));
    expect(screen.getByRole('link', { name: 'Documentation' })).toHaveAttribute('href', '/docs');
    expect(screen.getByText('Updated guide')).toBeInTheDocument();
  });

  it('localizes the section label', () => {
    render(<LocaleProvider locale="it-IT"><SourceList sources={sources} /></LocaleProvider>);
    expect(screen.getByRole('region', { name: 'Fonti' })).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(<SourceList sources={sources} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
