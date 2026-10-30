import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '../../../test/axe';
import { FileUpload, type FileUploadItem } from './FileUpload';
import { matchesAccept, validateFiles } from './validateFiles';

const file = (name: string, type: string, size = 10) => new File([new Uint8Array(size)], name, { type });

const input = (container: HTMLElement) => {
  const el = container.querySelector('input[type="file"]');
  if (!(el instanceof HTMLInputElement)) throw new Error('file input not found');
  return el;
};

describe('validateFiles', () => {
  it('matches MIME, wildcards and extensions', () => {
    expect(matchesAccept(file('a.PDF', 'application/pdf'), ['.pdf'])).toBe(true);
    expect(matchesAccept(file('a.png', 'image/png'), ['image/*'])).toBe(true);
    expect(matchesAccept(file('a.txt', 'text/plain'), ['image/*', '.pdf'])).toBe(false);
    expect(matchesAccept(file('a.txt', 'text/plain'), [])).toBe(true);
  });

  it('rejects by type, size and count', () => {
    const { accepted, rejected } = validateFiles(
      [file('a.png', 'image/png'), file('b.txt', 'text/plain'), file('c.png', 'image/png', 5000), file('d.png', 'image/png')],
      { accept: ['image/*'], maxSize: 1000, maxFiles: 2 },
      1,
    );
    expect(accepted.map((f) => f.name)).toEqual(['a.png']);
    expect(rejected.map((r) => [r.file.name, r.reason])).toEqual([
      ['b.txt', 'type'],
      ['c.png', 'size'],
      ['d.png', 'count'],
    ]);
  });
});

describe('FileUpload', () => {
  it('adds accepted files, reports rejections and removes items', async () => {
    const user = userEvent.setup({ applyAccept: false });
    const onFilesAdded = vi.fn();
    const onReject = vi.fn();
    const { container } = render(
      <FileUpload label="Allegati" accept={['image/*']} maxSize={1000} onFilesAdded={onFilesAdded} onReject={onReject} />,
    );
    await user.upload(input(container), [file('photo.png', 'image/png'), file('notes.txt', 'text/plain')]);
    expect(onFilesAdded).toHaveBeenCalledTimes(1);
    expect(onFilesAdded.mock.calls[0]?.[0]).toHaveLength(1);
    expect(onReject).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('status')).toHaveTextContent('notes.txt has a file type that is not allowed.');
    const list = screen.getByRole('list', { name: '1 file' });
    expect(within(list).getByText('photo.png')).toBeInTheDocument();
    expect(within(list).getByText('Ready')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Remove photo.png' }));
    expect(screen.queryByRole('list', { name: '1 file' })).not.toBeInTheDocument();
  });

  it('describes constraints on the browse button and has no axe violations', async () => {
    const { container } = render(<FileUpload label="Documenti" accept={['.pdf']} maxFiles={3} isInvalid errorMessage="Allega almeno un file." />);
    const button = screen.getByRole('button', { name: 'Browse files' });
    expect(button).toHaveAccessibleDescription(/\.pdf.*Allega almeno un file\./);
    expect(screen.getByRole('group', { name: 'Documenti' })).toHaveAttribute('data-invalid');
    expect(await axe(container)).toHaveNoViolations();
  });

  it('enforces maxFiles across selections', async () => {
    const user = userEvent.setup();
    const { container } = render(<FileUpload label="Allegati" maxFiles={2} />);
    await user.upload(input(container), [file('a.txt', 'text/plain'), file('b.txt', 'text/plain')]);
    await user.upload(input(container), [file('c.txt', 'text/plain')]);
    expect(screen.getByRole('status')).toHaveTextContent('You can add up to 2 files.');
    expect(screen.getByRole('list', { name: '2 files' })).toBeInTheDocument();
  });

  it('shows consumer-driven upload status in controlled mode', async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [items, setItems] = useState<FileUploadItem[]>([]);
      return (
        <FileUpload
          label="Allegati"
          value={items}
          onChange={setItems}
          onFilesAdded={(added) =>
            setItems((prev) => prev.map((i) => (added.some((a) => a.id === i.id) ? { ...i, status: 'error', error: 'Server offline' } : i)))
          }
        />
      );
    }
    const { container } = render(<Controlled />);
    await user.upload(input(container), file('a.txt', 'text/plain'));
    expect(await screen.findByText('Server offline')).toBeInTheDocument();
    expect(screen.getByText('Failed')).toBeInTheDocument();
  });

  it('creates and revokes object URLs for previews', async () => {
    const create = vi.fn(() => 'blob:preview');
    const revoke = vi.fn();
    const original = { create: URL.createObjectURL, revoke: URL.revokeObjectURL };
    URL.createObjectURL = create;
    URL.revokeObjectURL = revoke;
    const user = userEvent.setup();
    const { container, unmount } = render(<FileUpload label="Foto" showPreviews />);
    await user.upload(input(container), file('a.png', 'image/png'));
    expect(create).toHaveBeenCalledTimes(1);
    act(() => unmount());
    expect(revoke).toHaveBeenCalledWith('blob:preview');
    URL.createObjectURL = original.create;
    URL.revokeObjectURL = original.revoke;
  });
});