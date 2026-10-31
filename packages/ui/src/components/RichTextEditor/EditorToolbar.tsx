import type { Editor } from '@tiptap/core';
import {
  BetweenHorizontalEnd,
  BetweenVerticalEnd,
  ChevronDown,
  Columns3,
  Image as ImageIcon,
  Link as LinkIcon,
  List,
  ListOrdered,
  ListTodo,
  Minus,
  Plus,
  Quote,
  Redo2,
  RemoveFormatting,
  Rows3,
  SquareCode,
  Table,
  TextAlignCenter,
  TextAlignEnd,
  TextAlignJustify,
  TextAlignStart,
  Trash,
  Undo2,
} from 'lucide-react';
import { Fragment, type ReactElement, type ReactNode, type RefObject } from 'react';
import { useMessages } from '../../i18n/LocaleProvider';
import { Button } from '../Button/Button';
import { DropdownMenu, Menu, MenuItem, MenuSeparator } from '../DropdownMenu/DropdownMenu';
import { IconButton } from '../IconButton/IconButton';
import { Toggle } from '../Toggle/Toggle';
import { Toolbar, ToolbarGroup, ToolbarSeparator } from '../Toolbar/Toolbar';
import { Tooltip } from '../Tooltip/Tooltip';
import { formatShortcut, markCommands, setTextStyle, toggleMark, useEditorSnapshot, useEscapeToEditor, useIsMac } from './commands';
import type { HeadingLevel, ResolvedFeatures } from './extensions';
import styles from './RichTextEditor.module.css';

export interface EditorToolbarProps {
  editor: Editor;
  features: ResolvedFeatures;
  headingLevels: readonly HeadingLevel[];
  isDisabled?: boolean;
  toolbarRef: RefObject<HTMLDivElement | null>;
  onOpenLink: () => void;
  onOpenImage: () => void;
}

function Hint({ label, shortcut, isMac, children }: { label: string; shortcut?: string; isMac: boolean; children: ReactElement }) {
  return (
    <Tooltip
      content={
        <span className={styles.hint}>
          {label}
          {shortcut ? <kbd className={styles.kbd}>{formatShortcut(shortcut, isMac)}</kbd> : null}
        </span>
      }
    >
      {children}
    </Tooltip>
  );
}

const ALIGN_ICONS: Record<string, ReactNode> = {
  start: <TextAlignStart />,
  center: <TextAlignCenter />,
  end: <TextAlignEnd />,
  justify: <TextAlignJustify />,
};

