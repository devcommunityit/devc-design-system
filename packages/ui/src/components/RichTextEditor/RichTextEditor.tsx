import type { Editor, JSONContent } from '@tiptap/core';
import { NodeSelection } from '@tiptap/pm/state';
import type { EditorView } from '@tiptap/pm/view';
import { EditorContent, useEditor, useEditorState } from '@tiptap/react';
import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type FocusEvent,
  type ReactNode,
} from 'react';
import { useLocale, useMessages } from '../../i18n/LocaleProvider';
import { cx, type CSSVariables } from '../../utils';
import { Label, type NecessityIndicator } from '../Field/Field';
import fieldStyles from '../Field/Field.module.css';
import { BlockHandle, SelectionBubble, SlashMenu } from './BlockControls';
import { blockCommands } from './commands';
import { ImagePopover, LinkPopover } from './dialogs';
import { EditorToolbar } from './EditorToolbar';
import {
  editorExtensions,
  imageFiles,
  resolveFeatures,
  uploadAndInsert,
  type EditorHandlers,
  type HeadingLevel,
  type ImageUploadResult,
  type RichTextEditorFeatures,
} from './extensions';
import styles from './RichTextEditor.module.css';

export type RichTextEditorVariant = 'toolbar' | 'blocks';

/** Payload of `onChange`: the same content in three formats. `html` is `''` when the editor is empty. */
export interface RichTextEditorValue {
  html: string;
  json: JSONContent;
  text: string;
}

export interface RichTextEditorProps {
  /** `toolbar`: fixed formatting bar. `blocks`: Notion-like ("/" commands, bubble menu, block handle). @default 'toolbar' */
  variant?: RichTextEditorVariant;
  /** Controlled content (HTML string or Tiptap JSON). */
  value?: string | JSONContent;
  /** Initial content when uncontrolled. */
  defaultValue?: string | JSONContent;
  onChange?: (value: RichTextEditorValue) => void;
  label?: ReactNode;
  description?: ReactNode;
  errorMessage?: ReactNode;
  /** @default 'icon' */
  necessityIndicator?: NecessityIndicator;
  isInvalid?: boolean;
  isRequired?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  /** Shown while the editor is empty. Defaults to the localized `editorPlaceholder`. */
  placeholder?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  /** Id of the editable region. */
  id?: string;
  /** Turn content groups off: `{ table: false, image: false }`. Everything is enabled by default. */
  features?: RichTextEditorFeatures;
  /** Heading levels offered (when `features.headings` is on). @default [1, 2, 3] */
  headingLevels?: HeadingLevel[];
  /** Hard limit on characters; typing/pasting beyond it is blocked. */
  characterLimit?: number;
  /** Live counter under the content. Defaults to characters when `characterLimit` is set. */
  showCount?: boolean | 'words' | 'characters';
  /** Uploads pasted/dropped images and files chosen in the image dialog; resolve with the final URL. */
  onImageUpload?: (file: File) => Promise<ImageUploadResult>;
  onImageUploadError?: (error: unknown, file: File) => void;
  /** Minimum height of the content area (CSS length or px). */
  minHeight?: number | string;
  /** Maximum height of the content area; content scrolls beyond it. */
  maxHeight?: number | string;
  autoFocus?: boolean;
  /** Escape hatch: receives the Tiptap `Editor` once created (and again if it is recreated). */
  onEditorReady?: (editor: Editor) => void;
  onFocus?: (event: FocusEvent) => void;
  onBlur?: (event: FocusEvent) => void;
  /** Adds a hidden input carrying the HTML, for native form submission. */
  name?: string;
  className?: string;
}

const DEFAULT_LEVELS: HeadingLevel[] = [1, 2, 3];

function toCssLength(value: number | string | undefined): string | undefined {
  return typeof value === 'number' ? `${value}px` : value;
}

function readValue(editor: Editor): RichTextEditorValue {
  return {
    html: editor.isEmpty ? '' : editor.getHTML(),
    json: editor.getJSON(),
    text: editor.getText({ blockSeparator: '\n' }),
  };
}

