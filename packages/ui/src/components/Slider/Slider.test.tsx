import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '../../../test/axe';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { RangeSlider, Slider } from './Slider';

describe('Slider', () => {
  it('renders a labelled native range input, forwards ref and DOM props', async () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(<Slider ref={ref} label="Volume" defaultValue={30} data-testid="s" name="volume" description="Applies to all devices" />);
    const input = screen.getByRole('slider', { name: 'Volume' });
    expect(input).toHaveValue('30');
    expect(input).toHaveAttribute('name', 'volume');
    expect(ref.current).toBe(screen.getByTestId('s'));
    expect(screen.getByText('30')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('changes value with the keyboard (uncontrolled) and respects step/bounds', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Slider label="Opacity" defaultValue={95} step={5} onChange={onChange} />);
    const input = screen.getByRole('slider');
    await user.tab();
    expect(input).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(onChange).toHaveBeenLastCalledWith(100);
    await user.keyboard('{ArrowRight}');
    expect(input).toHaveValue('100');
    await user.keyboard('{Home}');
    expect(onChange).toHaveBeenLastCalledWith(0);
  });

  it('is controlled and formats the output with the locale', () => {
    function Controlled() {
      const [v, setV] = useState(0.5);
      return (
        <>
          <Slider label="Sconto" minValue={0} maxValue={1} step={0.05} value={v} onChange={setV} formatOptions={{ style: 'percent' }} />
          <button type="button" onClick={() => setV(0.25)}>
            reset
          </button>
        </>
      );
    }
    render(
      <LocaleProvider locale="it-IT">
        <Controlled />
      </LocaleProvider>,
    );
    expect(screen.getByText('50%')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'reset' }));
    expect(screen.getByRole('slider')).toHaveValue('0.25');
    expect(screen.getByText('25%')).toBeInTheDocument();
  });

  it('is disabled', () => {
    render(<Slider label="Locked" defaultValue={10} isDisabled />);
    expect(screen.getByRole('slider')).toBeDisabled();
  });
});

describe('RangeSlider', () => {
  it('has two localized thumbs that cannot cross', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { container } = render(
      <LocaleProvider locale="it-IT">
        <RangeSlider label="Prezzo" defaultValue={[20, 30]} step={10} onChange={onChange} showBounds />
      </LocaleProvider>,
    );
    const start = screen.getByRole('slider', { name: /Minimo/ });
    expect(screen.getByRole('slider', { name: /Massimo/ })).toHaveValue('30');
    start.focus();
    await user.keyboard('{ArrowRight}{ArrowRight}');
    expect(onChange).toHaveBeenLastCalledWith([30, 30]);
    expect(start).toHaveValue('30');
    expect(await axe(container)).toHaveNoViolations();
  });
});