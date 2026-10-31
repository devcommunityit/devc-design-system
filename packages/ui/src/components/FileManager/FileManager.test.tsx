import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '../../../test/axe';
import { Button } from '../Button/Button';
import { FileManager, type FileManagerFile } from './FileManager';

const files: FileManagerFile[] = [
  { id: 'guide', name: 'guide.pdf', description: 'Team handbook', size: '2 MB', modified: 'Today' },
  { id: 'logo', name: 'logo.svg', size: '12 KB' },
];

describe('FileManager', () => {
  it('renders an accessible file list with selection and consumer actions', async () => {
    const onSelectionChange = vi.fn();
    const onOpen = vi.fn();
    const { container } = render(
      <FileManager
        aria-label="Project files"
        files={files}
        defaultSelectedIds={['logo']}
        onSelectionChange={onSelectionChange}
        renderActions={(file) => <Button size="sm" variant="outline" onPress={() => onOpen(file.id)}>Open</Button>}
      />,
    );
    const list = screen.getByRole('list', { name: 'Project files' });
    expect(within(list).getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByRole('checkbox', { name: 'Select logo.svg' })).toBeChecked();
    expect(await axe(container)).toHaveNoViolations();

    const user = userEvent.setup();
    await user.click(screen.getByRole('checkbox', { name: 'Select guide.pdf' }));
    expect(onSelectionChange).toHaveBeenCalledWith(['logo', 'guide']);
    await user.click(within(within(list).getAllByRole('listitem')[0]!).getByRole('button', { name: 'Open' }));
    expect(onOpen).toHaveBeenCalledWith('guide');
  });

  it('supports controlled selection, custom empty state and no implicit file actions', async () => {
    function ControlledFiles() {
      const [selectedIds, setSelectedIds] = useState<string[]>([]);
      return <FileManager aria-label="Shared files" files={files} selectedIds={selectedIds} onSelectionChange={setSelectedIds} />;
    }
    const user = userEvent.setup();
    render(<ControlledFiles />);
    await user.click(screen.getByRole('checkbox', { name: 'Select guide.pdf' }));
    expect(screen.getByRole('checkbox', { name: 'Select guide.pdf' })).toBeChecked();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();

    render(<FileManager aria-label="Empty files" files={[]} emptyState="No documents yet" />);
    expect(screen.getByRole('list', { name: 'Empty files' })).toHaveTextContent('No documents yet');
  });
});
