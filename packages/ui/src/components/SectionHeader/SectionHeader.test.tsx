import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { axe } from '../../../test/axe';
import { SectionHeader } from './SectionHeader';

describe('SectionHeader', () => {
  it('renders eyebrow, an h2 title, description and actions', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <SectionHeader
        ref={ref}
        data-testid="sh"
        eyebrow="Prossimi eventi"
        title="Ci vediamo dal vivo"
        description="Meetup e workshop"
        actions={<a href="#all">Vedi tutti</a>}
      />,
    );
    expect(ref.current).toBe(screen.getByTestId('sh'));
    expect(screen.getByRole('heading', { level: 2, name: 'Ci vediamo dal vivo' })).toBeInTheDocument();
    expect(screen.getByText('Prossimi eventi')).toBeInTheDocument();
    expect(screen.getByText('Meetup e workshop')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Vedi tutti' })).toBeInTheDocument();
    expect(screen.getByTestId('sh')).toHaveAttribute('data-size', 'md');
  });

  it('supports heading level, size and a custom title id', () => {
    render(
      <section aria-labelledby="speakers">
        <SectionHeader headingLevel={3} size="lg" titleId="speakers" title="Speaker" />
      </section>,
    );
    const heading = screen.getByRole('heading', { level: 3, name: 'Speaker' });
    expect(heading).toHaveAttribute('id', 'speakers');
    expect(screen.getByRole('region', { name: 'Speaker' })).toBeInTheDocument();
  });

  it('omits empty slots', () => {
    const { container } = render(<SectionHeader title="Solo titolo" />);
    expect(container.querySelector('.actions')).toBeNull();
    expect(container.querySelector('.eyebrow')).toBeNull();
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <SectionHeader eyebrow="Dal blog" title="Articoli" description="Le ultime guide" actions={<button type="button">Filtra</button>} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
