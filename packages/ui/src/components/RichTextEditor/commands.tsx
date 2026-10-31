import type { Editor } from '@tiptap/core';
import { useEditorState } from '@tiptap/react';
import {
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Highlighter,
  Image as ImageIcon,
  Italic,
  List,
  ListOrdered,
  ListTodo,
  Minus,
  Pilcrow,
  Quote,
  SquareCode,
  Strikethrough,
  Table,
  Underline,
} from 'lucide-react';
import { useEffect, useSyncExternalStore, type ReactNode, type RefObject } from 'react';
import type { Messages } from '../../i18n/messages';
import type { HeadingLevel, ResolvedFeatures, SlashCommandItem } from './extensions';

const noopSubscribe = () => () => {};

/** `true` on Apple platforms, where shortcuts use ⌘ / ⌥ instead of Ctrl / Alt. */
export function useIsMac(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => typeof navigator !== 'undefined' && /Mac|iPhone|iPad|iPod/i.test(navigator.platform || navigator.userAgent),
    () => false,
  );
}

/** Formats a Tiptap-style shortcut (`Mod-Shift-z`) for display: `⌘⇧Z` or `Ctrl+Shift+Z`. */
export function formatShortcut(shortcut: string, isMac: boolean): string {
  const parts = shortcut.split('-').map((part) => {
    switch (part) {
      case 'Mod':
        return isMac ? '⌘' : 'Ctrl';
      case 'Alt':
        return isMac ? '⌥' : 'Alt';
      case 'Shift':
        return isMac ? '⇧' : 'Shift';
      case 'ArrowUp':
        return '↑';
      case 'ArrowDown':
        return '↓';
      default:
        return part.length === 1 ? part.toUpperCase() : part;
    }
  });
  return isMac ? parts.join('') : parts.join('+');
}

export type MarkName = 'bold' | 'italic' | 'underline' | 'strike' | 'code' | 'highlight';

export interface MarkCommand {
  name: MarkName;
  label: string;
  icon: ReactNode;
  shortcut: string;
}

export function markCommands(messages: Messages, features: ResolvedFeatures): MarkCommand[] {
  const marks: MarkCommand[] = [
    { name: 'bold', label: messages.editorBold, icon: <Bold />, shortcut: 'Mod-b' },
    { name: 'italic', label: messages.editorItalic, icon: <Italic />, shortcut: 'Mod-i' },
    { name: 'underline', label: messages.editorUnderline, icon: <Underline />, shortcut: 'Mod-u' },
    { name: 'strike', label: messages.editorStrike, icon: <Strikethrough />, shortcut: 'Mod-Shift-s' },
    { name: 'code', label: messages.editorCode, icon: <Code />, shortcut: 'Mod-e' },
  ];
  if (features.highlight)
    marks.push({ name: 'highlight', label: messages.editorHighlight, icon: <Highlighter />, shortcut: 'Mod-Shift-h' });
  return marks;
}

export function toggleMark(editor: Editor, name: MarkName): void {
  editor.chain().focus().toggleMark(name).run();
}

export const HEADING_ICONS: Record<HeadingLevel, ReactNode> = {
  1: <Heading1 />,
  2: <Heading2 />,
  3: <Heading3 />,
  4: <Heading4 />,
  5: <Heading5 />,
  6: <Heading6 />,
};

/** Current text style key: `paragraph`, `h1`…`h6`, or `''` (e.g. inside a code block). */
export function currentTextStyle(editor: Editor): string {
  if (editor.isActive('paragraph')) return 'paragraph';
  for (let level = 1; level <= 6; level += 1) if (editor.isActive('heading', { level })) return `h${level}`;
  return '';
}

export function setTextStyle(editor: Editor, key: string): void {
  if (key === 'paragraph') editor.chain().focus().setParagraph().run();
  else if (key.startsWith('h'))
    editor
      .chain()
      .focus()
      .setHeading({ level: Number(key.slice(1)) as HeadingLevel })
      .run();
}

export interface EditorSnapshot {
  marks: Record<MarkName, boolean>;
  link: boolean;
  textStyle: string;
  bulletList: boolean;
  orderedList: boolean;
  taskList: boolean;
  blockquote: boolean;
  codeBlock: boolean;
  table: boolean;
  image: boolean;
  align: string;
  canUndo: boolean;
  canRedo: boolean;
  empty: boolean;
}

const EMPTY_SNAPSHOT: EditorSnapshot = {
  marks: { bold: false, italic: false, underline: false, strike: false, code: false, highlight: false },
  link: false,
  textStyle: 'paragraph',
  bulletList: false,
  orderedList: false,
  taskList: false,
  blockquote: false,
  codeBlock: false,
  table: false,
  image: false,
  align: 'start',
  canUndo: false,
  canRedo: false,
  empty: true,
};

function canRun(run: () => boolean): boolean {
  try {
    return run();
  } catch {
    return false;
  }
}

