import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { axe } from '../../../test/axe';
import { Button } from '../Button/Button';
import { HeroCard } from './HeroCard';

describe('HeroCard', () => {
  it('renders a named section with heading level, variant and forwards ref and DOM props', () => {
    const ref = createRef<HTMLElement>();
    render(
      <HeroCard
        ref={ref}
        id="welcome"
        data-testid="hero"
        variant="accent"
        eyebrow="Lunedì 3 marzo"
        title="Bentornata, Giulia"
        description="Hai 4 richieste da approvare."
        actions={<Button variant="secondary">Apri richieste</Button>}
        media={<img src="data:," alt="" />}
      />,
    );
    const region = screen.getByRole('region', { name: 'Bentornata, Giulia' });
    expect(region.tagName).toBe('SECTION');
    expect(ref.current).toBe(region);
    expect(region).toHaveAttribute('id', 'welcome');
    expect(region).toHaveAttribute('data-variant', 'accent');
    expect(region).toHaveAttribute('data-has-media', 'true');
    expect(screen.getByRole('heading', { level: 2, name: 'Bentornata, Giulia' })).toBeInTheDocument();
    expect(screen.getByText('Lunedì 3 marzo')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Apri richieste' })).toBeInTheDocument();
  });

  it('supports article semantics, custom heading level and default brand variant', () => {
    render(<HeroCard as="article" headingLevel={1} title="Novità" icon={<svg data-testid="icon" />} />);
    const article = screen.getByRole('article');
    expect(article).toHaveAttribute('data-variant', 'brand');
    expect(screen.getByRole('heading', { level: 1, name: 'Novità' })).toBeInTheDocument();
    expect(screen.getByTestId('icon').parentElement).toHaveAttribute('aria-hidden', 'true');
  });

  it('lets consumers override the accessible name', () => {
    render(<HeroCard title="Ciao" aria-label="Benvenuto" aria-labelledby={undefined} />);
    expect(screen.getByRole('region', { name: 'Benvenuto' })).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <div>
        <HeroCard variant="brand" title="Brand" description="Testo" actions={<Button variant="secondary">Azione</Button>} />
        <HeroCard variant="subtle" title="Subtle" eyebrow="Eyebrow" />
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
