import { FileText, ImageIcon, Upload, X } from 'lucide-react';
import { forwardRef, useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { DropZone, FileTrigger, isFileDropItem, type DropZoneProps } from 'react-aria-components';

type DropEvent = Parameters<NonNullable<DropZoneProps['onDrop']>>[0];
import { useLocale, useMessages } from '../../i18n/LocaleProvider';
import { cx, formatBytes, useControllableState } from '../../utils';
import { Button } from '../Button/Button';
import fieldStyles from '../Field/Field.module.css';
import { IconButton } from '../IconButton/IconButton';
import styles from './FileUpload.module.css';
import { validateFiles, type FileConstraints, type FileRejection } from './validateFiles';

export type FileUploadStatus = 'pending' | 'uploading' | 'success' | 'error';

export interface FileUploadItem {
  /** Stable id, generated when the file is added. */
  id: string;
  file: File;
  status: FileUploadStatus;
  /** 0–100 while uploading (determinate) or undefined (indeterminate). */
  progress?: number;
  /** Error shown under the file when status is 'error'. */
  error?: string;
}

export interface FileUploadProps extends FileConstraints {
  label: ReactNode;
  description?: ReactNode;
  /** Controlled list of files and their upload status. */
  value?: FileUploadItem[];
  defaultValue?: FileUploadItem[];
  onChange?: (items: FileUploadItem[]) => void;
  /**
   * Called with the newly accepted items. Start your upload here and update their status through
   * `value`/`onChange`. The component never performs network requests.
   */
  onFilesAdded?: (items: FileUploadItem[]) => void;
  /** Called with files rejected by client-side checks. */
  onReject?: (rejections: FileRejection[]) => void;
  /** @default true */
  allowsMultiple?: boolean;
  /** Show image thumbnails (object URLs are created lazily and revoked on removal/unmount). @default false */
  showPreviews?: boolean;
  isDisabled?: boolean;
  isInvalid?: boolean;
  errorMessage?: ReactNode;
  className?: string;
  style?: CSSProperties;
  id?: string;
}

let counter = 0;
const nextId = () => `dc-file-${(counter += 1)}`;

/** Thumbnail with an object URL tied to the element lifetime (revoked on unmount or file change). */
function Preview({ file }: { file: File }) {
  const ref = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const url = URL.createObjectURL(file);
    if (ref.current) ref.current.src = url;
    return () => URL.revokeObjectURL(url);
  }, [file]);
  return <img ref={ref} alt="" className={styles.preview} />;
}

/**
 * File selection by button or drag-and-drop with type/size/count checks, per-file status and removal.
 * Uploading is delegated to the consumer (`onFilesAdded` + controlled `value`).
 * Client validation does not replace server-side validation.
 */
