import { Node, type ChainedCommands, type JSONContent } from '@tiptap/core';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Placeholder } from '@tiptap/extensions';
import { Bold, Italic, Link2, List, ListOrdered, Strikethrough, Underline, Unlink } from 'lucide-react';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { useMessages } from '../../i18n/LocaleProvider';
import { cx } from '../../utils';
import { Button } from '../Button/Button';
import { TextField } from '../TextField/TextField';
import { Toggle } from '../Toggle/Toggle';
import { Toolbar, ToolbarGroup, ToolbarSeparator } from '../Toolbar/Toolbar';
import type { EmailRichText } from './emailDocument';
import { sanitizeEmailUrl } from './renderEmailHtml';
import styles from './EmailBuilder.module.css';

/** Single-paragraph document used by heading blocks (Enter cannot split it). */
const SingleLineDocument = Node.create({ name: 'doc', topNode: true, content: 'paragraph' });

export interface EmailInlineEditorProps {
  value: EmailRichText;
  onChange: (value: EmailRichText) => void;
  /** `heading`: one line, no lists. */
  variant?: 'heading' | 'text';
  /** Accessible name of the editable region. */
  label: string;
  placeholder?: string;
  isReadOnly?: boolean;
  /** Typography of the email content (inline styles from the document settings). */
  contentStyle?: CSSProperties;
  className?: string;
}

