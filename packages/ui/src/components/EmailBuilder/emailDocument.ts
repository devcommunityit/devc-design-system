/*
 * Email document model: plain serialisable data, no React. Colors are literal hex strings because
 * email clients cannot resolve CSS custom properties.
 */

/** Logical alignment: `start`/`end` follow the email `dir` when rendered. */
export type EmailAlign = 'start' | 'center' | 'end';

/** Tiptap/ProseMirror JSON node (subset). Rendered through a whitelist, never as raw HTML. */
export interface EmailRichText {
  type: string;
  attrs?: Record<string, unknown>;
  content?: EmailRichText[];
  text?: string;
  marks?: Array<{ type: string; attrs?: Record<string, unknown> }>;
}

/** Symmetric inner spacing in pixels: `block` = top/bottom, `inline` = left/right. */
export interface EmailPadding {
  block: number;
  inline: number;
}

export interface EmailSettings {
  /** Content width in pixels. @default 600 */
  width: number;
  /** Page background around the content. */
  backgroundColor: string;
  /** Background of the content column. */
  contentBackgroundColor: string;
  textColor: string;
  /** Buttons and links. */
  accentColor: string;
  /** CSS font stack; use one of `emailFontStacks`. */
  fontFamily: string;
}

interface EmailBlockBase {
  id: string;
  padding?: EmailPadding;
  /** Background of the block row (hex). Transparent when omitted. */
  backgroundColor?: string;
}

export interface EmailHeadingBlock extends EmailBlockBase {
  type: 'heading';
  level: 1 | 2 | 3;
  /** Tiptap JSON document with a single paragraph. */
  content: EmailRichText;
  align: EmailAlign;
  color?: string;
}

export interface EmailTextBlock extends EmailBlockBase {
  type: 'text';
  /** Tiptap JSON document: paragraphs and lists. */
  content: EmailRichText;
  align: EmailAlign;
  color?: string;
}

export interface EmailButtonBlock extends EmailBlockBase {
  type: 'button';
  label: string;
  href: string;
  align: EmailAlign;
  /** Button fill. Defaults to the accent color. */
  buttonColor?: string;
  /** Label color. @default '#ffffff' */
  textColor?: string;
  /** Corner radius in pixels. @default 6 */
  radius?: number;
  fullWidth?: boolean;
}

export interface EmailImageBlock extends EmailBlockBase {
  type: 'image';
  src: string;
  /** Required alternative text. Use an empty string only for purely decorative images. */
  alt: string;
  href?: string;
  /** Maximum width in pixels. */
  width: number;
  align: EmailAlign;
}

export interface EmailDividerBlock extends EmailBlockBase {
  type: 'divider';
  color: string;
  thickness: number;
}

export interface EmailSpacerBlock extends EmailBlockBase {
  type: 'spacer';
  height: number;
}

/** Blocks allowed inside a column. */
export type EmailColumnChild = EmailHeadingBlock | EmailTextBlock | EmailImageBlock | EmailButtonBlock;
export type EmailColumnChildType = EmailColumnChild['type'];

export interface EmailColumnsBlock extends EmailBlockBase {
  type: 'columns';
  /** Two or three columns; they stack on small screens. */
  columns: EmailColumnChild[][];
  /** Space between columns in pixels. @default 16 */
  gap?: number;
}

export interface EmailSocialLink {
  /** Network id (e.g. `github`, `linkedin`, `website`) or any custom name. */
  network: string;
  href: string;
}

export interface EmailSocialBlock extends EmailBlockBase {
  type: 'social';
  links: EmailSocialLink[];
  align: EmailAlign;
}

export interface EmailFooterBlock extends EmailBlockBase {
  type: 'footer';
  content: EmailRichText;
  align: EmailAlign;
  color?: string;
}

export type EmailBlock =
  | EmailHeadingBlock
  | EmailTextBlock
  | EmailButtonBlock
  | EmailImageBlock
  | EmailDividerBlock
  | EmailSpacerBlock
  | EmailColumnsBlock
  | EmailSocialBlock
  | EmailFooterBlock;

