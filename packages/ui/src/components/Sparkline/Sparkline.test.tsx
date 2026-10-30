import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { axe } from '../../../test/axe';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { Sparkline } from './Sparkline';

describe('Sparkline', () => {
  it('renders an img with a summary in its accessible name and forwards ref and DOM props', () => {
    const ref = createRef<SVGSVGElement>();
    render(
      <LocaleProvider locale="en-US">
        <Sparkline ref={ref} label="Weekly signups" data={[12, 18, 9, 30, 24]} data-testid="s" />
      </LocaleProvider>,
    );
    const img = screen.getByRole('img', { name: 'Weekly signups: From 12 to 24; minimum 9, maximum 30.' });
    expect(ref.current).toBe(img);
    expect(img).toHaveAttribute('data-testid', 's');
    expect(img).toHaveAttribute('data-variant', 'line');
  });

  it('draws an area variant and formats values with formatOptions', () => {
    const { container } = render(
      <LocaleProvider locale="en-US">
        <Sparkline label="Revenue" variant="area" data={[1000, 2500]} formatOptions={{ style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }} />
      </LocaleProvider>,
    );
    expect(container.querySelectorAll('path')).toHaveLength(2);
    expect(screen.getByRole('img')).toHaveAccessibleName('Revenue: From €1,000 to €2,500; minimum €1,000, maximum €2,500.');
  });

  it('falls back to the label for empty data', () => {
    render(<Sparkline label="No data" data={[]} />);
    expect(screen.getByRole('img', { name: 'No data' })).toBeInTheDocument();
  });

  it('uses the Italian summary', () => {
    render(
      <LocaleProvider locale="it-IT">
        <Sparkline label="Ordini" data={[3, 5, 4]} />
      </LocaleProvider>,
    );
    expect(screen.getByRole('img')).toHaveAccessibleName('Ordini: Da 3 a 4; minimo 3, massimo 5.');
  });

  it('has no axe violations', async () => {
    const { container } = render(<Sparkline label="Trend" data={[1, 3, 2]} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
