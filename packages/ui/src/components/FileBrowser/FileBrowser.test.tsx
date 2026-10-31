import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '../../../test/axe';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { FileBrowser, type FileBrowserItem } from './FileBrowser';

const items: FileBrowserItem[] = [
  { id: 'docs', kind: 'folder', name: 'Documents', children: [
    { id: 'image', kind: 'file', name: 'Diagram', preview: { src: '/diagram.png', alt: 'Flow diagram' } },
  ] },
];

describe('FileBrowser', () => {
  it('navigates folders, previews and selects a file, and returns to root', async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    const { container } = render(<LocaleProvider locale="en-US"><FileBrowser aria-label="Files" items={items} onSelectionChange={onSelectionChange} /></LocaleProvider>);
    await user.click(screen.getByRole('button', { name: 'Documents' }));
    await user.click(screen.getByRole('button', { name: 'Preview Diagram' }));
    expect(screen.getByRole('img', { name: 'Flow diagram' })).toHaveAttribute('src', '/diagram.png');
    await user.click(screen.getByRole('checkbox', { name: 'Select Diagram' }));
    expect(onSelectionChange).toHaveBeenLastCalledWith(['image']);
    expect(await axe(container)).toHaveNoViolations();
    await user.click(within(screen.getByRole('navigation')).getByRole('button', { name: 'Files' }));
    expect(screen.queryByRole('img', { name: 'Flow diagram' })).not.toBeInTheDocument();
  });

  it('reports duplicate ids explicitly', () => {
    expect(() => render(<FileBrowser aria-label="Files" items={[{ id: 'x', kind: 'file', name: 'A' }, { id: 'x', kind: 'file', name: 'B' }]} />)).toThrow(/duplicate item id/);
  });
});
