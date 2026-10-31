import { autoUpdate, computePosition, flip, offset, shift, size, type VirtualElement } from '@floating-ui/dom';
import type { Editor } from '@tiptap/core';
import type { Slice } from '@tiptap/pm/model';
import { NodeSelection } from '@tiptap/pm/state';
import type { EditorView } from '@tiptap/pm/view';
import { BubbleMenu } from '@tiptap/react/menus';
import { ArrowDown, ArrowUp, Copy, GripVertical, Image as ImageIcon, Link as LinkIcon, Plus, Trash } from 'lucide-react';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type DragEvent, type RefObject } from 'react';
import { useMessages } from '../../i18n/LocaleProvider';
import { cx } from '../../utils';
import { DropdownMenu, Menu, MenuItem, MenuSeparator } from '../DropdownMenu/DropdownMenu';
import { IconButton } from '../IconButton/IconButton';
import { Toggle } from '../Toggle/Toggle';
import { Toolbar } from '../Toolbar/Toolbar';
import { Tooltip } from '../Tooltip/Tooltip';
import {
  filterCommands,
  formatShortcut,
  markCommands,
  toggleMark,
  useEditorSnapshot,
  useEscapeToEditor,
  useIsMac,
  type BlockCommand,
} from './commands';
import { tableItems } from './EditorToolbar';
import {
  deleteBlock,
  duplicateBlock,
  getBlockAt,
  getBlockByIndex,
  getCurrentBlock,
  moveBlock,
  type EditorHandlers,
  type ResolvedFeatures,
  type SlashCommandItem,
} from './extensions';
import styles from './RichTextEditor.module.css';

/* ----------------------------------------------------------------------------------------------
 * Bubble menu (text selection)
 * -------------------------------------------------------------------------------------------- */

export interface SelectionBubbleProps {
  editor: Editor;
  features: ResolvedFeatures;
  appendTo: RefObject<HTMLElement | null>;
  toolbarRef: RefObject<HTMLDivElement | null>;
  onOpenLink: () => void;
  onOpenImage: () => void;
}

type ShouldShow = NonNullable<Parameters<typeof BubbleMenu>[0]['shouldShow']>;

/** Inline formatting shown on a non-empty text selection (or image editing on a selected image). */
export function SelectionBubble({ editor, features, appendTo, toolbarRef, onOpenLink, onOpenImage }: SelectionBubbleProps) {
  const messages = useMessages();
  const isMac = useIsMac();
  const state = useEditorSnapshot(editor);
  useEscapeToEditor(toolbarRef, editor);
  const shouldShow = useCallback<ShouldShow>(({ editor: current, element, view, state: pmState, from, to }) => {
    if (!current.isEditable) return false;
    if (!view.hasFocus() && !element.contains(document.activeElement)) return false;
    const { selection } = pmState;
    if (selection instanceof NodeSelection) return selection.node.type.name === 'image';
    if (selection.empty) return false;
    if (pmState.doc.resolve(from).parent.type.spec.code) return false;
    return pmState.doc.textBetween(from, to, ' ').trim().length > 0;
  }, []);
  const options = useMemo(
    () => ({ strategy: 'fixed' as const, placement: 'top' as const, offset: 8, flip: true, shift: { padding: 8 } }),
    [],
  );
  const resolveAppendTo = useCallback(() => resolveContainer(appendTo, editor), [appendTo, editor]);

  return (
    <BubbleMenu editor={editor} shouldShow={shouldShow} options={options} appendTo={resolveAppendTo} className={styles.bubble}>
      <Toolbar ref={toolbarRef} aria-label={messages.editorToolbar} className={styles.bubbleToolbar}>
        {state.image ? (
          <IconButton size="sm" variant="ghost" label={messages.editorImage} icon={<ImageIcon />} onPress={onOpenImage} />
        ) : (
          <>
            {markCommands(messages, features).map((mark) => (
              <Tooltip key={mark.name} content={`${mark.label} (${formatShortcut(mark.shortcut, isMac)})`}>
                <Toggle
                  size="sm"
                  variant="ghost"
                  icon={mark.icon}
                  aria-label={mark.label}
                  isSelected={state.marks[mark.name]}
                  onChange={() => toggleMark(editor, mark.name)}
                />
              </Tooltip>
            ))}
            {features.link ? (
              <Tooltip content={`${messages.editorLink} (${formatShortcut('Mod-k', isMac)})`}>
                <Toggle
                  size="sm"
                  variant="ghost"
                  icon={<LinkIcon />}
                  aria-label={messages.editorLink}
                  isSelected={state.link}
                  onChange={onOpenLink}
                />
              </Tooltip>
            ) : null}
          </>
        )}
      </Toolbar>
    </BubbleMenu>
  );
}