/** Fixed formatting toolbar of the `toolbar` variant (roving focus, `Escape` returns to the text). */
export function EditorToolbar({ editor, features, headingLevels, isDisabled, toolbarRef, onOpenLink, onOpenImage }: EditorToolbarProps) {
  const messages = useMessages();
  const isMac = useIsMac();
  const state = useEditorSnapshot(editor);
  useEscapeToEditor(toolbarRef, editor);
  const run = (fn: (chain: ReturnType<Editor['chain']>) => ReturnType<Editor['chain']>) => fn(editor.chain().focus()).run();

  const textStyles = [
    { id: 'paragraph', label: messages.editorParagraph, shortcut: 'Mod-Alt-0' },
    ...(features.headings
      ? headingLevels.map((level) => ({ id: `h${level}`, label: messages.editorHeading(level), shortcut: `Mod-Alt-${level}` }))
      : []),
  ];
  const currentStyle = textStyles.find((style) => style.id === state.textStyle);
  const alignments = [
    { id: 'start', label: messages.editorAlignStart, shortcut: 'Mod-Shift-l' },
    { id: 'center', label: messages.editorAlignCenter, shortcut: 'Mod-Shift-e' },
    { id: 'end', label: messages.editorAlignEnd, shortcut: 'Mod-Shift-r' },
    { id: 'justify', label: messages.editorAlignJustify, shortcut: 'Mod-Shift-j' },
  ];
  const hasInsert = features.horizontalRule || features.image || features.table;
  const toggle = (label: string, shortcut: string | undefined, icon: ReactNode, isSelected: boolean, onChange: () => void) => (
    <Hint label={label} shortcut={shortcut} isMac={isMac}>
      <Toggle
        size="sm"
        variant="ghost"
        icon={icon}
        aria-label={label}
        isSelected={isSelected}
        onChange={onChange}
        isDisabled={isDisabled}
      />
    </Hint>
  );

  return (
    <Toolbar ref={toolbarRef} aria-label={messages.editorToolbar} className={styles.toolbar}>
      {textStyles.length > 1 ? (
        <ToolbarGroup>
          <DropdownMenu>
            <Hint label={messages.editorTextStyle} isMac={isMac}>
              <Button
                size="sm"
                variant="ghost"
                endIcon={<ChevronDown />}
                isDisabled={isDisabled}
                aria-label={`${messages.editorTextStyle}: ${currentStyle?.label ?? '—'}`}
                className={styles.styleButton}
              >
                {currentStyle?.label ?? '—'}
              </Button>
            </Hint>
            <Menu
              aria-label={messages.editorTextStyle}
              selectionMode="single"
              selectedKeys={currentStyle ? [currentStyle.id] : []}
              onAction={(key) => setTextStyle(editor, String(key))}
            >
              {textStyles.map((style) => (
                <MenuItem key={style.id} id={style.id} shortcut={formatShortcut(style.shortcut, isMac)}>
                  {style.label}
                </MenuItem>
              ))}
            </Menu>
          </DropdownMenu>
        </ToolbarGroup>
      ) : null}
      <ToolbarGroup>
        {markCommands(messages, features).map((mark) => (
          <Fragment key={mark.name}>
            {toggle(mark.label, mark.shortcut, mark.icon, state.marks[mark.name], () => toggleMark(editor, mark.name))}
          </Fragment>
        ))}
        {features.link ? toggle(messages.editorLink, 'Mod-k', <LinkIcon />, state.link, onOpenLink) : null}
      </ToolbarGroup>
      {features.lists || features.taskList || features.blockquote || features.codeBlock ? (
        <>
          <ToolbarSeparator />
          <ToolbarGroup>
            {features.lists ? (
              <>
                {toggle(messages.editorBulletList, 'Mod-Shift-8', <List />, state.bulletList, () => run((c) => c.toggleBulletList()))}
                {toggle(messages.editorOrderedList, 'Mod-Shift-7', <ListOrdered />, state.orderedList, () =>
                  run((c) => c.toggleOrderedList()),
                )}
              </>
            ) : null}
            {features.taskList
              ? toggle(messages.editorTaskList, 'Mod-Shift-9', <ListTodo />, state.taskList, () => run((c) => c.toggleTaskList()))
              : null}
            {features.blockquote
              ? toggle(messages.editorBlockquote, 'Mod-Shift-b', <Quote />, state.blockquote, () => run((c) => c.toggleBlockquote()))
              : null}
            {features.codeBlock
              ? toggle(messages.editorCodeBlock, 'Mod-Alt-c', <SquareCode />, state.codeBlock, () => run((c) => c.toggleCodeBlock()))
              : null}
          </ToolbarGroup>
        </>
      ) : null}
      {features.align || hasInsert || state.table ? <ToolbarSeparator /> : null}
      {features.align || hasInsert || state.table ? (
        <ToolbarGroup>
          {features.align ? (
            <DropdownMenu>
              <Hint label={messages.editorAlign} isMac={isMac}>
                <IconButton
                  size="sm"
                  variant="ghost"
                  label={messages.editorAlign}
                  icon={ALIGN_ICONS[state.align]}
                  isDisabled={isDisabled}
                />
              </Hint>
              <Menu
                aria-label={messages.editorAlign}
                selectionMode="single"
                selectedKeys={[state.align]}
                onAction={(key) => run((c) => c.setTextAlign(String(key)))}
              >
                {alignments.map((item) => (
                  <MenuItem key={item.id} id={item.id} icon={ALIGN_ICONS[item.id]} shortcut={formatShortcut(item.shortcut, isMac)}>
                    {item.label}
                  </MenuItem>
                ))}
              </Menu>
            </DropdownMenu>
          ) : null}
          {hasInsert ? (
            <DropdownMenu>
              <Hint label={messages.editorInsert} isMac={isMac}>
                <IconButton size="sm" variant="ghost" label={messages.editorInsert} icon={<Plus />} isDisabled={isDisabled} />
              </Hint>
              <Menu
                aria-label={messages.editorInsert}
                onAction={(key) => {
                  if (key === 'divider') run((c) => c.setHorizontalRule());
                  else if (key === 'image') onOpenImage();
                  else if (key === 'table') run((c) => c.insertTable({ rows: 3, cols: 3, withHeaderRow: true }));
                }}
              >
                {features.horizontalRule ? (
                  <MenuItem id="divider" icon={<Minus />}>
                    {messages.editorDivider}
                  </MenuItem>
                ) : null}
                {features.image ? (
                  <MenuItem id="image" icon={<ImageIcon />}>
                    {messages.editorImage}
                  </MenuItem>
                ) : null}
                {features.table ? (
                  <MenuItem id="table" icon={<Table />} isDisabled={state.table}>
                    {messages.editorTable}
                  </MenuItem>
                ) : null}
              </Menu>
            </DropdownMenu>
          ) : null}
          {state.table ? (
            <DropdownMenu>
              <Hint label={messages.editorTable} isMac={isMac}>
                <IconButton size="sm" variant="ghost" label={messages.editorTable} icon={<Table />} isDisabled={isDisabled} />
              </Hint>
              <TableMenu editor={editor} />
            </DropdownMenu>
          ) : null}
        </ToolbarGroup>
      ) : null}
      <ToolbarSeparator />
      <ToolbarGroup>
        <Hint label={messages.editorClearFormatting} isMac={isMac}>
          <IconButton
            size="sm"
            variant="ghost"
            label={messages.editorClearFormatting}
            icon={<RemoveFormatting />}
            isDisabled={isDisabled}
            onPress={() => run((c) => c.unsetAllMarks().clearNodes())}
          />
        </Hint>
        <Hint label={messages.editorUndo} shortcut="Mod-z" isMac={isMac}>
          <IconButton
            size="sm"
            variant="ghost"
            label={messages.editorUndo}
            icon={<Undo2 />}
            isDisabled={isDisabled || !state.canUndo}
            onPress={() => run((c) => c.undo())}
          />
        </Hint>
        <Hint label={messages.editorRedo} shortcut="Mod-Shift-z" isMac={isMac}>
          <IconButton
            size="sm"
            variant="ghost"
            label={messages.editorRedo}
            icon={<Redo2 />}
            isDisabled={isDisabled || !state.canRedo}
            onPress={() => run((c) => c.redo())}
          />
        </Hint>
      </ToolbarGroup>
    </Toolbar>
  );
}

