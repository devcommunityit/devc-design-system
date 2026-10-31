import { FileText } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { useMessages } from '../../i18n/LocaleProvider';
import { cx } from '../../utils';
import { Checkbox } from '../Checkbox/Checkbox';
import styles from './FileManager.module.css';

export interface FileManagerFile {
  id: string;
  name: string;
  description?: string;
  size?: string;
  modified?: string;
}

export interface FileManagerProps {
  /** Accessible name for the file list. */
  'aria-label': string;
  files: FileManagerFile[];
  /** Controlled selected file ids. */
  selectedIds?: string[];
  /** Initial selected file ids when uncontrolled. @default [] */
  defaultSelectedIds?: string[];
  /** Called when the selected ids change. */
  onSelectionChange?: (selectedIds: string[]) => void;
  /** Consumer-rendered actions for each file; no operation is performed implicitly. */
  renderActions?: (file: FileManagerFile) => ReactNode;
  /** Content shown when there are no files. */
  emptyState?: ReactNode;
  className?: string;
}

/**
 * Accessible file listing with checkbox selection and consumer-provided actions.
 * It does not upload, download, or make network requests.
 */
export function FileManager({
  'aria-label': ariaLabel,
  files,
  selectedIds: selectedIdsProp,
  defaultSelectedIds = [],
  onSelectionChange,
  renderActions,
  emptyState,
  className,
}: FileManagerProps) {
  const t = useMessages().components;
  const [uncontrolledSelectedIds, setUncontrolledSelectedIds] = useState(defaultSelectedIds);
  const selectedIds = selectedIdsProp ?? uncontrolledSelectedIds;
  const selected = new Set(selectedIds);

  const setSelected = (id: string, isSelected: boolean) => {
    const next = isSelected ? [...selected, id] : selectedIds.filter((selectedId) => selectedId !== id);
    if (selectedIdsProp === undefined) setUncontrolledSelectedIds(next);
    onSelectionChange?.(next);
  };

  return (
    <ul className={cx(styles.list, className)} aria-label={ariaLabel}>
      {files.length ? files.map((file) => (
        <li key={file.id} className={styles.item} data-selected={selected.has(file.id) || undefined}>
          <Checkbox
            className={styles.selection}
            aria-label={t.fileSelect(file.name)}
            isSelected={selected.has(file.id)}
            onChange={(isSelected) => setSelected(file.id, isSelected)}
          />
          <FileText className={styles.icon} aria-hidden="true" />
          <div className={styles.details}>
            <span className={styles.name}>{file.name}</span>
            {file.description ? <span className={styles.description}>{file.description}</span> : null}
            {file.size || file.modified ? (
              <span className={styles.metadata}>
                {file.size}
                {file.size && file.modified ? ' · ' : ''}
                {file.modified}
              </span>
            ) : null}
          </div>
          {renderActions ? <div className={styles.actions}>{renderActions(file)}</div> : null}
        </li>
      )) : (
        <li className={styles.emptyState}>{emptyState ?? t.fileEmpty}</li>
      )}
    </ul>
  );
}