interface DialogState {
  kind: 'link' | 'image';
  key: number;
  href: string;
  newTab: boolean;
  src: string;
  alt: string;
  isEditing: boolean;
}

/** Positions the invisible popover anchor at the current selection. */
function selectionAnchor(view: EditorView, scroller: HTMLElement | null): { top: number; left: number } {
  if (!scroller) return { top: 0, left: 0 };
  const box = scroller.getBoundingClientRect();
  try {
    const coords = view.coordsAtPos(view.state.selection.from);
    return { top: coords.bottom - box.top + scroller.scrollTop, left: coords.left - box.left + scroller.scrollLeft };
  } catch {
    return { top: 0, left: 0 };
  }
}

/**
 * WYSIWYG editor for page content built on Tiptap/ProseMirror. Exported from `@dev-community/ui/editor`.
 */
export const RichTextEditor = forwardRef<HTMLDivElement, RichTextEditorProps>(function RichTextEditor(
  {
    variant = 'toolbar',
    value,
    defaultValue,
    onChange,
    label,
    description,
    errorMessage,
    necessityIndicator = 'icon',
    isInvalid,
    isRequired,
    isDisabled,
    isReadOnly,
    placeholder,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
    id,
    features: featuresProp,
    headingLevels = DEFAULT_LEVELS,
    characterLimit,
    showCount,
    onImageUpload,
    onImageUploadError,
    minHeight,
    maxHeight,
    autoFocus,
    onEditorReady,
    onFocus,
    onBlur,
    name,
    className,
  },
  ref,
) {
  const messages = useMessages();
  const { locale } = useLocale();
  const autoId = useId();
  const editorId = id ?? `${autoId}-editor`;
  const labelId = `${autoId}-label`;
  const descriptionId = `${autoId}-description`;
  const errorId = `${autoId}-error`;
  const counterId = `${autoId}-counter`;
  const listboxId = `${autoId}-slash`;

  const featuresKey = JSON.stringify(featuresProp ?? {});
  const features = useMemo(() => resolveFeatures(JSON.parse(featuresKey) as RichTextEditorFeatures), [featuresKey]);
  const levelsKey = headingLevels.join(',');
  const levels = useMemo(() => (levelsKey ? (levelsKey.split(',').map(Number) as HeadingLevel[]) : []), [levelsKey]);
  const isEditable = !isDisabled && !isReadOnly;
  const showError = Boolean(isInvalid && errorMessage);
  const countMode = showCount === 'words' ? 'words' : showCount || (showCount === undefined && characterLimit) ? 'characters' : null;
  const placeholderText = placeholder ?? messages.editorPlaceholder;

  const handlersRef = useRef<EditorHandlers>({});
  const rootRef = useRef<HTMLDivElement | null>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const bubbleToolbarRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLSpanElement>(null);
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const blockMenuRef = useRef<(() => boolean) | null>(null);
  const lastEmitted = useRef<{ html: string; json: JSONContent; source: unknown } | null>(null);
  const latest = useRef({ onChange, onImageUpload, onImageUploadError, onEditorReady, onFocus, onBlur, value });

  const [dialog, setDialog] = useState<(DialogState & { isOpen: boolean }) | null>(null);
  const [anchor, setAnchor] = useState({ top: 0, left: 0 });
  const [slashState, setSlashState] = useState<{ open: boolean; activeId?: string }>({ open: false });

  useLayoutEffect(() => {
    latest.current = { onChange, onImageUpload, onImageUploadError, onEditorReady, onFocus, onBlur, value };
  });

  const setRootRef = useCallback(
    (node: HTMLDivElement | null) => {
      rootRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  const extensions = useMemo(
    () => editorExtensions({ features, headingLevels: levels, variant, characterLimit, handlers: handlersRef }),
    [features, levels, variant, characterLimit],
  );

  const describedBy = [ariaDescribedBy, description ? descriptionId : null, showError ? errorId : null, countMode ? counterId : null]
    .filter(Boolean)
    .join(' ');

  const attributes = useMemo(() => {
    const attrs: Record<string, string> = {
      id: editorId,
      role: 'textbox',
      'aria-multiline': 'true',
      class: cx(styles.prose, styles.editable),
      'data-variant': variant,
    };
    if (ariaLabelledBy || label) attrs['aria-labelledby'] = ariaLabelledBy ?? labelId;
    else attrs['aria-label'] = ariaLabel ?? messages.editorLabel;
    if (describedBy) attrs['aria-describedby'] = describedBy;
    if (isInvalid) attrs['aria-invalid'] = 'true';
    if (isRequired) attrs['aria-required'] = 'true';
    if (isReadOnly) {
      attrs['aria-readonly'] = 'true';
      attrs.tabindex = '0';
    }
    if (isDisabled) attrs['aria-disabled'] = 'true';
    if (isEditable) attrs['aria-placeholder'] = placeholderText;
    if (slashState.open) {
      attrs['aria-controls'] = listboxId;
      attrs['aria-expanded'] = 'true';
      attrs['aria-haspopup'] = 'listbox';
      if (slashState.activeId) attrs['aria-activedescendant'] = slashState.activeId;
    }
    return attrs;
  }, [
    editorId,
    variant,
    ariaLabelledBy,
    label,
    labelId,
    ariaLabel,
    messages,
    describedBy,
    isInvalid,
    isRequired,
    isReadOnly,
    isDisabled,
    isEditable,
    placeholderText,
    slashState,
    listboxId,
  ]);

  const editorProps = useMemo(
    () => ({
      attributes,
      handlePaste: (view: EditorView, event: ClipboardEvent) => {
        const upload = latest.current.onImageUpload;
        const files = imageFiles(event.clipboardData?.files);
        if (!upload || !files.length || !view.state.schema.nodes.image) return false;
        event.preventDefault();
        void uploadAndInsert(view, files, upload, null, latest.current.onImageUploadError);
        return true;
      },
      handleDrop: (view: EditorView, event: DragEvent, _slice: unknown, moved: boolean) => {
        const upload = latest.current.onImageUpload;
        const files = imageFiles(event.dataTransfer?.files);
        if (moved || !upload || !files.length || !view.state.schema.nodes.image) return false;
        event.preventDefault();
        const pos = view.posAtCoords({ left: event.clientX, top: event.clientY })?.pos ?? null;
        void uploadAndInsert(view, files, upload, pos, latest.current.onImageUploadError);
        return true;
      },
    }),
    [attributes],
  );

  const emit = useCallback((instance: Editor) => {
    const next = readValue(instance);
    lastEmitted.current = { html: next.html, json: next.json, source: latest.current.value };
    if (hiddenInputRef.current) hiddenInputRef.current.value = next.html;
    latest.current.onChange?.(next);
  }, []);

  const editor = useEditor(
    {
      extensions,
      content: value ?? defaultValue ?? '',
      editable: isEditable,
      autofocus: autoFocus ? 'end' : false,
      immediatelyRender: false,
      injectCSS: false,
      shouldRerenderOnTransaction: false,
      editorProps,
      onCreate: ({ editor: instance }) => {
        const previous = lastEmitted.current;
        // The editor is recreated when `features`/`variant`/`characterLimit` change: keep uncontrolled content.
        if (previous && latest.current.value === undefined && previous.html !== (instance.isEmpty ? '' : instance.getHTML())) {
          instance.commands.setContent(previous.json, { emitUpdate: false });
        }
        if (hiddenInputRef.current) hiddenInputRef.current.value = instance.isEmpty ? '' : instance.getHTML();
        latest.current.onEditorReady?.(instance);
      },
      onUpdate: ({ editor: instance }) => emit(instance),
      onFocus: ({ event }) => latest.current.onFocus?.(event as unknown as FocusEvent),
      onBlur: ({ event }) => latest.current.onBlur?.(event as unknown as FocusEvent),
    },
    [extensions],
  );

  useEffect(() => {
    if (editor && !editor.isDestroyed) editor.setOptions({ editorProps });
  }, [editor, editorProps]);

  useEffect(() => {
    if (editor && !editor.isDestroyed && editor.isEditable !== isEditable) editor.setEditable(isEditable, false);
  }, [editor, isEditable]);

  // Controlled value: only replace the document when the incoming value really differs (keeps cursor and history).
  useEffect(() => {
    if (!editor || editor.isDestroyed || value === undefined) return;
    const previous = lastEmitted.current;
    if (previous && (value === previous.html || value === previous.json)) return;
    if (typeof value === 'string') {
      const current = editor.isEmpty ? '' : editor.getHTML();
      if (value === current || (value === '' && editor.isEmpty)) return;
    } else if (JSON.stringify(value) === JSON.stringify(editor.getJSON())) {
      return;
    }
    const { from, to } = editor.state.selection;
    editor.commands.setContent(value, { emitUpdate: false });
    const size = editor.state.doc.content.size;
    if (editor.isFocused) editor.commands.setTextSelection({ from: Math.min(from, size), to: Math.min(to, size) });
    lastEmitted.current = { html: editor.isEmpty ? '' : editor.getHTML(), json: editor.getJSON(), source: value };
    if (hiddenInputRef.current) hiddenInputRef.current.value = lastEmitted.current.html;
  }, [editor, value]);

  const openLink = useCallback(() => {
    if (!editor || !editor.isEditable || !features.link) return false;
    const attrs = editor.getAttributes('link') as { href?: string; target?: string | null };
    setAnchor(selectionAnchor(editor.view, scrollerRef.current));
    setDialog((previous) => ({
      kind: 'link',
      key: (previous?.key ?? 0) + 1,
      href: attrs.href ?? '',
      newTab: attrs.target === '_blank',
      src: '',
      alt: '',
      isEditing: Boolean(attrs.href),
      isOpen: true,
    }));
    return true;
  }, [editor, features.link]);

  const openImage = useCallback(() => {
    if (!editor || !editor.isEditable || !features.image) return;
    const { selection } = editor.state;
    const image = selection instanceof NodeSelection && selection.node.type.name === 'image' ? selection.node : null;
    setAnchor(selectionAnchor(editor.view, scrollerRef.current));
    setDialog((previous) => ({
      kind: 'image',
      key: (previous?.key ?? 0) + 1,
      href: '',
      newTab: false,
      src: (image?.attrs.src as string | undefined) ?? '',
      alt: (image?.attrs.alt as string | undefined) ?? '',
      isEditing: Boolean(image),
      isOpen: true,
    }));
  }, [editor, features.image]);

  const closeDialog = useCallback(() => setDialog((previous) => (previous ? { ...previous, isOpen: false } : previous)), []);

  useLayoutEffect(() => {
    const handlers = handlersRef.current;
    handlers.openLink = openLink;
    handlers.focusControls = () => {
      if (variant === 'toolbar') {
        const first = toolbarRef.current?.querySelector<HTMLElement>('button:not([disabled])');
        first?.focus();
        return Boolean(first);
      }
      const bubbleButton = bubbleToolbarRef.current?.querySelector<HTMLElement>('button:not([disabled])');
      if (editor && !editor.state.selection.empty && bubbleButton && bubbleButton.offsetParent !== null) {
        bubbleButton.focus();
        return true;
      }
      return blockMenuRef.current?.() ?? false;
    };
    handlers.placeholder = (instance, node) => {
      if (instance.isEmpty) return placeholderText;
      if (variant !== 'blocks') return '';
      if (node.type.name === 'heading') return messages.editorHeading(Number(node.attrs.level));
      return node.type.name === 'paragraph' ? messages.editorSlashHint : '';
    };
    handlers.taskLabel = (node) => node.textContent || messages.editorTaskList;
  });

  const slashItems = useMemo(
    () => blockCommands({ messages, features, headingLevels: levels, openImage }),
    [messages, features, levels, openImage],
  );

  const counts = useEditorState({
    editor,
    selector: () => {
      const instance = editor;
      if (!instance || !countMode) return { characters: 0, words: 0 };
      const storage = instance.storage.characterCount;
      return { characters: storage.characters(), words: storage.words() };
    },
  }) ?? { characters: 0, words: 0 };

  const formatNumber = useMemo(() => new Intl.NumberFormat(locale), [locale]);
  let counterText = '';
  let announcement = '';
  if (countMode === 'words') counterText = messages.editorWords(counts.words, formatNumber.format(counts.words));
  else if (countMode === 'characters') {
    if (characterLimit) {
      const left = Math.max(0, characterLimit - counts.characters);
      counterText = messages.editorCharactersLeft(left, formatNumber.format(left));
      if (left <= Math.max(10, Math.round(characterLimit * 0.1))) announcement = counterText;
    } else {
      counterText = messages.editorCharacters(counts.characters, formatNumber.format(counts.characters));
    }
  }
  const nearLimit = Boolean(announcement);

  const frameStyle: CSSVariables = {
    '--rte-min-height': toCssLength(minHeight),
    '--rte-max-height': toCssLength(maxHeight),
  };

  return (
    <div
      ref={setRootRef}
      className={cx(fieldStyles.field, styles.root, className)}
      data-variant={variant}
      data-invalid={isInvalid || undefined}
      data-disabled={isDisabled || undefined}
      data-readonly={isReadOnly || undefined}
    >
      {label ? (
        <Label
          elementType="span"
          id={labelId}
          isRequired={isRequired}
          necessityIndicator={necessityIndicator}
          onClick={() => editor?.commands.focus()}
        >
          {label}
        </Label>
      ) : null}
      <div className={styles.frame} style={frameStyle}>
        {editor && variant === 'toolbar' && !isReadOnly ? (
          <EditorToolbar
            editor={editor}
            features={features}
            headingLevels={levels}
            isDisabled={isDisabled}
            toolbarRef={toolbarRef}
            onOpenLink={openLink}
            onOpenImage={openImage}
          />
        ) : null}
        <div ref={scrollerRef} className={styles.scroller}>
          <EditorContent editor={editor} className={styles.content} />
          {editor && variant === 'blocks' && isEditable ? (
            <BlockHandle editor={editor} scrollerRef={scrollerRef} openRef={blockMenuRef} />
          ) : null}
          <span ref={anchorRef} className={styles.anchor} style={{ top: anchor.top, left: anchor.left }} aria-hidden="true" />
        </div>
        {countMode ? (
          <div className={styles.footer}>
            <span id={counterId} className={styles.counter} data-near-limit={nearLimit || undefined}>
              {counterText}
            </span>
          </div>
        ) : null}
      </div>
      {countMode ? (
        <span aria-live="polite" className={fieldStyles.srOnly}>
          {announcement}
        </span>
      ) : null}
      {description ? (
        <div id={descriptionId} className={fieldStyles.description}>
          {description}
        </div>
      ) : null}
      {showError ? (
        <div id={errorId} className={fieldStyles.error}>
          {errorMessage}
        </div>
      ) : null}
      {name ? <input ref={hiddenInputRef} type="hidden" name={name} disabled={isDisabled} /> : null}
      {editor && variant === 'blocks' && isEditable ? (
        <>
          <SelectionBubble
            editor={editor}
            features={features}
            appendTo={rootRef}
            toolbarRef={bubbleToolbarRef}
            onOpenLink={openLink}
            onOpenImage={openImage}
          />
          <SlashMenu handlers={handlersRef} items={slashItems} listboxId={listboxId} onActiveChange={setSlashState} />
        </>
      ) : null}
      {editor && dialog?.kind === 'link' ? (
        <LinkPopover
          key={dialog.key}
          editor={editor}
          triggerRef={anchorRef}
          isOpen={dialog.isOpen}
          onClose={closeDialog}
          initialHref={dialog.href}
          initialNewTab={dialog.newTab}
        />
      ) : null}
      {editor && dialog?.kind === 'image' ? (
        <ImagePopover
          key={dialog.key}
          editor={editor}
          triggerRef={anchorRef}
          isOpen={dialog.isOpen}
          onClose={closeDialog}
          initialSrc={dialog.src}
          initialAlt={dialog.alt}
          isEditing={dialog.isEditing}
          onImageUpload={onImageUpload}
          onImageUploadError={onImageUploadError}
        />
      ) : null}
    </div>
  );
});
