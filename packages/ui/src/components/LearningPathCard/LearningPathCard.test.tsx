import { render, screen } from '@testing-library/react';
import { createRef, type ReactElement } from 'react';
import { describe, expect, it } from 'vitest';
import { axe } from '../../../test/axe';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { Button } from '../Button/Button';
import { LearningPathCard } from './LearningPathCard';

const en = (ui: ReactElement) => render(<LocaleProvider locale="en-US">{ui}</LocaleProvider>);

describe('LearningPathCard', () => {
  it('renders a named article with a labelled progress bar and forwards ref and DOM props', () => {
    const ref = createRef<HTMLElement>();
    en(
      <LearningPathCard
        ref={ref}
        data-testid="card"
        title="Generative AI"
        description="LLM, RAG and agents."
        meta={<span>Intermediate</span>}
        completed={5}
        total={8}
        tone="accent"
      />,
    );
    const article = screen.getByRole('article', { name: 'Generative AI' });
    expect(ref.current).toBe(article);
    expect(article).toHaveAttribute('data-tone', 'accent');
    expect(screen.getByRole('heading', { level: 3, name: 'Generative AI' })).toBeInTheDocument();
    const bar = screen.getByRole('progressbar', { name: /Generative AI/ });
    expect(bar).toHaveAttribute('aria-valuenow', '5');
    expect(bar).toHaveAttribute('aria-valuemax', '8');
    expect(bar).toHaveAttribute('aria-valuetext', '5 / 8 modules');
    expect(screen.getByText('Intermediate')).toBeInTheDocument();
    expect(screen.queryByText('New')).not.toBeInTheDocument();
  });

  it('localizes and clamps the module count', () => {
    render(
      <LocaleProvider locale="it-IT">
        <LearningPathCard title="Cloud Native" completed={12} total={10} />
      </LocaleProvider>,
    );
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuetext', '10 / 10 moduli');
    expect(screen.getByText('10 / 10 moduli')).toBeInTheDocument();
  });

  it('shows the New chip without progress, and a stretched title link with a separate footer action', () => {
    en(<LearningPathCard title="DevOps" href="/paths/devops" isNew headingLevel={2} footer={<Button>Start</Button>} />);
    expect(screen.getByText('New')).toBeInTheDocument();
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    const link = screen.getByRole('link', { name: 'DevOps' });
    expect(link).toHaveAttribute('href', '/paths/devops');
    expect(screen.getByRole('heading', { level: 2 })).toContainElement(link);
    expect(screen.getByRole('article')).toHaveAttribute('data-new', 'true');
    expect(link.contains(screen.getByRole('button', { name: 'Start' }))).toBe(false);
  });

  it('hides the progress bar when total is not positive', () => {
    en(<LearningPathCard title="Empty" completed={0} total={0} />);
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = en(
      <div>
        <LearningPathCard title="Generative AI" href="#ai" icon={<svg />} description="LLM" completed={5} total={8} />
        <LearningPathCard title="DevOps" isNew footer={<Button>Start</Button>} />
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
