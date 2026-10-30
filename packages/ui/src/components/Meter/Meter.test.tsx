import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { axe } from '../../../test/axe';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { Meter } from './Meter';

describe('Meter', () => {
  it('is a labelled meter with value text and a linked description', async () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(
      <Meter ref={ref} label="Storage" value={42} description="4.2 GB of 10 GB" data-testid="m" />,
    );
    const meter = screen.getByRole('meter', { name: 'Storage' });
    expect(ref.current).toBe(meter);
    expect(meter).toHaveAttribute('aria-valuenow', '42');
    expect(meter).toHaveAccessibleDescription('4.2 GB of 10 GB');
    expect(meter).toHaveTextContent('42%');
    expect(meter).toHaveAttribute('data-tone', 'brand');
    expect(await axe(container)).toHaveNoViolations();
  });

  it('derives the tone from ascending thresholds', () => {
    const thresholds = { warning: 70, danger: 90 };
    const { rerender } = render(<Meter aria-label="CPU" value={20} thresholds={thresholds} />);
    expect(screen.getByRole('meter')).toHaveAttribute('data-tone', 'success');
    rerender(<Meter aria-label="CPU" value={75} thresholds={thresholds} />);
    expect(screen.getByRole('meter')).toHaveAttribute('data-tone', 'warning');
    rerender(<Meter aria-label="CPU" value={95} thresholds={thresholds} />);
    expect(screen.getByRole('meter')).toHaveAttribute('data-tone', 'danger');
    rerender(<Meter aria-label="CPU" value={95} thresholds={thresholds} tone="brand" />);
    expect(screen.getByRole('meter')).toHaveAttribute('data-tone', 'brand');
  });

  it('formats the value for the locale and supports custom ranges', () => {
    render(
      <LocaleProvider locale="it-IT">
        <Meter label="Posti occupati" value={18} maxValue={24} formatOptions={{ style: 'decimal' }} showValue />
      </LocaleProvider>,
    );
    const meter = screen.getByRole('meter', { name: 'Posti occupati' });
    expect(meter).toHaveAttribute('aria-valuemax', '24');
    expect(meter).toHaveTextContent('18');
  });
});
