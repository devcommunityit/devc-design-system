import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { axe } from '../../../test/axe';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { CodeBlock } from './CodeBlock';

const code = "const community = { name: 'dev-community' };";

describe('CodeBlock', () => {
  it('uses the default variant without window dots', () => {
    const { container } = render(<CodeBlock code={code} language="ts" />);
    expect(container.firstElementChild).toHaveAttribute('data-variant', 'default');
    expect(container.querySelector('.dots')).toBeNull();
  });

  it('renders decorative traffic-light dots in the window variant', () => {
    const { container } = render(<CodeBlock variant="window" code={code} title="community.config.ts" />);
    expect(container.firstElementChild).toHaveAttribute('data-variant', 'window');
    const dots = container.querySelector('.dots');
    expect(dots).toHaveAttribute('aria-hidden', 'true');
    expect(dots?.children).toHaveLength(3);
    expect(screen.getByText('community.config.ts')).toBeInTheDocument();
  });

  it('keeps the copy and wrap tools in the window variant', async () => {
    render(
      <LocaleProvider locale="it-IT">
        <CodeBlock variant="window" code={code} title="community.config.ts" />
      </LocaleProvider>,
    );
    const wrap = screen.getByRole('button', { name: 'A capo automatico' });
    expect(wrap).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(wrap);
    expect(wrap).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Copia' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'community.config.ts' })).toHaveTextContent(code);
  });

  it('forwards ref and rest props', () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<CodeBlock ref={ref} variant="window" code={code} data-testid="cb" className="custom" />);
    expect(ref.current).toBe(screen.getByTestId('cb'));
    expect(ref.current).toHaveClass('custom');
  });

  it('has no axe violations in the window variant', async () => {
    const { container } = render(<CodeBlock variant="window" code={code} language="ts" title="community.config.ts" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