/** Active marks/nodes for toolbars and menus; re-renders only when the snapshot changes. */
export function useEditorSnapshot(editor: Editor | null): EditorSnapshot {
  return (
    useEditorState({
      editor,
      // The snapshot editor stays `null` until the first transaction: read the instance from the closure.
      selector: (): EditorSnapshot => {
        const current = editor;
        if (!current) return EMPTY_SNAPSHOT;
        const align = ['center', 'end', 'justify'].find((value) => current.isActive({ textAlign: value })) ?? 'start';
        return {
          marks: {
            bold: current.isActive('bold'),
            italic: current.isActive('italic'),
            underline: current.isActive('underline'),
            strike: current.isActive('strike'),
            code: current.isActive('code'),
            highlight: current.isActive('highlight'),
          },
          link: current.isActive('link'),
          textStyle: currentTextStyle(current),
          bulletList: current.isActive('bulletList'),
          orderedList: current.isActive('orderedList'),
          taskList: current.isActive('taskList'),
          blockquote: current.isActive('blockquote'),
          codeBlock: current.isActive('codeBlock'),
          table: current.isActive('table'),
          image: current.isActive('image'),
          align,
          canUndo: canRun(() => current.can().undo()),
          canRedo: canRun(() => current.can().redo()),
          empty: current.isEmpty,
        };
      },
    }) ?? EMPTY_SNAPSHOT
  );
}

export interface BlockCommandOptions {
  messages: Messages;
  features: ResolvedFeatures;
  headingLevels: readonly HeadingLevel[];
  openImage: () => void;
}

export interface BlockCommand extends SlashCommandItem {
  icon: ReactNode;
  shortcut?: string;
}

/** Block types offered by the slash menu (and by the toolbar's insert menu for divider/image/table). */
export function blockCommands({ messages, features, headingLevels, openImage }: BlockCommandOptions): BlockCommand[] {
  const items: BlockCommand[] = [
    {
      id: 'paragraph',
      label: messages.editorParagraph,
      keywords: ['paragraph', 'text', 'p'],
      icon: <Pilcrow />,
      shortcut: 'Mod-Alt-0',
      run: (editor, range) => editor.chain().focus().deleteRange(range).setParagraph().run(),
    },
  ];
  if (features.headings) {
    for (const level of headingLevels) {
      items.push({
        id: `h${level}`,
        label: messages.editorHeading(level),
        keywords: ['heading', 'title', `h${level}`],
        icon: HEADING_ICONS[level],
        shortcut: `Mod-Alt-${level}`,
        run: (editor, range) => editor.chain().focus().deleteRange(range).setHeading({ level }).run(),
      });
    }
  }
  if (features.lists) {
    items.push(
      {
        id: 'bulletList',
        label: messages.editorBulletList,
        keywords: ['bullet', 'list', 'ul', 'unordered'],
        icon: <List />,
        shortcut: 'Mod-Shift-8',
        run: (editor, range) => editor.chain().focus().deleteRange(range).toggleBulletList().run(),
      },
      {
        id: 'orderedList',
        label: messages.editorOrderedList,
        keywords: ['numbered', 'ordered', 'list', 'ol'],
        icon: <ListOrdered />,
        shortcut: 'Mod-Shift-7',
        run: (editor, range) => editor.chain().focus().deleteRange(range).toggleOrderedList().run(),
      },
    );
  }
  if (features.taskList) {
    items.push({
      id: 'taskList',
      label: messages.editorTaskList,
      keywords: ['task', 'todo', 'checklist', 'checkbox'],
      icon: <ListTodo />,
      shortcut: 'Mod-Shift-9',
      run: (editor, range) => editor.chain().focus().deleteRange(range).toggleTaskList().run(),
    });
  }
  if (features.blockquote) {
    items.push({
      id: 'blockquote',
      label: messages.editorBlockquote,
      keywords: ['quote', 'blockquote', 'citation'],
      icon: <Quote />,
      shortcut: 'Mod-Shift-b',
      run: (editor, range) => editor.chain().focus().deleteRange(range).toggleBlockquote().run(),
    });
  }
  if (features.codeBlock) {
    items.push({
      id: 'codeBlock',
      label: messages.editorCodeBlock,
      keywords: ['code', 'snippet', 'pre'],
      icon: <SquareCode />,
      shortcut: 'Mod-Alt-c',
      run: (editor, range) => editor.chain().focus().deleteRange(range).toggleCodeBlock().run(),
    });
  }
  if (features.horizontalRule) {
    items.push({
      id: 'divider',
      label: messages.editorDivider,
      keywords: ['divider', 'separator', 'hr', 'rule', 'line'],
      icon: <Minus />,
      run: (editor, range) => editor.chain().focus().deleteRange(range).setHorizontalRule().run(),
    });
  }
  if (features.image) {
    items.push({
      id: 'image',
      label: messages.editorImage,
      keywords: ['image', 'picture', 'photo', 'img'],
      icon: <ImageIcon />,
      run: (editor, range) => {
        editor.chain().focus().deleteRange(range).run();
        openImage();
      },
    });
  }
  if (features.table) {
    items.push({
      id: 'table',
      label: messages.editorTable,
      keywords: ['table', 'grid'],
      icon: <Table />,
      run: (editor, range) => editor.chain().focus().deleteRange(range).insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
    });
  }
  return items;
}

export function filterCommands<T extends SlashCommandItem>(items: T[], query: string): T[] {
  const q = query.trim().toLowerCase();
  if (!q) return items;
  return items.filter((item) => item.label.toLowerCase().includes(q) || item.keywords.some((word) => word.startsWith(q)));
}

/** `Escape` inside a toolbar returns focus to the text, keeping the selection. */
export function useEscapeToEditor(ref: RefObject<HTMLElement | null>, editor: Editor): void {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || event.defaultPrevented) return;
      event.preventDefault();
      editor.commands.focus();
    };
    element.addEventListener('keydown', onKeyDown);
    return () => element.removeEventListener('keydown', onKeyDown);
  }, [ref, editor]);
}
