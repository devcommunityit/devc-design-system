import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '../../../test/axe';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { ThemeProvider } from '../../theme/ThemeProvider';
import { MenuItem } from '../DropdownMenu/DropdownMenu';
import { SplitButton } from './SplitButton';

function renderSplit(props: Partial<Parameters<typeof SplitButton>[0]> = {}) {
  const onPress = vi.fn();
  const onAction = vi.fn();
  const ref = createRef<HTMLDivElement>();
  const utils = render(
    <ThemeProvider>
      <SplitButton
        ref={ref}
        onPress={onPress}
        onAction={onAction}
        menu={
          <>
            <MenuItem id="draft">Save as draft</MenuItem>
            <MenuItem id="template">Save as template</MenuItem>
          </>
        }
        {...props}
      >
        Save
      </SplitButton>
    </ThemeProvider>,
  );
  return { ...utils, onPress, onAction, ref };
}

describe('SplitButton', () => {
  it('is a named group with a primary action and a menu button', async () => {
    const user = userEvent.setup();
    const { onPress, onAction, ref, container } = renderSplit();
    const group = screen.getByRole('group', { name: 'Save' });
    expect(ref.current).toBe(group);
    await user.click(within(group).getByRole('button', { name: 'Save' }));
    expect(onPress).toHaveBeenCalledTimes(1);
    const more = within(group).getByRole('button', { name: 'More actions' });
    expect(more).toHaveAttribute('aria-haspopup', 'true');
    expect(await axe(container)).toHaveNoViolations();
    await user.click(more);
    const menu = await screen.findByRole('menu');
    expect(menu.closest('[data-dc-portal]')).not.toBeNull();
    await user.click(within(menu).getByRole('menuitem', { name: 'Save as template' }));
    expect(onAction).toHaveBeenCalledWith('template');
    expect(onPress).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(more).toHaveFocus());
  });

  it('opens with the keyboard and honours disabledKeys', async () => {
    const user = userEvent.setup();
    renderSplit({ disabledKeys: ['draft'] });
    await user.tab();
    expect(screen.getByRole('button', { name: 'Save' })).toHaveFocus();
    await user.tab();
    await user.keyboard('{Enter}');
    const menu = await screen.findByRole('menu');
    expect(within(menu).getByRole('menuitem', { name: 'Save as draft' })).toHaveAttribute('aria-disabled', 'true');
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
  });

  it('disables both parts and localizes the menu label', () => {
    render(
      <LocaleProvider locale="it-IT">
        <SplitButton isDisabled menu={<MenuItem id="a">A</MenuItem>}>
          Salva
        </SplitButton>
      </LocaleProvider>,
    );
    expect(screen.getByRole('button', { name: 'Salva' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Altre azioni' })).toBeDisabled();
  });
});
