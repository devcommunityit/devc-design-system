import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '../../../test/axe';
import { Switch } from './Switch';

describe('Switch', () => {
  it('toggles with click and Space, forwards ref and description', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const ref = createRef<HTMLDivElement>();
    const { container } = render(
      <Switch ref={ref} onChange={onChange} description="Ricevi avvisi sul telefono" data-testid="sw">
        Notifiche push
      </Switch>,
    );
    expect(ref.current).toBe(screen.getByTestId('sw'));
    const sw = screen.getByRole('switch', { name: 'Notifiche push' });
    expect(sw).toHaveAccessibleDescription('Ricevi avvisi sul telefono');
    await user.click(screen.getByText('Notifiche push'));
    expect(sw).toBeChecked();
    await user.keyboard(' ');
    expect(sw).not.toBeChecked();
    expect(onChange.mock.calls).toEqual([[true], [false]]);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('respects controlled value and disabled state', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <>
        <Switch isSelected onChange={onChange}>
          Controllato
        </Switch>
        <Switch isDisabled>Disabilitato</Switch>
      </>,
    );
    const controlled = screen.getByRole('switch', { name: 'Controllato' });
    await user.click(controlled);
    expect(onChange).toHaveBeenCalledWith(false);
    expect(controlled).toBeChecked();
    expect(screen.getByRole('switch', { name: 'Disabilitato' })).toBeDisabled();
  });
});