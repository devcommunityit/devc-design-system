import { render, screen } from '@testing-library/react';
import { createRef, type ReactElement } from 'react';
import { describe, expect, it } from 'vitest';
import { axe } from '../../../test/axe';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { LiveIndicator } from './LiveIndicator';

const en = (ui: ReactElement) => render(<LocaleProvider locale="en-US">{ui}</LocaleProvider>);

describe('LiveIndicator', () => {
  it('shows the localized label with a decorative pulsing dot', () => {
    const ref = createRef<HTMLSpanElement>();
    const { container } = en(<LiveIndicator ref={ref} data-testid="live" />);
    const root = screen.getByTestId('live');
    expect(ref.current).toBe(root);
    expect(root).toHaveTextContent('Live');
    expect(root).not.toHaveAttribute('role');
    expect(root).toHaveAttribute('data-pulse', 'true');
    expect(container.querySelector('.dot')).toHaveAttribute('aria-hidden', 'true');
  });

  it('formats the viewer count with the locale and pluralizes', () => {
    const { rerender } = render(
      <LocaleProvider locale="it-IT">
        <LiveIndicator viewers={12400} />
      </LocaleProvider>,
    );
    expect(screen.getByText('12.400 spettatori')).toBeInTheDocument();
    rerender(
      <LocaleProvider locale="en-US">
        <LiveIndicator viewers={1} label="On air" pulse={false} data-testid="live" />
      </LocaleProvider>,
    );
    expect(screen.getByText('1 viewer')).toBeInTheDocument();
    expect(screen.getByText('On air')).toBeInTheDocument();
    expect(screen.getByTestId('live')).not.toHaveAttribute('data-pulse');
  });

  it('supports compact notation', () => {
    en(<LiveIndicator viewers={12400} formatOptions={{ notation: 'compact' }} />);
    expect(screen.getByText('12K viewers')).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = en(<LiveIndicator viewers={248} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
