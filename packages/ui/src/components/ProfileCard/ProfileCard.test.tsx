import { render, screen } from '@testing-library/react';
import { createRef, type ReactElement } from 'react';
import { describe, expect, it } from 'vitest';
import { axe } from '../../../test/axe';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { Button } from '../Button/Button';
import { ProfileCard } from './ProfileCard';

const en = (ui: ReactElement) => render(<LocaleProvider locale="en-US">{ui}</LocaleProvider>);

describe('ProfileCard', () => {
  it('renders a named article with heading, job title, company, tags and forwards ref and DOM props', () => {
    const ref = createRef<HTMLElement>();
    en(<ProfileCard ref={ref} id="giulia" data-testid="card" name="Giulia Conti" jobTitle="AI Engineer" company="Contoso" tags={<span>AI</span>} tone="accent" />);
    const article = screen.getByRole('article', { name: 'Giulia Conti' });
    expect(ref.current).toBe(article);
    expect(article).toHaveAttribute('id', 'giulia');
    expect(article).toHaveAttribute('data-tone', 'accent');
    expect(article).not.toHaveAttribute('data-linked');
    expect(screen.getByRole('heading', { level: 3, name: 'Giulia Conti' })).toBeInTheDocument();
    expect(screen.getByText('AI Engineer')).toBeInTheDocument();
    expect(screen.getByText('Contoso')).toBeInTheDocument();
    expect(screen.getByText('AI')).toBeInTheDocument();
    // The avatar is decorative: the name is not announced twice.
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('renders a single link on the name when href is set and keeps actions separate', () => {
    en(<ProfileCard name="Marco Rossi" href="/speaker/marco" headingLevel={2} actions={<Button>Follow</Button>} />);
    const link = screen.getByRole('link', { name: 'Marco Rossi' });
    expect(link).toHaveAttribute('href', '/speaker/marco');
    expect(screen.getAllByRole('link')).toHaveLength(1);
    expect(screen.getByRole('heading', { level: 2 })).toContainElement(link);
    expect(link.contains(screen.getByRole('button', { name: 'Follow' }))).toBe(false);
    expect(screen.getByRole('article')).toHaveAttribute('data-linked', 'true');
  });

  it('formats numeric stats with the locale and renders other nodes as is', () => {
    render(
      <LocaleProvider locale="it-IT">
        <ProfileCard
          name="Sara Leone"
          stats={[
            { label: 'talk', value: 31 },
            { label: 'punti', value: 2840 },
            { label: 'follower', value: 5800, formatOptions: { notation: 'compact', maximumFractionDigits: 1 } },
            { label: 'disponibilità', value: <span>Mar e gio</span> },
          ]}
        />
      </LocaleProvider>,
    );
    const terms = screen.getAllByRole('term').map((el) => el.textContent);
    const definitions = screen.getAllByRole('definition').map((el) => el.textContent);
    expect(terms).toEqual(['talk', 'punti', 'follower', 'disponibilità']);
    expect(definitions[0]).toBe('31');
    expect(definitions[1]).toBe(new Intl.NumberFormat('it-IT').format(2840));
    expect(definitions[2]).toBe(new Intl.NumberFormat('it-IT', { notation: 'compact', maximumFractionDigits: 1 }).format(5800));
    expect(definitions[3]).toBe('Mar e gio');
  });

  it('has no axe violations', async () => {
    const { container } = en(
      <div>
        <ProfileCard
          name="Giulia Conti"
          jobTitle="AI Engineer"
          href="#giulia"
          tags={<span>AI</span>}
          stats={[{ label: 'talks', value: 14 }]}
          actions={<Button>Follow</Button>}
        />
        <ProfileCard name="Davide Bruno" tone="neutral" headingLevel={2} />
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
