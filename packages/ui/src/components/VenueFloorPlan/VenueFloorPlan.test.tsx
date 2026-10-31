import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '../../../test/axe';
import { nextAreaInDirection, VenueFloorPlan, type VenueArea } from './VenueFloorPlan';

const areas: VenueArea[] = [
  { id: 'stage', label: 'Main stage', kind: 'stage', shape: { x: 0, y: 0, width: 400, height: 200 }, capacity: 300, isAccessible: true },
  { id: 'lab', label: 'Lab', kind: 'room', shape: { x: 500, y: 0, width: 300, height: 200 }, description: 'Hands-on workshops' },
  { id: 'cafe', label: 'Cafe', kind: 'food', shape: { points: [[0, 300], [400, 300], [400, 500], [0, 500]] } },
  { id: 'closed', label: 'Closed room', kind: 'room', shape: { x: 500, y: 300, width: 300, height: 200 }, isDisabled: true },
];

describe('VenueFloorPlan', () => {
  it('renders areas as buttons and shows details on click', async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    const { container } = render(<VenueFloorPlan label="Venue" areas={areas} onSelectionChange={onSelectionChange} />);
    expect(screen.getAllByRole('button', { pressed: false })).toHaveLength(4);
    await user.click(screen.getByRole('button', { name: 'Main stage, Stage' }));
    expect(onSelectionChange).toHaveBeenCalledWith('stage');
    expect(screen.getByRole('button', { name: 'Main stage, Stage' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('Capacity: 300')).toBeInTheDocument();
    expect(screen.getByText('Step-free access')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('moves focus spatially with arrows and selects with Enter', async () => {
    const user = userEvent.setup();
    render(<VenueFloorPlan label="Venue" areas={areas} />);
    await user.tab();
    expect(screen.getByRole('button', { name: 'Main stage, Stage' })).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('button', { name: 'Lab, Room' })).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('button', { name: 'Closed room, Room' })).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(screen.getByRole('button', { name: 'Closed room, Room' })).toHaveAttribute('aria-pressed', 'false');
    await user.keyboard('{Home}{Enter}');
    expect(screen.getByRole('button', { name: 'Main stage, Stage' })).toHaveAttribute('aria-pressed', 'true');
    await user.keyboard('{Escape}');
    expect(screen.getByRole('button', { name: 'Main stage, Stage' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('returns focus to the area after clearing the selection', async () => {
    const user = userEvent.setup();
    render(<VenueFloorPlan label="Venue" areas={areas} defaultSelectedId="lab" />);
    expect(screen.getByText('Hands-on workshops')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Clear selection' }));
    expect(screen.getByRole('button', { name: 'Lab, Room' })).toHaveFocus();
    expect(screen.getByText('Select an area on the plan to see its details.')).toBeInTheDocument();
  });

  it('switches levels and drops selections from other floors', async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    render(
      <VenueFloorPlan
        label="Venue"
        areas={[...areas.slice(0, 2), { id: 'roof', label: 'Roof', kind: 'outdoor', level: 'top', shape: { x: 0, y: 0, width: 200, height: 200 } }]}
        levels={[{ id: 'ground', label: 'Ground' }, { id: 'top', label: 'Top' }]}
        defaultSelectedId="stage"
        onSelectionChange={onSelectionChange}
      />,
    );
    expect(screen.queryByRole('button', { name: 'Roof, Outdoor area' })).toBeNull();
    await user.click(screen.getByRole('radio', { name: 'Top' }));
    expect(screen.getByRole('button', { name: 'Roof, Outdoor area' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Main stage, Stage' })).toBeNull();
    expect(onSelectionChange).toHaveBeenCalledWith(null);
  });

  it('finds the nearest area in a direction', () => {
    const candidates = [
      { id: 'right', x: 10, y: 0 },
      { id: 'far-right', x: 30, y: 0 },
      { id: 'down', x: 0, y: 10 },
    ];
    expect(nextAreaInDirection({ x: 0, y: 0 }, candidates, 'ArrowRight')).toBe('right');
    expect(nextAreaInDirection({ x: 0, y: 0 }, candidates, 'ArrowDown')).toBe('down');
    expect(nextAreaInDirection({ x: 0, y: 0 }, candidates, 'ArrowLeft')).toBeUndefined();
  });
});