/** Small Tiptap editor used inside the email canvas and inspector: bold, italic, underline, strike, link, lists. */
export function EmailInlineEditor({
  value,
  onChange,
  variant = 'text',
  label,
  placeholder,
  isReadOnly = false,
  contentStyle,
  className,
}: EmailInlineEditorProps) {
  const t = useMessages();
  const lastEmitted = useRef(JSON.stringify(value));
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  });
  const [linkDraft, setLinkDraft] = useState<string | null>(null);
  const isHeading = variant === 'heading';

  const editor = useEditor({
    immediatelyRender: true,
    shouldRerenderOnTransaction: true,
    editable: !isReadOnly,
    content: value as JSONContent,
    extensions: [
      ...(isHeading ? [SingleLineDocument] : []),
      StarterKit.configure({
        ...(isHeading
          ? { document: false as const, bulletList: false as const, orderedList: false as const, listItem: false as const, listKeymap: false as const }
          : {}),
        heading: false,
        blockquote: false,
        code: false,
        codeBlock: false,
        horizontalRule: false,
        dropcursor: false,
        gapcursor: false,
        trailingNode: false,
        link: {
          openOnClick: false,
          autolink: true,
          defaultProtocol: 'https',
          isAllowedUri: (url) => sanitizeEmailUrl(url) !== '#',
          HTMLAttributes: { rel: 'noopener noreferrer', target: null },
        },
      }),
      Placeholder.configure({ placeholder: placeholder ?? t.editorPlaceholder }),
    ],
    editorProps: {
      attributes: {
        role: 'textbox',
        'aria-label': label,
        'aria-multiline': String(!isHeading),
        ...(isReadOnly ? { 'aria-readonly': 'true' } : {}),
        class: styles.prose ?? '',
      },
    },
    onUpdate: ({ editor: instance }) => {
      const json = instance.getJSON() as EmailRichText;
      lastEmitted.current = JSON.stringify(json);
      onChangeRef.current(json);
    },
  });

  useEffect(() => {
    if (!editor || editor.isDestroyed) return;
    const next = JSON.stringify(value);
    if (next !== lastEmitted.current) {
      lastEmitted.current = next;
      editor.commands.setContent(value as JSONContent, { emitUpdate: false });
    }
  }, [editor, value]);

  useEffect(() => {
    editor?.setEditable(!isReadOnly);
  }, [editor, isReadOnly]);

  const active = (name: string) => (editor ? editor.isActive(name) : false);
  const run = (fn: (chain: ChainedCommands) => ChainedCommands) => {
    if (editor) fn(editor.chain().focus()).run();
  };

  const applyLink = () => {
    if (!editor || linkDraft === null) return;
    const href = linkDraft.trim();
    if (!href) editor.chain().focus().extendMarkRange('link').unsetLink().run();
    else if (sanitizeEmailUrl(href) !== '#') editor.chain().focus().extendMarkRange('link').setLink({ href }).run();
    setLinkDraft(null);
  };

  // Rows of the canvas are draggable: while selecting text inside the editor, suspend row dragging.
  const suspendDrag = (target: EventTarget) => {
    const row = (target as Element).closest?.('[draggable="true"]');
    if (!row) return;
    row.setAttribute('draggable', 'false');
    const restore = () => {
      row.setAttribute('draggable', 'true');
      document.removeEventListener('pointerup', restore, true);
    };
    document.addEventListener('pointerup', restore, true);
  };

  return (
    <div
      className={cx(styles.inlineEditor, className)}
      data-variant={variant}
      // Keep pointer/keyboard interaction inside the editor from reaching the canvas row (selection, drag).
      onPointerDown={(event) => event.stopPropagation()}
      onPointerDownCapture={(event) => suspendDrag(event.currentTarget)}
      onMouseDown={(event) => event.stopPropagation()}
      onClick={(event) => event.stopPropagation()}
      onKeyDown={(event) => event.stopPropagation()}
      role="presentation"
    >
      {!isReadOnly ? (
        <Toolbar aria-label={t.editorToolbar} variant="plain" className={styles.formatBar}>
          <ToolbarGroup>
            <Toggle
              size="sm"
              variant="ghost"
              aria-label={t.editorBold}
              icon={<Bold />}
              isSelected={active('bold')}
              onChange={() => run((c) => c.toggleBold())}
            />
            <Toggle
              size="sm"
              variant="ghost"
              aria-label={t.editorItalic}
              icon={<Italic />}
              isSelected={active('italic')}
              onChange={() => run((c) => c.toggleItalic())}
            />
            <Toggle
              size="sm"
              variant="ghost"
              aria-label={t.editorUnderline}
              icon={<Underline />}
              isSelected={active('underline')}
              onChange={() => run((c) => c.toggleUnderline())}
            />
            <Toggle
              size="sm"
              variant="ghost"
              aria-label={t.editorStrike}
              icon={<Strikethrough />}
              isSelected={active('strike')}
              onChange={() => run((c) => c.toggleStrike())}
            />
          </ToolbarGroup>
          <ToolbarSeparator />
          <ToolbarGroup>
            <Toggle
              size="sm"
              variant="ghost"
              aria-label={t.editorLink}
              icon={<Link2 />}
              isSelected={linkDraft !== null || active('link')}
              onChange={() => setLinkDraft(linkDraft !== null ? null : ((editor?.getAttributes('link').href as string | undefined) ?? ''))}
            />
            {active('link') ? (
              <Toggle
                size="sm"
                variant="ghost"
                aria-label={t.editorRemoveLink}
                icon={<Unlink />}
                isSelected={false}
                onChange={() => run((c) => c.extendMarkRange('link').unsetLink())}
              />
            ) : null}
          </ToolbarGroup>
          {!isHeading ? (
            <>
              <ToolbarSeparator />
              <ToolbarGroup>
                <Toggle
                  size="sm"
                  variant="ghost"
                  aria-label={t.editorBulletList}
                  icon={<List />}
                  isSelected={active('bulletList')}
                  onChange={() => run((c) => c.toggleBulletList())}
                />
                <Toggle
                  size="sm"
                  variant="ghost"
                  aria-label={t.editorOrderedList}
                  icon={<ListOrdered />}
                  isSelected={active('orderedList')}
                  onChange={() => run((c) => c.toggleOrderedList())}
                />
              </ToolbarGroup>
            </>
          ) : null}
        </Toolbar>
      ) : null}
      {linkDraft !== null ? (
        <div className={styles.linkForm}>
          <TextField
            label={t.editorLinkUrl}
            value={linkDraft}
            onChange={setLinkDraft}
            type="url"
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            description="https://, mailto:, tel:, {{merge_tag}}"
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                applyLink();
              } else if (event.key === 'Escape') {
                setLinkDraft(null);
                editor?.commands.focus();
              }
            }}
          />
          <div className={styles.linkActions}>
            <Button size="sm" variant="secondary" onPress={() => setLinkDraft(null)}>
              {t.editorCancel}
            </Button>
            <Button size="sm" onPress={applyLink}>
              {t.editorApply}
            </Button>
          </div>
        </div>
      ) : null}
      <EditorContent editor={editor} className={styles.editorContent} style={contentStyle} />
    </div>
  );
}
