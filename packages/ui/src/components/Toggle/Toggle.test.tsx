import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Bold, Italic, Settings, Underline } from 'lucide-react';
import { createRef, useState } from 'react';
import type { Key, Selection } from 'react-aria-components';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '../../../test/axe';
import { Button } from '../Button/Button';
import { ButtonGroup } from '../ButtonGroup/ButtonGroup';
import { IconButton } from '../IconButton/IconButton';
import { Toggle, ToggleGroup } from './Toggle';

describe('IconButton', () => {
  it('uses the label as accessible name and hides the icon', async () => {
    const onPress = vi.fn();
    const ref = createRef<HTMLButtonElement>();
    const user = userEvent.setup();
    const { container } = render(<IconButton ref={ref} label="Settings" icon={<Settings />} onPress={onPress} />);
    const button = screen.getByRole('button', { name: 'Settings' });
    expect(ref.current).toBe(button);
    expect(button).toHaveAttribute('data-variant', 'ghost');
    expect(button.querySelector('svg')?.closest('[aria-hidden="true"]')).not.toBeNull();
    await user.click(button);
    expect(onPress).toHaveBeenCalledTimes(1);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('ButtonGroup', () => {
  it('is a named group whose buttons stay separate tab stops', async () => {
    const user = userEvent.setup();
    render(
      <ButtonGroup aria-label="Export" attached>
        <Button variant="outline">CSV</Button>
        <Button variant="outline">PDF</Button>
      </ButtonGroup>,
    );
    const group = screen.getByRole('group', { name: 'Export' });
    expect(group).toHaveAttribute('data-attached');
    await user.tab();
    expect(screen.getByRole('button', { name: 'CSV' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('button', { name: 'PDF' })).toHaveFocus();
  });
});

describe('Toggle', () => {
  it('uncontrolled: toggles aria-pressed and reports changes', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Toggle defaultSelected onChange={onChange}>
        Favourite
      </Toggle>,
    );
    const toggle = screen.getByRole('button', { name: 'Favourite' });
    expect(toggle).toHaveAttribute('aria-pressed', 'true');
    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-pressed', 'false');
    expect(onChange).toHaveBeenCalledWith(false);
    toggle.focus();
    await user.keyboard(' ');
    expect(toggle).toHaveAttribute('aria-pressed', 'true');
  });

  it('controlled: follows isSelected', async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [on, setOn] = useState(false);
      return (
        <>
          <Toggle isSelected={on} onChange={setOn} icon={<Bold />} aria-label="Bold" />
          <output>{on ? 'on' : 'off'}</output>
        </>
      );
    }
    render(<Controlled />);
    const toggle = screen.getByRole('button', { name: 'Bold' });
    expect(toggle).toHaveAttribute('data-icon-only');
    await user.click(toggle);
    expect(screen.getByText('on')).toBeInTheDocument();
    expect(toggle).toHaveAttribute('aria-pressed', 'true');
  });

  it('disabled toggles do not change', async () => {
    const user = userEvent.setup();
    render(<Toggle isDisabled>Off</Toggle>);
    const toggle = screen.getByRole('button', { name: 'Off' });
    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-pressed', 'false');
    expect(toggle).toBeDisabled();
  });
});

describe('ToggleGroup', () => {
  it('single selection behaves as a radio group with arrow-key navigation', async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    const { container } = render(
      <ToggleGroup aria-label="View" defaultSelectedKeys={['list']} onSelectionChange={onSelectionChange}>
        <Toggle id="list">List</Toggle>
        <Toggle id="grid">Grid</Toggle>
        <Toggle id="map">Map</Toggle>
      </ToggleGroup>,
    );
    const group = screen.getByRole('radiogroup', { name: 'View' });
    expect(group).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'List' })).toHaveAttribute('aria-checked', 'true');
    await user.tab();
    expect(screen.getByRole('radio', { name: 'List' })).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('radio', { name: 'Grid' })).toHaveFocus();
    await user.keyboard(' ');
    expect(screen.getByRole('radio', { name: 'Grid' })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('radio', { name: 'List' })).toHaveAttribute('aria-checked', 'false');
    const last = onSelectionChange.mock.calls.at(-1)?.[0] as Set<Key>;
    expect([...last]).toEqual(['grid']);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('multiple selection (controlled) uses toggle buttons', async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [selected, setSelected] = useState<Selection>(new Set<Key>(['bold']));
      return (
        <ToggleGroup aria-label="Formatting" selectionMode="multiple" selectedKeys={selected} onSelectionChange={setSelected}>
          <Toggle id="bold" icon={<Bold />} aria-label="Bold" />
          <Toggle id="italic" icon={<Italic />} aria-label="Italic" />
          <Toggle id="underline" icon={<Underline />} aria-label="Underline" />
        </ToggleGroup>
      );
    }
    render(<Controlled />);
    await user.click(screen.getByRole('button', { name: 'Italic' }));
    expect(screen.getByRole('button', { name: 'Bold' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Italic' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Underline' })).toHaveAttribute('aria-pressed', 'false');
  });
});