export type EmailBlockType = EmailBlock['type'];
export type EmailBlockOfType<T extends EmailBlockType> = Extract<EmailBlock, { type: T }>;

export interface EmailDocument {
  version: 1;
  subject?: string;
  /** Hidden preview text shown by inbox lists after the subject. */
  preheader?: string;
  settings: EmailSettings;
  blocks: EmailBlock[];
}

export const emailBlockTypes: readonly EmailBlockType[] = ['heading', 'text', 'button', 'image', 'divider', 'spacer', 'columns', 'social', 'footer'];
export const emailColumnChildTypes: readonly EmailColumnChildType[] = ['heading', 'text', 'image', 'button'];

/** Email-safe font stacks (system fonts only: web fonts are unreliable in email clients). */
export const emailFontStacks: ReadonlyArray<{ id: string; label: string; stack: string }> = [
  { id: 'system', label: 'System sans-serif', stack: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" },
  { id: 'arial', label: 'Arial / Helvetica', stack: 'Arial, Helvetica, sans-serif' },
  { id: 'verdana', label: 'Verdana', stack: 'Verdana, Geneva, sans-serif' },
  { id: 'trebuchet', label: 'Trebuchet MS', stack: "'Trebuchet MS', Tahoma, sans-serif" },
  { id: 'georgia', label: 'Georgia', stack: "Georgia, 'Times New Roman', serif" },
  { id: 'times', label: 'Times New Roman', stack: "'Times New Roman', Times, serif" },
  { id: 'courier', label: 'Courier New', stack: "'Courier New', Courier, monospace" },
];

export const defaultEmailSettings: EmailSettings = {
  width: 600,
  backgroundColor: '#f4f5f7',
  contentBackgroundColor: '#ffffff',
  textColor: '#1f2328',
  accentColor: '#0b5cad',
  fontFamily: emailFontStacks[0]!.stack,
};

const defaultPadding: Record<EmailBlockType, EmailPadding> = {
  heading: { block: 12, inline: 24 },
  text: { block: 8, inline: 24 },
  button: { block: 16, inline: 24 },
  image: { block: 8, inline: 24 },
  divider: { block: 16, inline: 24 },
  spacer: { block: 0, inline: 0 },
  columns: { block: 12, inline: 16 },
  social: { block: 12, inline: 24 },
  footer: { block: 24, inline: 24 },
};

/** Default padding used when a block has none. */
export function getEmailBlockPadding(block: EmailBlock): EmailPadding {
  return block.padding ?? defaultPadding[block.type] ?? { block: 0, inline: 0 };
}

/** Random id: `crypto.randomUUID` when available, otherwise a time + random fallback. */
export function createEmailId(): string {
  const c = (globalThis as { crypto?: { randomUUID?: () => string } }).crypto;
  if (c?.randomUUID) return c.randomUUID();
  return `b-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/** Builds a rich-text document from plain paragraphs (one per array item). */
export function emailRichText(...paragraphs: string[]): EmailRichText {
  return {
    type: 'doc',
    content: (paragraphs.length ? paragraphs : ['']).map((text) => (text ? { type: 'paragraph', content: [{ type: 'text', text }] } : { type: 'paragraph' })),
  };
}

/** Plain text of a rich-text node (used for labels and announcements). */
export function emailRichTextToPlain(node: EmailRichText | undefined): string {
  if (!node) return '';
  if (node.type === 'text') return node.text ?? '';
  if (node.type === 'hardBreak') return ' ';
  const inner = (node.content ?? []).map(emailRichTextToPlain);
  return node.type === 'doc' || node.type === 'bulletList' || node.type === 'orderedList' ? inner.join(' ') : inner.join('');
}

type BlockOverrides<T extends EmailBlockType> = Partial<Omit<EmailBlockOfType<T>, 'type'>>;

/** New block of `type` with sensible defaults; `overrides` replace any field (including `id`). */
export function createEmailBlock<T extends EmailBlockType>(type: T, overrides: BlockOverrides<T> = {}): EmailBlockOfType<T> {
  const id = createEmailId();
  let base: EmailBlock;
  switch (type) {
    case 'heading':
      base = { id, type, level: 2, content: emailRichText(''), align: 'start' };
      break;
    case 'text':
      base = { id, type, content: emailRichText(''), align: 'start' };
      break;
    case 'button':
      base = { id, type, label: 'Button', href: '', align: 'center', radius: 6 };
      break;
    case 'image':
      base = { id, type, src: '', alt: '', width: 552, align: 'center' };
      break;
    case 'divider':
      base = { id, type, color: '#d0d7de', thickness: 1 };
      break;
    case 'spacer':
      base = { id, type, height: 24 };
      break;
    case 'columns':
      base = {
        id,
        type,
        gap: 16,
        columns: [[createEmailBlock('text', { padding: { block: 0, inline: 0 } })], [createEmailBlock('text', { padding: { block: 0, inline: 0 } })]],
      };
      break;
    case 'social':
      base = {
        id,
        type,
        align: 'center',
        links: [
          { network: 'github', href: 'https://github.com/' },
          { network: 'linkedin', href: 'https://www.linkedin.com/' },
        ],
      };
      break;
    case 'footer':
      base = { id, type, content: emailRichText(''), align: 'center' };
      break;
    default:
      throw new Error(`Unknown email block type: ${String(type)}`);
  }
  return { ...base, ...overrides } as EmailBlockOfType<T>;
}

/** New document with default settings, merged with `partial` (settings are merged key by key). */
export function createEmailDocument(partial: Partial<Omit<EmailDocument, 'settings' | 'version'>> & { settings?: Partial<EmailSettings> } = {}): EmailDocument {
  return {
    version: 1,
    subject: partial.subject ?? '',
    preheader: partial.preheader ?? '',
    settings: { ...defaultEmailSettings, ...partial.settings },
    blocks: partial.blocks ?? [],
  };
}

/** Deep copy of a block with fresh ids (also for column children). */
export function cloneEmailBlock<T extends EmailBlock>(block: T): T {
  const copy = JSON.parse(JSON.stringify(block)) as T;
  copy.id = createEmailId();
  if (copy.type === 'columns') {
    copy.columns = copy.columns.map((column) => column.map((child) => ({ ...child, id: createEmailId() })));
  }
  return copy;
}

/** Inserts `block` at `index` (end when omitted). */
export function insertEmailBlock(doc: EmailDocument, block: EmailBlock, index = doc.blocks.length): EmailDocument {
  const at = Math.max(0, Math.min(index, doc.blocks.length));
  return { ...doc, blocks: [...doc.blocks.slice(0, at), block, ...doc.blocks.slice(at)] };
}

/** Replaces fields of the block `id`. */
export function updateEmailBlock(doc: EmailDocument, id: string, patch: Partial<EmailBlock>): EmailDocument {
  return { ...doc, blocks: doc.blocks.map((block) => (block.id === id ? ({ ...block, ...patch } as EmailBlock) : block)) };
}

export function removeEmailBlock(doc: EmailDocument, id: string): EmailDocument {
  return { ...doc, blocks: doc.blocks.filter((block) => block.id !== id) };
}

/** Moves the block `id` to `toIndex` (clamped). */
export function moveEmailBlock(doc: EmailDocument, id: string, toIndex: number): EmailDocument {
  const from = doc.blocks.findIndex((block) => block.id === id);
  if (from < 0) return doc;
  const blocks = doc.blocks.slice();
  const [block] = blocks.splice(from, 1);
  const to = Math.max(0, Math.min(toIndex, blocks.length));
  blocks.splice(to, 0, block!);
  return { ...doc, blocks };
}

/** Inserts a copy (new ids) right after the block `id`. */
export function duplicateEmailBlock(doc: EmailDocument, id: string): EmailDocument {
  const index = doc.blocks.findIndex((block) => block.id === id);
  if (index < 0) return doc;
  return insertEmailBlock(doc, cloneEmailBlock(doc.blocks[index]!), index + 1);
}

export function updateEmailSettings(doc: EmailDocument, patch: Partial<EmailSettings>): EmailDocument {
  return { ...doc, settings: { ...doc.settings, ...patch } };
}
