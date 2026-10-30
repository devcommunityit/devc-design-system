import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Bold, Italic, Link2 } from 'lucide-react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { axe } from '../../../test/axe';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { Button } from '../Button/Button';
import { IconButton } from '../IconButton/IconButton';
import { Toggle } from '../Toggle/Toggle';
import { Toolbar, ToolbarGroup, ToolbarSeparator } from './Toolbar';

function Editor({ dir }: { dir?: 'rtl' }) {
  const ref = createRef<HTMLDivElement>();
  return (
    <div dir={dir}>
      <Toolbar ref={ref} aria-label="Formatting" data-testid="tb">
        <ToolbarGroup aria-label="Style">
          <Toggle icon={<Bold />} aria-label="Bold" />
          <Toggle icon={<Italic />} aria-label="Italic" />
        </ToolbarGroup>
        <ToolbarSeparator />
        <IconButton label="Link" icon={<Link2 />} />
        <Button variant="ghost">Publish</Button>
      </Toolbar>
    </div>
  );
}

describe('Toolbar', () => {
  it('is a named toolbar with one tab stop and arrow-key navigation', async () => {
    const user = userEvent.setup();
    const { container } = render(<Editor />);
    const toolbar = screen.getByRole('toolbar', { name: 'Formatting' });
    expect(toolbar).toHaveAttribute('aria-orientation', 'horizontal');
    expect(toolbar).toHaveAttribute('data-variant', 'surface');
    expect(screen.getByRole('group', { name: 'Style' })).toBeInTheDocument();
    expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'vertical');
    await user.tab();
    expect(screen.getByRole('button', { name: 'Bold' })).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('button', { name: 'Italic' })).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('button', { name: 'Link' })).toHaveFocus();
    await user.keyboard('{ArrowLeft}');
    expect(screen.getByRole('button', { name: 'Italic' })).toHaveFocus();
    await user.tab();
    expect(document.body).toHaveFocus();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('follows the reading direction in RTL', async () => {
    const user = userEvent.setup();
    render(
      <LocaleProvider locale="ar-EG">
        <Editor dir="rtl" />
      </LocaleProvider>,
    );
    await user.tab();
    expect(screen.getByRole('button', { name: 'Bold' })).toHaveFocus();
    await user.keyboard('{ArrowLeft}');
    expect(screen.getByRole('button', { name: 'Italic' })).toHaveFocus();
  });

  it('supports vertical orientation and the plain variant', () => {
    render(
      <Toolbar aria-label="Tools" orientation="vertical" variant="plain">
        <Button>A</Button>
        <ToolbarSeparator />
        <Button>B</Button>
      </Toolbar>,
    );
    const toolbar = screen.getByRole('toolbar', { name: 'Tools' });
    expect(toolbar).toHaveAttribute('aria-orientation', 'vertical');
    expect(toolbar).toHaveAttribute('data-variant', 'plain');
    expect(screen.getByRole('separator')).not.toHaveAttribute('aria-orientation', 'vertical');
  });
});
