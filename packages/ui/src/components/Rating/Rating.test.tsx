import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '../../../test/axe';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { Rating } from './Rating';

describe('Rating', () => {
  it('is a radio group with named stars; click and arrows select', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const ref = createRef<HTMLDivElement>();
    const { container } = render(<Rating ref={ref} label="Your rating" onChange={onChange} />);
    const group = screen.getByRole('radiogroup', { name: 'Your rating' });
    expect(ref.current).toBe(group);
    const radios = screen.getAllByRole('radio');
    expect(radios).toHaveLength(5);
    expect(radios[3]).toHaveAccessibleName('4 stars out of 5');
    await user.click(screen.getByRole('radio', { name: '3 stars out of 5' }));
    expect(onChange).toHaveBeenLastCalledWith(3);
    expect(radios[2]).toBeChecked();
    expect(container.querySelectorAll('[data-filled]')).toHaveLength(3);
    await user.keyboard('{ArrowRight}');
    expect(onChange).toHaveBeenLastCalledWith(4);
    expect(container.querySelectorAll('[data-filled]')).toHaveLength(4);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('previews on hover without changing the value', async () => {
    const user = userEvent.setup();
    const { container } = render(<Rating aria-label="Rating" defaultValue={2} />);
    await user.hover(screen.getByRole('radio', { name: '5 stars out of 5' }).closest('label')!);
    expect(container.querySelectorAll('[data-filled]')).toHaveLength(5);
    expect(container.querySelector('[data-preview]')).not.toBeNull();
    expect(screen.getByRole('radio', { name: '2 stars out of 5' })).toBeChecked();
  });

  it('supports controlled value, custom max, read-only and Italian labels', async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [value, setValue] = useState<number | null>(7);
      return (
        <>
          <Rating label="Qualità" max={10} value={value} onChange={setValue} showValue />
          <button type="button" onClick={() => setValue(null)}>
            Azzera
          </button>
        </>
      );
    }
    const { container } = render(
      <LocaleProvider locale="it-IT">
        <Controlled />
      </LocaleProvider>,
    );
    expect(screen.getByRole('radio', { name: '7 stelle su 10' })).toBeChecked();
    expect(container).toHaveTextContent('7/10');
    await user.click(screen.getByRole('button', { name: 'Azzera' }));
    expect(screen.queryByRole('radio', { checked: true })).toBeNull();
    expect(screen.getByRole('radio', { name: '1 stella su 10' })).toBeInTheDocument();
  });

  it('read-only keeps the value', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Rating aria-label="Average" value={4} isReadOnly onChange={onChange} />);
    await user.click(screen.getByRole('radio', { name: '1 star out of 5' }));
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole('radio', { name: '4 stars out of 5' })).toBeChecked();
  });
});
