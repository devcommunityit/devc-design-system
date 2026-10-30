import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '../../../test/axe';
import { ThemeProvider } from '../../theme/ThemeProvider';
import { ColorPicker, parseColor, type Color } from './ColorPicker';

describe('ColorPicker', () => {
  it('edits the hex value and reports a Color (uncontrolled)', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn<(c: Color) => void>();
    render(<ColorPicker label="Colore brand" defaultValue="#0f62fe" onChange={onChange} />);
    const input = screen.getByRole('textbox', { name: 'Colore brand' });
    expect(input).toHaveValue('#0F62FE');
    await user.clear(input);
    await user.type(input, '#ff0000');
    await user.tab();
    expect(onChange).toHaveBeenCalled();
    expect(onChange.mock.lastCall?.[0].toString('hex')).toBe('#FF0000');
  });

  it('opens the editor in a themed popover, selects a swatch and restores focus', async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [color, setColor] = useState<Color>(parseColor('#000000'));
      return (
        <>
          <ColorPicker label="Accento" value={color} onChange={setColor} swatches={['#e11d48', '#16a34a']} />
          <output data-testid="out">{color.toString('hex')}</output>
        </>
      );
    }
    render(
      <ThemeProvider defaultMode="dark" persistence={false}>
        <Controlled />
      </ThemeProvider>,
    );
    const trigger = screen.getByRole('button', { name: 'Color picker' });
    await user.click(trigger);
    const dialog = await screen.findByRole('dialog', { name: 'Color picker' });
    expect(dialog.closest('[data-dc-theme]')).not.toBeNull();
    expect(screen.getAllByRole('slider')).toHaveLength(2);
    const options = screen.getAllByRole('option');
    await user.click(options[1]!);
    expect(screen.getByTestId('out')).toHaveTextContent('#16A34A');
    await user.keyboard('{Escape}');
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it('disables the trigger when read-only and has no axe violations', async () => {
    const { container } = render(<ColorPicker label="Colore" defaultValue="#336699" isReadOnly description="Esadecimale" />);
    expect(screen.getByRole('button', { name: 'Color picker' })).toBeDisabled();
    expect(screen.getByRole('textbox', { name: 'Colore' })).toHaveAttribute('readonly');
    expect(await axe(container)).toHaveNoViolations();
  });
});