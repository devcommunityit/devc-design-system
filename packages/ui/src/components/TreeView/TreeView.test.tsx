import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Folder } from 'lucide-react';
import { useState } from 'react';
import type { Key, Selection } from 'react-aria-components';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '../../../test/axe';
import { TreeView, TreeViewItem } from './TreeView';

function Files(props: { onExpandedChange?: (keys: Set<Key>) => void; selectionMode?: 'none' | 'single' | 'multiple'; onSelectionChange?: (keys: Selection) => void }) {
  return (
    <TreeView aria-label="Files" defaultExpandedKeys={['docs']} {...props}>
      <TreeViewItem id="docs" title="Documents" icon={<Folder />} description="2">
        <TreeViewItem id="report" title="Report.pdf" />
        <TreeViewItem id="budget" title="Budget.xlsx" />
      </TreeViewItem>
      <TreeViewItem id="photos" title="Photos" icon={<Folder />}>
        <TreeViewItem id="beach" title="Beach.jpg" />
      </TreeViewItem>
      <TreeViewItem id="notes" title="Notes.txt" />
    </TreeView>
  );
}

describe('TreeView', () => {
  it('renders a treegrid with levels, expansion state and visible children', async () => {
    const { container } = render(<Files />);
    const tree = screen.getByRole('treegrid', { name: 'Files' });
    const rows = within(tree).getAllByRole('row');
    expect(rows.map((r) => r.textContent)).toEqual(['Documents2', 'Report.pdf', 'Budget.xlsx', 'Photos', 'Notes.txt']);
    expect(rows[0]).toHaveAttribute('aria-expanded', 'true');
    expect(rows[0]).toHaveAttribute('aria-level', '1');
    expect(rows[1]).toHaveAttribute('aria-level', '2');
    expect(rows[3]).toHaveAttribute('aria-expanded', 'false');
    expect(rows[4]).not.toHaveAttribute('aria-expanded');
    expect(await axe(container)).toHaveNoViolations();
  });

  it('expands and collapses with arrow keys and the chevron button', async () => {
    const user = userEvent.setup();
    const onExpandedChange = vi.fn();
    render(<Files onExpandedChange={onExpandedChange} />);
    await user.tab();
    const docs = screen.getByRole('row', { name: /Documents/ });
    expect(docs).toHaveFocus();
    await user.keyboard('{ArrowLeft}');
    expect(docs).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('row', { name: 'Report.pdf' })).toBeNull();
    await user.keyboard('{ArrowDown}{ArrowRight}');
    expect(screen.getByRole('row', { name: /Photos/ })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('row', { name: 'Beach.jpg' })).toBeInTheDocument();
    const chevron = within(screen.getByRole('row', { name: /Photos/ })).getByRole('button');
    expect(chevron).toHaveAccessibleName();
    await user.click(chevron);
    expect(screen.queryByRole('row', { name: 'Beach.jpg' })).toBeNull();
    expect(onExpandedChange).toHaveBeenCalled();
  });

  it('supports multiple selection with checkboxes (controlled)', async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [selected, setSelected] = useState<Selection>(new Set(['notes']));
      return (
        <>
          <Files selectionMode="multiple" onSelectionChange={setSelected} />
          <output>{selected === 'all' ? 'all' : [...selected].join(',')}</output>
        </>
      );
    }
    const { container } = render(<Controlled />);
    const report = screen.getByRole('row', { name: 'Report.pdf' });
    await user.click(within(report).getByRole('checkbox'));
    expect(report).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('status')).toHaveTextContent('report');
    expect(await axe(container)).toHaveNoViolations();
  });
});