/* ----------------------------------------------------------------------------------------------
 * Slash command menu
 * -------------------------------------------------------------------------------------------- */

interface SlashSession {
  query: string;
  clientRect: (() => DOMRect | null) | null;
  command: (item: SlashCommandItem) => void;
}

export interface SlashMenuProps {
  handlers: RefObject<EditorHandlers>;
  items: BlockCommand[];
  listboxId: string;
  /** Reports the open state and active option id, mirrored on the editor with `aria-controls`/`aria-activedescendant`. */
  onActiveChange: (state: { open: boolean; activeId?: string }) => void;
}

/** Listbox opened by typing "/" at the start of (or inside) a block; filtered by the text typed after the slash. */
export function SlashMenu({ handlers, items, listboxId, onActiveChange }: SlashMenuProps) {
  const messages = useMessages();
  const [session, setSession] = useState<SlashSession | null>(null);
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const filtered = useMemo(() => (session ? filterCommands(items, session.query) : []), [items, session]);
  const activeIndex = filtered.length ? Math.min(active, filtered.length - 1) : -1;
  const optionId = (index: number) => `${listboxId}-${filtered[index]?.id ?? index}`;
  const latest = useRef({ filtered, activeIndex, session });

  useLayoutEffect(() => {
    latest.current = { filtered, activeIndex, session };
  });

  useLayoutEffect(() => {
    return registerSlash(handlers, {
      onStart: (props) => {
        setActive(0);
        setSession({ query: props.query, clientRect: props.clientRect ?? null, command: props.command });
      },
      onUpdate: (props) => {
        if (latest.current.session?.query !== props.query) setActive(0);
        setSession({ query: props.query, clientRect: props.clientRect ?? null, command: props.command });
      },
      onExit: () => setSession(null),
      onKeyDown: ({ event }) => {
        const { filtered: list, activeIndex: index, session: current } = latest.current;
        if (!current || event.key === 'Escape') return false;
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
          if (!list.length) return true;
          const delta = event.key === 'ArrowDown' ? 1 : -1;
          setActive((index + delta + list.length) % list.length);
          return true;
        }
        if (event.key === 'Home' || event.key === 'End') {
          if (!list.length) return false;
          setActive(event.key === 'Home' ? 0 : list.length - 1);
          return true;
        }
        if (event.key === 'Enter' || event.key === 'Tab') {
          const item = list[index];
          if (!item) return false;
          current.command(item);
          return true;
        }
        return false;
      },
    });
  }, [handlers]);

  const open = session !== null;
  const activeId = activeIndex >= 0 ? optionId(activeIndex) : undefined;
  useEffect(() => {
    onActiveChange({ open, activeId: open ? activeId : undefined });
  }, [open, activeId, onActiveChange]);

  const clientRect = session?.clientRect;
  useLayoutEffect(() => {
    const floating = listRef.current;
    if (!floating || !clientRect) return;
    const reference: VirtualElement = { getBoundingClientRect: () => clientRect() ?? new DOMRect() };
    const update = () => {
      void computePosition(reference, floating, {
        strategy: 'fixed',
        placement: 'bottom-start',
        middleware: [
          offset(6),
          flip({ padding: 8 }),
          shift({ padding: 8 }),
          size({
            padding: 8,
            apply: ({ availableHeight }) => {
              floating.style.maxBlockSize = `${Math.max(160, Math.min(availableHeight, 320))}px`;
            },
          }),
        ],
      }).then(({ x, y }) => {
        Object.assign(floating.style, { left: `${x}px`, top: `${y}px` });
      });
    };
    return autoUpdate(reference, floating, update, { ancestorResize: false, elementResize: false, animationFrame: false });
  }, [clientRect]);

  useEffect(() => {
    if (!activeId) return;
    document.getElementById(activeId)?.scrollIntoView({ block: 'nearest' });
  }, [activeId]);

  if (!session) return null;
  const activeItem = filtered[activeIndex];

  return (
    <div ref={listRef} className={styles.slash}>
      <div role="listbox" id={listboxId} aria-label={messages.editorInsertBlock} className={styles.slashList}>
        {filtered.map((item, index) => (
          <div
            key={item.id}
            id={optionId(index)}
            role="option"
            aria-selected={index === activeIndex}
            tabIndex={-1}
            className={styles.slashOption}
            data-active={index === activeIndex || undefined}
            onMouseDown={(event) => event.preventDefault()}
            onMouseMove={() => {
              if (index !== activeIndex) setActive(index);
            }}
            onClick={() => session.command(item)}
            onKeyDown={() => {}}
          >
            <span className={styles.slashIcon} aria-hidden="true">
              {item.icon}
            </span>
            <span className={styles.slashLabel}>{item.label}</span>
          </div>
        ))}
      </div>
      {filtered.length === 0 ? <div className={styles.slashEmpty}>{messages.editorNoResults}</div> : null}
      <div aria-live="polite" aria-atomic="true" className={styles.srOnly}>
        {filtered.length === 0
          ? messages.editorNoResults
          : activeItem
            ? `${activeItem.label}, ${activeIndex + 1} / ${filtered.length}`
            : ''}
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------------------------------------
 * Block handle (hover / focus) with drag-to-reorder and actions menu
 * -------------------------------------------------------------------------------------------- */

export interface BlockHandleProps {
  editor: Editor;
  scrollerRef: RefObject<HTMLDivElement | null>;
  /** Imperative opener used by `Alt+F10` when nothing is selected. */
  openRef: RefObject<(() => boolean) | null>;
}

function blockTop(view: EditorView, start: number, scroller: HTMLElement): number | null {
  const dom = view.nodeDOM(start);
  if (!(dom instanceof HTMLElement)) return null;
  return dom.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop;
}

export function BlockHandle({ editor, scrollerRef, openRef }: BlockHandleProps) {
  const messages = useMessages();
  const isMac = useIsMac();
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [selectionIndex, setSelectionIndex] = useState<number | null>(null);
  const [menuIndex, setMenuIndex] = useState<number | null>(null);
  const [top, setTop] = useState<number | null>(null);
  const [isTable, setIsTable] = useState(false);
  const [blockCount, setBlockCount] = useState(0);
  const gripRef = useRef<HTMLButtonElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const index = menuIndex ?? hoverIndex ?? selectionIndex;

  useEffect(() => {
    const sync = () => {
      if (editor.isDestroyed) return;
      setSelectionIndex(getCurrentBlock(editor.state)?.index ?? null);
      setBlockCount(editor.state.doc.childCount);
    };
    sync();
    editor.on('selectionUpdate', sync);
    editor.on('update', sync);
    return () => {
      editor.off('selectionUpdate', sync);
      editor.off('update', sync);
    };
  }, [editor]);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const onMove = (event: MouseEvent) => {
      if (handleRef.current?.contains(event.target as Node) || editor.isDestroyed) return;
      const dom = editor.view.dom.getBoundingClientRect();
      const found = editor.view.posAtCoords({ left: Math.max(event.clientX, dom.left + 1), top: event.clientY });
      if (!found) return;
      setHoverIndex(getBlockAt(editor.state.doc, found.inside >= 0 ? found.inside : found.pos)?.index ?? null);
    };
    const onLeave = () => setHoverIndex(null);
    scroller.addEventListener('mousemove', onMove);
    scroller.addEventListener('mouseleave', onLeave);
    return () => {
      scroller.removeEventListener('mousemove', onMove);
      scroller.removeEventListener('mouseleave', onLeave);
    };
  }, [editor, scrollerRef]);

  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    const block = index === null || editor.isDestroyed ? null : getBlockByIndex(editor.state.doc, index);
    const nextTop = block && scroller ? blockTop(editor.view, block.start, scroller) : null;
    setTop(nextTop);
    setIsTable(block?.node.type.name === 'table');
  }, [editor, index, blockCount, scrollerRef]);

  useEffect(() => {
    const grip = gripRef.current;
    grip?.setAttribute('draggable', 'true');
  });

  useLayoutEffect(() => {
    openRef.current = () => {
      const block = getCurrentBlock(editor.state);
      if (!block || !editor.isEditable) return false;
      setMenuIndex(block.index);
      return true;
    };
    return () => {
      openRef.current = null;
    };
  }, [editor, openRef]);

  const closeMenu = () => {
    setMenuIndex(null);
    window.setTimeout(() => {
      if (!editor.isDestroyed) editor.commands.focus();
    }, 0);
  };

  const onAction = (key: string | number) => {
    const target = menuIndex ?? index ?? undefined;
    if (target === undefined) return;
    if (key === 'moveUp') moveBlock(editor, -1, target);
    else if (key === 'moveDown') moveBlock(editor, 1, target);
    else if (key === 'duplicate') duplicateBlock(editor, target);
    else if (key === 'delete') deleteBlock(editor, target);
    else {
      const block = getBlockByIndex(editor.state.doc, target);
      if (block && !(editor.state.selection.from > block.start && editor.state.selection.to < block.end)) {
        editor.commands.setTextSelection(block.start + 3);
      }
      const chain = editor.chain();
      if (key === 'addRow') chain.addRowAfter().run();
      else if (key === 'addColumn') chain.addColumnAfter().run();
      else if (key === 'deleteRow') chain.deleteRow().run();
      else if (key === 'deleteColumn') chain.deleteColumn().run();
      else if (key === 'deleteTable') chain.deleteTable().run();
    }
    closeMenu();
  };

  const insertBelow = () => {
    const target = index === null ? null : getBlockByIndex(editor.state.doc, index);
    if (!target) return;
    if (target.node.type.name === 'paragraph' && target.node.content.size === 0) {
      editor
        .chain()
        .focus()
        .insertContentAt(target.start + 1, '/')
        .run();
      return;
    }
    editor
      .chain()
      .insertContentAt(target.end, { type: 'paragraph', content: [{ type: 'text', text: '/' }] })
      .setTextSelection(target.end + 2)
      .focus()
      .run();
  };

  const onDragStart = (event: DragEvent) => {
    const block = index === null ? null : getBlockByIndex(editor.state.doc, index);
    if (!block || !event.dataTransfer || !editor.isEditable) return;
    const { view } = editor;
    const selection = NodeSelection.create(view.state.doc, block.start);
    view.dispatch(view.state.tr.setSelection(selection));
    const slice = selection.content();
    const { dom, text } = view.serializeForClipboard(slice);
    event.dataTransfer.clearData();
    event.dataTransfer.setData('text/html', dom.innerHTML);
    event.dataTransfer.setData('text/plain', text);
    event.dataTransfer.effectAllowed = 'copyMove';
    const blockDom = view.nodeDOM(block.start);
    if (blockDom instanceof HTMLElement) event.dataTransfer.setDragImage(blockDom, 0, 0);
    setViewDragging(view, { slice, move: true, node: selection });
  };

  if (!editor.isEditable) return null;
  const count = blockCount;
  const target = menuIndex ?? index;

  return (
    <div
      ref={handleRef}
      className={cx(styles.handle, menuIndex !== null && styles.handleActive)}
      style={{ top: top ?? 0 }}
      data-hidden={top === null || undefined}
      onDragStart={onDragStart}
      onDragEnd={() => setViewDragging(editor.view, null)}
    >
      <Tooltip content={messages.editorInsertBlock}>
        <IconButton
          size="sm"
          variant="ghost"
          label={messages.editorInsertBlock}
          icon={<Plus />}
          onPress={insertBelow}
          excludeFromTabOrder
        />
      </Tooltip>
      <DropdownMenu
        isOpen={menuIndex !== null}
        onOpenChange={(open) => {
          if (open) setMenuIndex(index);
          else closeMenu();
        }}
      >
        <Tooltip content={`${messages.editorBlockActions} (${formatShortcut('Alt-F10', isMac)})`}>
          <IconButton
            ref={gripRef}
            size="sm"
            variant="ghost"
            label={`${messages.editorBlockActions} – ${messages.editorDragBlock}`}
            icon={<GripVertical />}
            className={styles.grip}
          />
        </Tooltip>
        <Menu aria-label={messages.editorBlockActions} onAction={onAction} placement="bottom start">
          <MenuItem id="moveUp" icon={<ArrowUp />} shortcut={formatShortcut('Mod-Alt-ArrowUp', isMac)} isDisabled={target === 0}>
            {messages.editorMoveUp}
          </MenuItem>
          <MenuItem
            id="moveDown"
            icon={<ArrowDown />}
            shortcut={formatShortcut('Mod-Alt-ArrowDown', isMac)}
            isDisabled={target === null || target >= count - 1}
          >
            {messages.editorMoveDown}
          </MenuItem>
          <MenuItem id="duplicate" icon={<Copy />}>
            {messages.editorDuplicate}
          </MenuItem>
          <MenuItem id="delete" icon={<Trash />} tone="danger">
            {messages.editorDelete}
          </MenuItem>
          {isTable ? [<MenuSeparator key="table-sep" />, ...tableItems(messages)] : null}
        </Menu>
      </DropdownMenu>
    </div>
  );
}

/* ----------------------------------------------------------------------------------------------
 * Imperative helpers (kept outside components: they mutate refs and the ProseMirror view)
 * -------------------------------------------------------------------------------------------- */

function resolveContainer(ref: RefObject<HTMLElement | null>, editor: Editor): HTMLElement {
  return ref.current ?? editor.view.dom.parentElement ?? document.body;
}

function registerSlash(handlers: RefObject<EditorHandlers>, slash: NonNullable<EditorHandlers['slash']>): () => void {
  const target = handlers.current;
  target.slash = slash;
  return () => {
    if (target.slash === slash) target.slash = undefined;
  };
}

/** Mirrors ProseMirror's own drag start so its drop handler moves (instead of copies) the block. */
function setViewDragging(view: EditorView, dragging: { slice: Slice; move: boolean; node: NodeSelection } | null): void {
  (view as unknown as { dragging: typeof dragging }).dragging = dragging;
}
