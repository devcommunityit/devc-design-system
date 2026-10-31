import { Folder } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { useMessages } from '../../i18n/LocaleProvider';
import { cx, useControllableState } from '../../utils';
import { Button } from '../Button';
import { FileManager, type FileManagerFile } from '../FileManager';
import shared from '../composite/Composite.module.css';

export interface FileBrowserFile extends FileManagerFile {
  kind: 'file';
  /** Optional image preview. The consumer controls the URL and alternative text. */
  preview?: { src: string; alt: string };
}

export interface FileBrowserFolder {
  id: string;
  name: string;
  kind: 'folder';
  children: readonly FileBrowserItem[];
}

export type FileBrowserItem = FileBrowserFile | FileBrowserFolder;

export interface FileBrowserProps {
  'aria-label': string;
  items: readonly FileBrowserItem[];
  rootLabel?: string;
  folderId?: string | null;
  defaultFolderId?: string | null;
  onFolderChange?: (id: string | null) => void;
  selectedIds?: string[];
  defaultSelectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  onOpenFile?: (file: FileBrowserFile) => void;
  renderPreview?: (file: FileBrowserFile) => ReactNode;
  renderActions?: (file: FileBrowserFile) => ReactNode;
  emptyState?: ReactNode;
  className?: string;
}

function findFolderPath(items: readonly FileBrowserItem[], folderId: string | null): FileBrowserFolder[] {
  const seen = new Set<string>();
  let result: FileBrowserFolder[] | undefined = folderId === null ? [] : undefined;
  const walk = (entries: readonly FileBrowserItem[], path: FileBrowserFolder[]) => {
    for (const item of entries) {
      if (seen.has(item.id)) throw new Error(`FileBrowser: duplicate item id "${item.id}".`);
      seen.add(item.id);
      if (item.kind === 'folder') {
        const next = [...path, item];
        if (item.id === folderId) result = next;
        walk(item.children, next);
      }
    }
  };
  walk(items, []);
  if (!result) throw new Error(`FileBrowser: folder "${folderId}" was not found.`);
  return result;
}

/** Navigates a consumer-provided file tree; opening, previewing and persistence stay with the consumer. */
export function FileBrowser({
  'aria-label': ariaLabel, items, rootLabel, folderId: controlledFolderId, defaultFolderId = null, onFolderChange,
  selectedIds, defaultSelectedIds, onSelectionChange, onOpenFile, renderPreview, renderActions, emptyState, className,
}: FileBrowserProps) {
  const t = useMessages();
  const text = t.components;
  const [folderId, setFolderId] = useControllableState(controlledFolderId, defaultFolderId, onFolderChange, 'folderId');
  const [previewId, setPreviewId] = useState<string | null>(null);
  const path = findFolderPath(items, folderId);
  const entries = path.length ? path[path.length - 1]!.children : items;
  const folders = entries.filter((entry): entry is FileBrowserFolder => entry.kind === 'folder');
  const files = entries.filter((entry): entry is FileBrowserFile => entry.kind === 'file');
  const preview = files.find((file) => file.id === previewId);
  const goTo = (id: string | null) => {
    setPreviewId(null);
    setFolderId(id);
  };
  return (
    <section className={cx(shared.root, className)} aria-label={ariaLabel}>
      <nav aria-label={t.breadcrumb}>
        <ol className={shared.actions}>
          <li>{path.length ? <Button variant="ghost" size="sm" onPress={() => goTo(null)}>{rootLabel ?? text.fileRoot}</Button> : <span aria-current="location">{rootLabel ?? text.fileRoot}</span>}</li>
          {path.map((folder, index) => (
            <li key={folder.id}>
              <span aria-hidden="true"> / </span>
              {index === path.length - 1 ? <span aria-current="location">{folder.name}</span>
                : <Button variant="ghost" size="sm" onPress={() => goTo(folder.id)}>{folder.name}</Button>}
            </li>
          ))}
        </ol>
      </nav>
      {folders.length ? (
        <ul className={shared.list} aria-label={text.fileFolders}>
          {folders.map((folder) => (
            <li key={folder.id}>
              <Button variant="outline" startIcon={<Folder />} onPress={() => goTo(folder.id)}>{folder.name}</Button>
            </li>
          ))}
        </ul>
      ) : null}
      <FileManager
        aria-label={text.fileList}
        files={files}
        selectedIds={selectedIds}
        defaultSelectedIds={defaultSelectedIds}
        onSelectionChange={onSelectionChange}
        emptyState={emptyState}
        renderActions={(file) => {
          const item = files.find((candidate) => candidate.id === file.id);
          if (!item) throw new Error(`FileBrowser: file "${file.id}" was not found.`);
          return (
            <div className={shared.actions}>
              {renderPreview || item.preview ? <Button variant="ghost" size="sm" aria-label={text.filePreview(item.name)} onPress={() => setPreviewId(item.id)}>{text.preview}</Button> : null}
              {onOpenFile ? <Button variant="outline" size="sm" aria-label={text.fileOpen(item.name)} onPress={() => onOpenFile(item)}>{text.open}</Button> : null}
              {renderActions?.(item)}
            </div>
          );
        }}
      />
      {preview ? (
        <section className={shared.panel} aria-label={text.filePreview(preview.name)}>
          <div className={shared.toolbar}>
            <h3 className={shared.heading}>{preview.name}</h3>
            <Button variant="ghost" size="sm" onPress={() => setPreviewId(null)}>{t.close}</Button>
          </div>
          {renderPreview ? renderPreview(preview) : preview.preview ? <img className={shared.image} src={preview.preview.src} alt={preview.preview.alt} /> : null}
        </section>
      ) : null}
    </section>
  );
}
