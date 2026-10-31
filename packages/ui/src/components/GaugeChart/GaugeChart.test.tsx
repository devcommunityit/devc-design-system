import { render, screen } from '@testing-library/react';
import { createRef, type ReactElement } from 'react';
import { describe, expect, it } from 'vitest';
import { axe } from '../../../test/axe';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { GaugeChart } from './GaugeChart';

const en = (ui: ReactElement) => render(<LocaleProvider locale="en-US">{ui}</LocaleProvider>);

describe('GaugeChart', () => {
  it('exposes a meter named by the title with value, range and target', () => {
    const ref = createRef<HTMLElement>();
    const { container } = en(<GaugeChart ref={ref} title="CPU" value={68} target={80} label="Production" data-testid="gauge" />);
    expect(ref.current).toBe(screen.getByTestId('gauge'));
    const meter = screen.getByRole('meter', { name: 'CPU' });
    expect(meter).toHaveAttribute('aria-valuenow', '68');
    expect(meter).toHaveAttribute('aria-valuemin', '0');
    expect(meter).toHaveAttribute('aria-valuemax', '100');
    expect(meter).toHaveAttribute('aria-valuetext', '68, Target: 80');
    const svg = container.querySelector('svg[aria-hidden="true"]');
    expect(svg).toHaveTextContent('68');
    expect(svg).toHaveTextContent('Production');
    expect(svg).toHaveTextContent('Target');
    expect(svg).toHaveTextContent('80');
    expect(container.querySelector('path[class*="value"]')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('clamps the arc to the range but shows the actual value', () => {
    const { container } = en(<GaugeChart label="Load" value={140} />);
    const meter = screen.getByRole('meter', { name: 'Load' });
    expect(meter).toHaveAttribute('aria-valuenow', '100');
    expect(meter).toHaveAttribute('aria-valuetext', '140');
    expect(container.querySelector('svg')).toHaveTextContent('140');
  });

  it('draws one segment per status band', () => {
    const { container } = en(
      <GaugeChart
        title="Score"
        value={40}
        bands={[
          { to: 75, tone: 'warning' },
          { to: 50, tone: 'danger' },
          { to: 100, tone: 'success' },
        ]}
      />,
    );
    const tones = [...container.querySelectorAll('path[data-tone]')].map((p) => p.getAttribute('data-tone'));
    expect(tones).toEqual(['danger', 'warning', 'success']);
  });

  it('does not draw a value arc at the minimum', () => {
    const { container } = en(<GaugeChart title="Score" value={-5} />);
    expect(container.querySelector('path[class*="value"]')).not.toBeInTheDocument();
    expect(screen.getByRole('meter')).toHaveAttribute('aria-valuenow', '0');
  });

  it('sets the appearance attribute', () => {
    en(<GaugeChart title="Score" value={10} appearance="vivid" data-testid="gauge" />);
    expect(screen.getByTestId('gauge')).toHaveAttribute('data-chart-appearance', 'vivid');
  });

  it('uses Italian strings and formatting', () => {
    render(
      <LocaleProvider locale="it-IT">
        <GaugeChart value={12500} max={20000} target={15000} />
      </LocaleProvider>,
    );
    const meter = screen.getByRole('meter', { name: 'Valore' });
    expect(meter).toHaveAttribute('aria-valuetext', '12.500, Obiettivo: 15.000');
  });

  it('has no axe violations', async () => {
    const { container } = en(<GaugeChart title="CPU" description="Last hour" value={68} target={80} bands={[{ to: 60, tone: 'success' }]} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
