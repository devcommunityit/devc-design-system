import { render, screen } from '@testing-library/react';
import { createRef, type ReactElement } from 'react';
import { describe, expect, it } from 'vitest';
import { axe } from '../../../test/axe';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { IndicatorBadge } from './IndicatorBadge';

const en = (ui: ReactElement) => render(<LocaleProvider locale="en-US">{ui}</LocaleProvider>);

describe('IndicatorBadge', () => {
  it('renders the count with defaults, ref and DOM props', () => {
    const ref = createRef<HTMLSpanElement>();
    en(
      <IndicatorBadge ref={ref} count={3} data-testid="i" title="Notifications">
        <button type="button">Inbox</button>
      </IndicatorBadge>,
    );
    const root = screen.getByTestId('i');
    expect(ref.current).toBe(root);
    expect(root).toHaveAttribute('title', 'Notifications');
    const bubble = screen.getByText('3');
    expect(bubble).toHaveAttribute('data-tone', 'danger');
    expect(bubble).toHaveAttribute('data-placement', 'top-end');
    expect(bubble).toHaveAttribute('data-overlap', 'rectangular');
    expect(bubble).not.toHaveAttribute('aria-hidden');
  });

  it('formats overflow with the locale and respects max', () => {
    const { rerender } = en(
      <IndicatorBadge count={150}>
        <span>x</span>
      </IndicatorBadge>,
    );
    expect(screen.getByText('99+')).toBeInTheDocument();
    rerender(
      <LocaleProvider locale="it-IT">
        <IndicatorBadge count={12000} max={9999}>
          <span>x</span>
        </IndicatorBadge>
      </LocaleProvider>,
    );
    expect(screen.getByText('9999+')).toBeInTheDocument();
    rerender(
      <LocaleProvider locale="en-US">
        <IndicatorBadge count={12000} max={9999}>
          <span>x</span>
        </IndicatorBadge>
      </LocaleProvider>,
    );
    expect(screen.getByText('9,999+')).toBeInTheDocument();
  });

  it('hides zero unless showZero, and renders a dot', () => {
    const { container, rerender } = en(
      <IndicatorBadge count={0} label="No notifications">
        <span>x</span>
      </IndicatorBadge>,
    );
    expect(container.querySelector('[data-tone]')).toBeNull();
    expect(screen.queryByText('No notifications')).not.toBeInTheDocument();
    rerender(
      <IndicatorBadge count={0} showZero>
        <span>x</span>
      </IndicatorBadge>,
    );
    expect(screen.getByText('0')).toBeInTheDocument();
    rerender(
      <IndicatorBadge dot count={7} pulse tone="success" placement="bottom-start" overlap="circular">
        <span>x</span>
      </IndicatorBadge>,
    );
    const dot = container.querySelector('[data-dot]');
    expect(dot).toHaveTextContent('');
    expect(dot).toHaveAttribute('data-pulse', 'true');
    expect(dot).toHaveAttribute('data-placement', 'bottom-start');
    expect(dot).toHaveAttribute('data-overlap', 'circular');
  });

  it('hides the bubble from assistive tech when a label is provided', async () => {
    const { container } = en(
      <IndicatorBadge count={3} label="3 unread notifications">
        <button type="button" aria-label="Notifications">
          🔔
        </button>
      </IndicatorBadge>,
    );
    expect(screen.getByText('3')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByText('3 unread notifications')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
});