/** Row/column/table actions; shared by the toolbar and the block actions menu. */
export function TableMenu({ editor, onDone }: { editor: Editor; onDone?: () => void }) {
  const messages = useMessages();
  return (
    <Menu
      aria-label={messages.editorTable}
      onAction={(key) => {
        const chain = editor.chain().focus();
        if (key === 'addRow') chain.addRowAfter().run();
        else if (key === 'addColumn') chain.addColumnAfter().run();
        else if (key === 'deleteRow') chain.deleteRow().run();
        else if (key === 'deleteColumn') chain.deleteColumn().run();
        else if (key === 'deleteTable') chain.deleteTable().run();
        onDone?.();
      }}
    >
      {tableItems(messages)}
    </Menu>
  );
}

export function tableItems(messages: ReturnType<typeof useMessages>) {
  return [
    <MenuItem key="addRow" id="addRow" icon={<BetweenHorizontalEnd />}>
      {messages.editorAddRow}
    </MenuItem>,
    <MenuItem key="addColumn" id="addColumn" icon={<BetweenVerticalEnd />}>
      {messages.editorAddColumn}
    </MenuItem>,
    <MenuSeparator key="sep" />,
    <MenuItem key="deleteRow" id="deleteRow" icon={<Rows3 />} tone="danger">
      {messages.editorDeleteRow}
    </MenuItem>,
    <MenuItem key="deleteColumn" id="deleteColumn" icon={<Columns3 />} tone="danger">
      {messages.editorDeleteColumn}
    </MenuItem>,
    <MenuItem key="deleteTable" id="deleteTable" icon={<Trash />} tone="danger">
      {messages.editorDeleteTable}
    </MenuItem>,
  ];
}
