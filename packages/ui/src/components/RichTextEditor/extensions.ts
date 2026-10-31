import { Extension, type AnyExtension, type Editor, type Range } from '@tiptap/core';
import { Highlight } from '@tiptap/extension-highlight';
import { Image } from '@tiptap/extension-image';
import { TaskItem, TaskList } from '@tiptap/extension-list';
import { TableKit } from '@tiptap/extension-table';
import { TextAlign } from '@tiptap/extension-text-align';
import { CharacterCount, Placeholder } from '@tiptap/extensions';
import type { Node as PMNode } from '@tiptap/pm/model';
import { NodeSelection, PluginKey, Selection, TextSelection, type EditorState, type Transaction } from '@tiptap/pm/state';
import type { EditorView } from '@tiptap/pm/view';
import { StarterKit } from '@tiptap/starter-kit';
import { Suggestion, type SuggestionKeyDownProps, type SuggestionProps } from '@tiptap/suggestion';
import type { RefObject } from 'react';

/** Groups of content that can be switched off. Marks (bold, italic, underline, strike, inline code) are always available. */
export type RichTextFeature =
  'headings' | 'lists' | 'taskList' | 'blockquote' | 'codeBlock' | 'link' | 'image' | 'table' | 'align' | 'highlight' | 'horizontalRule';

/** `{ table: false, image: false }`: every feature not listed is enabled. */
export type RichTextEditorFeatures = Partial<Record<RichTextFeature, boolean>>;

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export const ALL_FEATURES: readonly RichTextFeature[] = [
  'headings',
  'lists',
  'taskList',
  'blockquote',
  'codeBlock',
  'link',
  'image',
  'table',
  'align',
  'highlight',
  'horizontalRule',
];

export type ResolvedFeatures = Record<RichTextFeature, boolean>;

export function resolveFeatures(features?: RichTextEditorFeatures): ResolvedFeatures {
  return Object.fromEntries(ALL_FEATURES.map((key) => [key, features?.[key] ?? true])) as ResolvedFeatures;
}

/* ----------------------------------------------------------------------------------------------
 * URL safety
 * -------------------------------------------------------------------------------------------- */

const LINK_SCHEMES = new Set(['http', 'https', 'mailto', 'tel']);
const IMAGE_SCHEMES = new Set(['http', 'https', 'blob']);
const DATA_IMAGE = /^data:image\/(png|jpe?g|gif|webp|avif|svg\+xml);/i;

/** Browsers ignore ASCII control characters and whitespace inside a scheme (`java\tscript:`): strip them before checking. */
function stripIgnored(value: string): string {
  let out = '';
  for (const ch of value) {
    const code = ch.charCodeAt(0);
    if (code > 0x20 && (code < 0x7f || code > 0x9f)) out += ch;
  }
  return out;
}

/**
 * Allows relative URLs and the `http(s)`, `mailto` and `tel` schemes for links; `http(s)`, `blob`
 * and `data:image/*` for images. Everything else (`javascript:`, `vbscript:`, `data:text/html`…) is rejected.
 */
export function isSafeUrl(value: string | null | undefined, kind: 'link' | 'image' = 'link'): boolean {
  if (!value) return false;
  const url = stripIgnored(value);
  if (!url) return false;
  const match = /^([a-z][a-z\d+.-]*):/i.exec(url);
  if (!match) return true;
  const scheme = (match[1] ?? '').toLowerCase();
  if (kind === 'image') return IMAGE_SCHEMES.has(scheme) || DATA_IMAGE.test(url);
  return LINK_SCHEMES.has(scheme);
}

