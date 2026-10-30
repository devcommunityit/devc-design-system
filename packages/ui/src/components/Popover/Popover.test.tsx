import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { axe } from '../../../test/axe';
import { ThemeProvider } from '../../theme/ThemeProvider';
import { Button } from '../Button';
import { Popover, PopoverTrigger } from './Popover';

function Example() {
  return (
    <ThemeProvider defaultMode="dark" persistence={false}>
      <PopoverTrigger>
        <Button>Info</Button>
        <Popover title="Dettagli">
          {({ close }) => <Button onPress={close}>Chiudi popover</Button>}
        </Popover>
      </PopoverTrigger>
    </ThemeProvider>
  );
}

describe('Popover', () => {
  it('opens as a named non-modal dialog, closes with Escape and restores focus', async () => {
    const user = userEvent.setup();
    render(<Example />);
    const trigger = screen.getByRole('button', { name: 'Info' });
    await user.click(trigger);
    const dialog = await screen.findByRole('dialog', { name: 'Dettagli' });
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(dialog.closest('[data-dc-portal]')).toHaveAttribute('data-dc-resolved-scheme', 'dark');
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it('closes via the render-prop close function and has no axe violations', async () => {
    const user = userEvent.setup();
    const { baseElement } = render(<Example />);
    await user.click(screen.getByRole('button', { name: 'Info' }));
    await screen.findByRole('dialog');
    expect(await axe(baseElement)).toHaveNoViolations();
    await user.click(screen.getByRole('button', { name: 'Chiudi popover' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});