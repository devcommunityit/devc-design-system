import type { Editor } from '@tiptap/core';
import { Upload } from 'lucide-react';
import { useState, type RefObject } from 'react';
import { FileTrigger } from 'react-aria-components';
import { useMessages } from '../../i18n/LocaleProvider';
import { Button } from '../Button/Button';
import { Checkbox } from '../Checkbox/Checkbox';
import { Popover } from '../Popover/Popover';
import { TextField } from '../TextField/TextField';
import { LINK_REL, isSafeUrl, normalizeLinkInput, type ImageUploadResult } from './extensions';
import styles from './RichTextEditor.module.css';

interface AnchoredPopoverProps {
  editor: Editor;
  triggerRef: RefObject<HTMLElement | null>;
  isOpen: boolean;
  onClose: () => void;
}

export interface LinkPopoverProps extends AnchoredPopoverProps {
  initialHref: string;
  initialNewTab: boolean;
}

/** URL + "open in new tab" form. Only http(s), mailto, tel and relative URLs can be applied. */
export function LinkPopover({ editor, triggerRef, isOpen, onClose, initialHref, initialNewTab }: LinkPopoverProps) {
  const messages = useMessages();
  const [href, setHref] = useState(initialHref);
  const [newTab, setNewTab] = useState(initialNewTab);
  const normalized = normalizeLinkInput(href);
  const isValid = normalized === '' || isSafeUrl(normalized, 'link');
  const canApply = normalized !== '' && isValid;

  const apply = () => {
    if (!canApply) return;
    const attrs = { href: normalized, target: newTab ? '_blank' : null, rel: LINK_REL };
    const chain = editor.chain().focus();
    if (editor.state.selection.empty && !editor.isActive('link')) {
      chain
        .insertContent({ type: 'text', text: normalized, marks: [{ type: 'link', attrs }] })
        .unsetMark('link')
        .run();
    } else {
      chain.extendMarkRange('link').setLink(attrs).run();
    }
    onClose();
  };

  const remove = () => {
    editor.chain().focus().extendMarkRange('link').unsetLink().run();
    onClose();
  };

  const cancel = () => {
    onClose();
    editor.commands.focus();
  };

  return (
    <Popover
      triggerRef={triggerRef}
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) cancel();
      }}
      placement="bottom start"
      title={messages.editorLink}
      className={styles.popover}
    >
      <form
        className={styles.dialogForm}
        onSubmit={(event) => {
          event.preventDefault();
          apply();
        }}
      >
        <TextField
          label={messages.editorLinkUrl}
          value={href}
          onChange={setHref}
          isInvalid={!isValid}
          // eslint-disable-next-line jsx-a11y/no-autofocus -- initial focus of a user-opened dialog belongs on its first field
          autoFocus
          type="url"
          inputProps={{ inputMode: 'url', autoComplete: 'url', spellCheck: false }}
        />
        <Checkbox isSelected={newTab} onChange={setNewTab}>
          {messages.editorOpenInNewTab}
        </Checkbox>
        <div className={styles.dialogActions}>
          {initialHref ? (
            <Button size="sm" variant="ghost" onPress={remove} className={styles.dialogStart}>
              {messages.editorRemoveLink}
            </Button>
          ) : null}
          <Button size="sm" variant="ghost" onPress={cancel}>
            {messages.editorCancel}
          </Button>
          <Button size="sm" type="submit" isDisabled={!canApply}>
            {messages.editorApply}
          </Button>
        </div>
      </form>
    </Popover>
  );
}

export interface ImagePopoverProps extends AnchoredPopoverProps {
  initialSrc: string;
  initialAlt: string;
  /** `true` when editing the selected image instead of inserting a new one. */
  isEditing: boolean;
  onImageUpload?: (file: File) => Promise<ImageUploadResult>;
  onImageUploadError?: (error: unknown, file: File) => void;
}

/** Insert/edit image form: URL (or upload) plus alternative text, always offered. */
export function ImagePopover({
  editor,
  triggerRef,
  isOpen,
  onClose,
  initialSrc,
  initialAlt,
  isEditing,
  onImageUpload,
  onImageUploadError,
}: ImagePopoverProps) {
  const messages = useMessages();
  const [src, setSrc] = useState(initialSrc);
  const [alt, setAlt] = useState(initialAlt);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'error'>('idle');
  const trimmed = src.trim();
  const isValid = trimmed === '' || isSafeUrl(trimmed, 'image');
  const canApply = trimmed !== '' && isValid && status !== 'uploading';

  const apply = () => {
    if (!canApply) return;
    const attrs = { src: trimmed, alt: alt.trim() };
    if (isEditing) editor.chain().focus().updateAttributes('image', attrs).run();
    else editor.chain().focus().setImage(attrs).run();
    onClose();
  };

  const cancel = () => {
    onClose();
    editor.commands.focus();
  };

  const upload = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file || !onImageUpload) return;
    setStatus('uploading');
    try {
      const result = await onImageUpload(file);
      const next = typeof result === 'string' ? { src: result } : result;
      setSrc(next.src);
      if (next.alt !== undefined && !alt.trim()) setAlt(next.alt);
      setStatus('idle');
    } catch (error) {
      setStatus('error');
      onImageUploadError?.(error, file);
    }
  };

  return (
    <Popover
      triggerRef={triggerRef}
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) cancel();
      }}
      placement="bottom start"
      title={messages.editorImage}
      className={styles.popover}
    >
      <form
        className={styles.dialogForm}
        onSubmit={(event) => {
          event.preventDefault();
          apply();
        }}
      >
        <TextField
          label={messages.editorImageUrl}
          value={src}
          onChange={setSrc}
          isInvalid={!isValid}
          // eslint-disable-next-line jsx-a11y/no-autofocus -- initial focus of a user-opened dialog belongs on its first field
          autoFocus
          type="url"
          inputProps={{ inputMode: 'url', spellCheck: false }}
        />
        {onImageUpload ? (
          <div className={styles.uploadRow}>
            <FileTrigger acceptedFileTypes={['image/*']} onSelect={(files) => void upload(files)}>
              <Button size="sm" variant="outline" startIcon={<Upload />} isDisabled={status === 'uploading'}>
                {messages.browseFiles}
              </Button>
            </FileTrigger>
            <span role="status" className={styles.uploadStatus}>
              {status === 'uploading' ? messages.fileStatus.uploading : status === 'error' ? messages.fileStatus.error : ''}
            </span>
          </div>
        ) : null}
        <TextField label={messages.editorImageAlt} value={alt} onChange={setAlt} />
        <div className={styles.dialogActions}>
          <Button size="sm" variant="ghost" onPress={cancel}>
            {messages.editorCancel}
          </Button>
          <Button size="sm" type="submit" isDisabled={!canApply}>
            {messages.editorApply}
          </Button>
        </div>
      </form>
    </Popover>
  );
}
