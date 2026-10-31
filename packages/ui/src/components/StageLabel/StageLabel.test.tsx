import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, type ReactElement } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '../../../test/axe';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { StageLabel } from './StageLabel';

const en = (ui: ReactElement) => render(<LocaleProvider locale="en-US">{ui}</LocaleProvider>);

describe('StageLabel', () => {
  it('renders a chip with localized text, data attributes, ref and DOM props', () => {
    const ref = createRef<HTMLElement>();
    en(<StageLabel ref={ref} stage="comingSoon" size="sm" data-testid="s" title="Stage" />);
    const el = screen.getByTestId('s');
    expect(ref.current).toBe(el);
    expect(el.tagName).toBe('SPAN');
    expect(el).toHaveTextContent('Coming soon');
    expect(el).toHaveAttribute('data-stage', 'comingSoon');
    expect(el).toHaveAttribute('data-size', 'sm');
    expect(el).toHaveAttribute('title', 'Stage');
  });

  it('uses the stage messages of the active locale and lets children override them', () => {
    render(
      <LocaleProvider locale="it-IT">
        <StageLabel stage="preview" />
        <StageLabel stage="new" />
        <StageLabel stage="beta">Beta pubblica</StageLabel>
      </LocaleProvider>,
    );
    expect(screen.getByText('Anteprima')).toBeInTheDocument();
    expect(screen.getByText('Nuovo')).toBeInTheDocument();
    expect(screen.getByText('Beta pubblica')).toBeInTheDocument();
    expect(screen.queryByText('Beta')).not.toBeInTheDocument();
  });

  it('renders a dismissible banner note with description and action', async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    const { container } = en(
      <StageLabel
        stage="demo"
        variant="banner"
        description="Demo environment: data is reset every night."
        action={<a href="#feedback">Send feedback</a>}
        onDismiss={onDismiss}
      />,
    );
    const note = screen.getByRole('note', { name: 'Demo' });
    expect(note).toHaveAttribute('data-stage', 'demo');
    expect(note).toHaveTextContent('Demo environment: data is reset every night.');
    expect(screen.getByRole('link', { name: 'Send feedback' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no axe violations for every stage', async () => {
    const stages = ['alpha', 'beta', 'preview', 'demo', 'new', 'experimental', 'deprecated', 'comingSoon'] as const;
    const { container } = en(
      <div>
        {stages.map((s) => (
          <StageLabel key={s} stage={s} />
        ))}
      </div>,
    );
    expect(container.querySelectorAll('[data-stage]')).toHaveLength(stages.length);
    expect(await axe(container)).toHaveNoViolations();
  });
});
