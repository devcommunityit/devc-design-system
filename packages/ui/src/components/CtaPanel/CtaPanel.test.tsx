import { render, screen, within } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { axe } from '../../../test/axe';
import { Button } from '../Button/Button';
import { CtaPanel } from './CtaPanel';

const steps = [{ title: 'Send the abstract' }, { title: 'Get feedback', description: 'From a mentor within 7 days.' }, { title: 'Go on stage' }];

describe('CtaPanel', () => {
  it('renders a named section with heading, eyebrow, actions and forwards ref and DOM props', () => {
    const ref = createRef<HTMLElement>();
    render(
      <CtaPanel
        ref={ref}
        id="cta"
        eyebrow="Call for speakers"
        title="Got something to share?"
        description="We help you with mentoring."
        actions={<Button>Submit a talk</Button>}
      />,
    );
    const region = screen.getByRole('region', { name: 'Got something to share?' });
    expect(ref.current).toBe(region);
    expect(region.tagName).toBe('SECTION');
    expect(region).toHaveAttribute('id', 'cta');
    expect(region).toHaveAttribute('data-variant', 'dark');
    expect(region).not.toHaveAttribute('data-has-steps');
    expect(screen.getByRole('heading', { level: 2, name: 'Got something to share?' })).toBeInTheDocument();
    expect(screen.getByText('Call for speakers')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit a talk' })).toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('renders steps as an ordered list with decorative numbers', () => {
    render(<CtaPanel title="Speak" headingLevel={3} variant="brand" steps={steps} />);
    const region = screen.getByRole('region', { name: 'Speak' });
    expect(region).toHaveAttribute('data-variant', 'brand');
    expect(region).toHaveAttribute('data-has-steps', 'true');
    expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
    const list = screen.getByRole('list');
    expect(list.tagName).toBe('OL');
    const items = within(list).getAllByRole('listitem');
    expect(items).toHaveLength(3);
    expect(items[1]).toHaveTextContent('Get feedback');
    expect(items[1]).toHaveTextContent('From a mentor within 7 days.');
    const number = items[2]?.querySelector('[aria-hidden="true"]');
    expect(number).toHaveTextContent('3');
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <div>
        <CtaPanel eyebrow="2027" title="Speak" description="Join us." actions={<Button>Go</Button>} steps={steps} />
        <CtaPanel variant="brand" title="Join" headingLevel={3} />
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