export const FileUpload = forwardRef<HTMLDivElement, FileUploadProps>(function FileUpload(
  {
    label,
    description,
    value,
    defaultValue,
    onChange,
    onFilesAdded,
    onReject,
    accept,
    maxSize,
    maxFiles,
    allowsMultiple = true,
    showPreviews = false,
    isDisabled = false,
    isInvalid = false,
    errorMessage,
    className,
    style,
    id,
  },
  ref,
) {
  const t = useMessages();
  const { locale } = useLocale();
  const generatedId = useId();
  const baseId = id ?? generatedId;
  const labelId = `${baseId}-label`;
  const hintId = `${baseId}-hint`;
  const errorId = `${baseId}-error`;
  const [items, setItems] = useControllableState<FileUploadItem[]>(value, defaultValue ?? [], onChange, 'value');
  const [rejections, setRejections] = useState<FileRejection[]>([]);
  const max = allowsMultiple ? maxFiles : 1;

  const addFiles = (files: File[]) => {
    if (isDisabled || files.length === 0) return;
    const replacing = !allowsMultiple;
    const { accepted, rejected } = validateFiles(files, { accept, maxSize, maxFiles: max }, replacing ? 0 : items.length);
    setRejections(rejected);
    if (rejected.length > 0) onReject?.(rejected);
    if (accepted.length === 0) return;
    const added = accepted.map<FileUploadItem>((file) => ({ id: nextId(), file, status: 'pending' }));
    setItems(replacing ? added : [...items, ...added]);
    onFilesAdded?.(added);
  };

  const onDrop = async (e: DropEvent) => {
    const files = await Promise.all(e.items.filter(isFileDropItem).map((item) => item.getFile()));
    addFiles(files);
  };

  const rejectionText = (r: FileRejection) => {
    if (r.reason === 'size') return t.fileTooLarge(r.file.name, formatBytes(maxSize ?? 0, locale));
    if (r.reason === 'type') return t.fileInvalidType(r.file.name);
    return t.tooManyFiles(max ?? 0);
  };

  const constraints = t.fileConstraints({
    accept: accept?.join(', '),
    maxSize: maxSize !== undefined ? formatBytes(maxSize, locale) : undefined,
    maxFiles: allowsMultiple ? maxFiles : undefined,
  });
  const showError = isInvalid && errorMessage;

  return (
    <div
      ref={ref}
      id={id}
      className={cx(fieldStyles.field, styles.root, className)}
      style={style}
      data-disabled={isDisabled || undefined}
      data-invalid={isInvalid || undefined}
      role="group"
      aria-labelledby={labelId}
    >
      <span id={labelId} className={fieldStyles.label}>
        {label}
      </span>
      {description ? <span className={fieldStyles.description}>{description}</span> : null}
      <DropZone
        className={styles.dropzone}
        isDisabled={isDisabled}
        aria-labelledby={labelId}
        getDropOperation={() => (isDisabled ? 'cancel' : 'copy')}
        onDrop={onDrop}
      >
        <Upload aria-hidden="true" className={styles.icon} />
        <span className={styles.dropText}>{t.dropFiles}</span>
        <FileTrigger acceptedFileTypes={accept} allowsMultiple={allowsMultiple} onSelect={(list) => addFiles(list ? Array.from(list) : [])}>
          <Button variant="secondary" size="sm" isDisabled={isDisabled} aria-describedby={cx(hintId, showError ? errorId : undefined)}>
            {t.browseFiles}
          </Button>
        </FileTrigger>
        {constraints ? (
          <span id={hintId} className={styles.hint}>
            {constraints}
          </span>
        ) : null}
      </DropZone>
      {showError ? (
        <div id={errorId} className={fieldStyles.error}>
          {errorMessage}
        </div>
      ) : null}
      <div role="status" aria-live="polite" className={styles.rejections}>
        {rejections.length > 0 ? (
          <ul className={styles.rejectionList}>
            {rejections.map((r, i) => (
              <li key={`${r.file.name}-${i}`} className={fieldStyles.error}>
                {rejectionText(r)}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      {items.length > 0 ? (
        <ul className={styles.list} aria-label={t.filesSelected(items.length)}>
          {items.map((item) => {
            const isImage = item.file.type.startsWith('image/');
            const Icon = isImage ? ImageIcon : FileText;
            return (
              <li key={item.id} className={styles.item} data-status={item.status}>
                {showPreviews && isImage ? <Preview file={item.file} /> : <Icon aria-hidden="true" className={styles.fileIcon} />}
                <div className={styles.meta}>
                  <span className={styles.name}>{item.file.name}</span>
                  <span className={styles.details}>
                    {formatBytes(item.file.size, locale)} · <span className={styles.status}>{t.fileStatus[item.status]}</span>
                  </span>
                  {item.status === 'uploading' ? (
                    <progress
                      className={styles.progress}
                      max={100}
                      value={item.progress}
                      aria-label={`${t.fileStatus.uploading} ${item.file.name}`}
                    />
                  ) : null}
                  {item.status === 'error' && item.error ? <span className={fieldStyles.error}>{item.error}</span> : null}
                </div>
                <IconButton
                  size="sm"
                  label={t.remove(item.file.name)}
                  icon={<X />}
                  isDisabled={isDisabled}
                  onPress={() => setItems(items.filter((i) => i.id !== item.id))}
                />
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
});