const EMAIL = /^[^\s@/:]+@[^\s@/:]+\.[^\s@/:]+$/;
const BARE_DOMAIN = /^[\w-]+(\.[\w-]+)+(:\d+)?([/?#]|$)/;

/** `example.com` → `https://example.com`, `me@example.com` → `mailto:me@example.com`. */
export function normalizeLinkInput(raw: string): string {
  const value = raw.trim();
  if (!value || /^(https?|mailto|tel):/i.test(value) || /^[/.#?]/.test(value)) return value;
  if (EMAIL.test(value)) return `mailto:${value}`;
  if (BARE_DOMAIN.test(value)) return `https://${value}`;
  return value;
}

/* ----------------------------------------------------------------------------------------------
 * Top-level block helpers (block handle, block actions menu, keyboard moves)
 * -------------------------------------------------------------------------------------------- */

export interface BlockInfo {
  index: number;
  start: number;
  end: number;
  node: PMNode;
}

export function getBlockByIndex(doc: PMNode, index: number): BlockInfo | null {
  if (index < 0 || index >= doc.childCount) return null;
  let start = 0;
  for (let i = 0; i < index; i += 1) start += doc.child(i).nodeSize;
  const node = doc.child(index);
  return { index, start, end: start + node.nodeSize, node };
}

export function getBlockAt(doc: PMNode, pos: number): BlockInfo | null {
  if (doc.childCount === 0) return null;
  const $pos = doc.resolve(Math.max(0, Math.min(pos, doc.content.size)));
  return getBlockByIndex(doc, Math.min($pos.index(0), doc.childCount - 1));
}

export function getCurrentBlock(state: EditorState): BlockInfo | null {
  return getBlockAt(state.doc, state.selection.from);
}

function selectInside(tr: Transaction, pos: number, node: PMNode): void {
  if (!node.isTextblock && NodeSelection.isSelectable(node) && (node.isAtom || node.isLeaf)) {
    tr.setSelection(NodeSelection.create(tr.doc, pos));
    return;
  }
  const found = Selection.findFrom(tr.doc.resolve(pos), 1, true);
  tr.setSelection(found && found.from <= pos + node.nodeSize ? found : Selection.near(tr.doc.resolve(pos)));
}

function resolveBlock(editor: Editor, index?: number): BlockInfo | null {
  const { state } = editor;
  return index === undefined ? getCurrentBlock(state) : getBlockByIndex(state.doc, index);
}

/** Moves the top-level block (current one by default) up (-1) or down (1). */
export function moveBlock(editor: Editor, direction: -1 | 1, index?: number): boolean {
  if (!editor.isEditable) return false;
  const block = resolveBlock(editor, index);
  if (!block) return false;
  const { state } = editor;
  const sibling = getBlockByIndex(state.doc, block.index + direction);
  if (!sibling) return false;
  const { selection } = state;
  const selectionInside = selection.from >= block.start && selection.to <= block.end;
  const tr = state.tr.delete(block.start, block.end);
  const insertAt = direction < 0 ? sibling.start : block.start + sibling.node.nodeSize;
  tr.insert(insertAt, block.node);
  const offset = insertAt - block.start;
  if (selectionInside && selection instanceof NodeSelection) tr.setSelection(NodeSelection.create(tr.doc, selection.from + offset));
  else if (selectionInside && selection instanceof TextSelection)
    tr.setSelection(TextSelection.create(tr.doc, selection.anchor + offset, selection.head + offset));
  else selectInside(tr, insertAt, block.node);
  editor.view.dispatch(tr.scrollIntoView());
  return true;
}

export function duplicateBlock(editor: Editor, index?: number): boolean {
  if (!editor.isEditable) return false;
  const block = resolveBlock(editor, index);
  if (!block) return false;
  const tr = editor.state.tr.insert(block.end, block.node.copy(block.node.content));
  selectInside(tr, block.end, block.node);
  editor.view.dispatch(tr.scrollIntoView());
  return true;
}

export function deleteBlock(editor: Editor, index?: number): boolean {
  if (!editor.isEditable) return false;
  const block = resolveBlock(editor, index);
  if (!block) return false;
  const tr = editor.state.tr.delete(block.start, block.end);
  tr.setSelection(Selection.near(tr.doc.resolve(Math.min(block.start, tr.doc.content.size))));
  editor.view.dispatch(tr.scrollIntoView());
  return true;
}

/* ----------------------------------------------------------------------------------------------
 * Extensions
 * -------------------------------------------------------------------------------------------- */

export interface SlashHandlers {
  onStart: (props: SuggestionProps<SlashCommandItem, SlashCommandItem>) => void;
  onUpdate: (props: SuggestionProps<SlashCommandItem, SlashCommandItem>) => void;
  onExit: () => void;
  onKeyDown: (props: SuggestionKeyDownProps) => boolean;
}

/** Callbacks owned by the React component; read lazily so the extensions never need to be recreated. */
export interface EditorHandlers {
  openLink?: () => boolean;
  focusControls?: () => boolean;
  slash?: SlashHandlers;
  placeholder?: (editor: Editor, node: PMNode) => string;
  taskLabel?: (node: PMNode, checked: boolean) => string;
}

export interface SlashCommandItem {
  id: string;
  label: string;
  keywords: string[];
  run: (editor: Editor, range: Range) => void;
}

export const slashPluginKey = new PluginKey('dcSlashCommand');

export const LINK_REL = 'noopener noreferrer';

/** Logical alignments (`start`/`end`) so content follows the writing direction; shortcuts remapped accordingly. */
const LogicalTextAlign = TextAlign.extend({
  addKeyboardShortcuts() {
    return {
      'Mod-Shift-l': () => this.editor.commands.setTextAlign('start'),
      'Mod-Shift-e': () => this.editor.commands.setTextAlign('center'),
      'Mod-Shift-r': () => this.editor.commands.setTextAlign('end'),
      'Mod-Shift-j': () => this.editor.commands.setTextAlign('justify'),
    };
  },
});

/** Schema-defining extensions, shared by the editor and `RichTextContent` (JSON rendering). */
export function contentExtensions(
  features: ResolvedFeatures,
  headingLevels: readonly HeadingLevel[],
  handlers?: RefObject<EditorHandlers>,
): AnyExtension[] {
  const list: AnyExtension[] = [
    StarterKit.configure({
      heading: features.headings && headingLevels.length > 0 ? { levels: [...headingLevels] } : false,
      bulletList: features.lists ? {} : false,
      orderedList: features.lists ? {} : false,
      listItem: features.lists ? {} : false,
      listKeymap: features.lists || features.taskList ? {} : false,
      blockquote: features.blockquote ? {} : false,
      codeBlock: features.codeBlock ? {} : false,
      horizontalRule: features.horizontalRule ? {} : false,
      dropcursor: { color: false, width: 2, class: 'dc-rte-dropcursor' },
      link: features.link
        ? {
            openOnClick: false,
            autolink: true,
            linkOnPaste: true,
            defaultProtocol: 'https',
            // `rel` defaults to noopener/noreferrer so links opened in a new tab cannot reach `window.opener`.
            HTMLAttributes: { target: null, rel: LINK_REL, class: null },
            isAllowedUri: (url) => isSafeUrl(url, 'link'),
            shouldAutoLink: (url) => isSafeUrl(url, 'link'),
          }
        : false,
    }),
  ];
  if (features.taskList) {
    list.push(
      TaskList,
      TaskItem.configure({
        nested: true,
        a11y: { checkboxLabel: (node, checked) => handlers?.current?.taskLabel?.(node, checked) ?? node.textContent },
      }),
    );
  }
  if (features.highlight) list.push(Highlight.configure({ multicolor: false }));
  if (features.align)
    list.push(LogicalTextAlign.configure({ types: ['heading', 'paragraph'], alignments: ['start', 'center', 'end', 'justify'] }));
  if (features.image) list.push(Image.configure({ inline: false, allowBase64: true }));
  if (features.table) list.push(TableKit.configure({ table: { resizable: false } }));
  return list;
}

function behaviorExtension(handlers: RefObject<EditorHandlers>) {
  return Extension.create({
    name: 'dcEditorBehavior',
    addKeyboardShortcuts() {
      return {
        'Mod-k': () => handlers.current?.openLink?.() ?? false,
        'Alt-F10': () => handlers.current?.focusControls?.() ?? false,
        'Mod-Alt-ArrowUp': ({ editor }) => moveBlock(editor, -1),
        'Mod-Alt-ArrowDown': ({ editor }) => moveBlock(editor, 1),
      };
    },
  });
}

function slashExtension(handlers: RefObject<EditorHandlers>) {
  return Extension.create({
    name: 'dcSlashCommand',
    addProseMirrorPlugins() {
      return [
        Suggestion<SlashCommandItem, SlashCommandItem>({
          editor: this.editor,
          pluginKey: slashPluginKey,
          char: '/',
          allowSpaces: false,
          items: () => [],
          allow: ({ state, range }) => {
            const $from = state.doc.resolve(range.from);
            return !$from.parent.type.spec.code;
          },
          command: ({ editor, range, props }) => props.run(editor, range),
          render: () => ({
            onStart: (props) => handlers.current?.slash?.onStart(props),
            onUpdate: (props) => handlers.current?.slash?.onUpdate(props),
            onExit: () => handlers.current?.slash?.onExit(),
            onKeyDown: (props) => handlers.current?.slash?.onKeyDown(props) ?? false,
          }),
        }),
      ];
    },
  });
}

export interface EditorExtensionOptions {
  features: ResolvedFeatures;
  headingLevels: readonly HeadingLevel[];
  variant: 'toolbar' | 'blocks';
  characterLimit?: number;
  handlers: RefObject<EditorHandlers>;
}

export function editorExtensions({ features, headingLevels, variant, characterLimit, handlers }: EditorExtensionOptions): AnyExtension[] {
  return [
    ...contentExtensions(features, headingLevels, handlers),
    Placeholder.configure({
      showOnlyCurrent: true,
      includeChildren: false,
      placeholder: ({ editor, node }) => handlers.current?.placeholder?.(editor, node) ?? '',
    }),
    CharacterCount.configure({ limit: characterLimit ?? null }),
    behaviorExtension(handlers),
    ...(variant === 'blocks' ? [slashExtension(handlers)] : []),
  ];
}

/* ----------------------------------------------------------------------------------------------
 * Images from paste / drop
 * -------------------------------------------------------------------------------------------- */

export function imageFiles(list: FileList | null | undefined): File[] {
  return list ? Array.from(list).filter((file) => file.type.startsWith('image/')) : [];
}

export type ImageUploadResult = string | { src: string; alt?: string };

export async function uploadAndInsert(
  view: EditorView,
  files: File[],
  upload: (file: File) => Promise<ImageUploadResult>,
  pos: number | null,
  onError?: (error: unknown, file: File) => void,
): Promise<void> {
  let insertAt = pos;
  for (const file of files) {
    try {
      const result = await upload(file);
      const { src, alt = '' } = typeof result === 'string' ? { src: result } : result;
      const imageType = view.state.schema.nodes.image;
      if (!imageType || !isSafeUrl(src, 'image') || view.isDestroyed) continue;
      const node = imageType.create({ src, alt });
      const at = insertAt === null ? view.state.selection.to : Math.min(insertAt, view.state.doc.content.size);
      const tr = view.state.tr.replaceRangeWith(at, at, node);
      insertAt = tr.mapping.map(at);
      view.dispatch(tr.scrollIntoView());
    } catch (error) {
      onError?.(error, file);
    }
  }
}
