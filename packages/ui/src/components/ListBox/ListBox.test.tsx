import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '../../../test/axe';
import { ListBox, ListBoxItem, ListBoxSection } from './ListBox';

describe('ListBox', () => {
  it('supports keyboard navigation and multiple selection', async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    const { container } = render(
      <ListBox aria-label="Columns" selectionMode="multiple" onSelectionChange={onSelectionChange}>
        <ListBoxSection title="Customer">
          <ListBoxItem id="name">Name</ListBoxItem>
          <ListBoxItem id="email" description="Primary address">
            Email
          </ListBoxItem>
        </ListBoxSection>
        <ListBoxItem id="city" isDisabled>
          City
        </ListBoxItem>
      </ListBox>,
    );
    await user.tab();
    await user.keyboard('{ArrowDown}{Enter}');
    expect(screen.getByRole('option', { name: /Email/ })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('option', { name: /Email/ })).toHaveAccessibleDescription('Primary address');
    expect(screen.getByRole('option', { name: 'City' })).toHaveAttribute('aria-disabled', 'true');
    expect(onSelectionChange).toHaveBeenCalled();
    expect(screen.getByRole('group', { name: 'Customer' })).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders a localized empty state', () => {
    render(<ListBox aria-label="Empty" items={[]}>{() => <ListBoxItem>x</ListBoxItem>}</ListBox>);
    expect(screen.getByText('No options')).toBeInTheDocument();
  });
});