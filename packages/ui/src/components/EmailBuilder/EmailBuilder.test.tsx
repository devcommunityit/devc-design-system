import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { EmailBuilder } from './EmailBuilder';
import {
  createEmailBlock,
  createEmailDocument,
  duplicateEmailBlock,
  emailRichText,
  moveEmailBlock,
  removeEmailBlock,
  type EmailDocument,
  type EmailRichText,
} from './emailDocument';
import { escapeEmailHtml, renderEmailHtml, renderEmailRichText, renderEmailText, sanitizeEmailUrl } from './renderEmailHtml';
import { defaultEmailSettings } from './emailDocument';

// ProseMirror measures text through layout APIs that jsdom does not implement.
beforeAll(() => {
  const rect = { x: 0, y: 0, top: 0, left: 0, bottom: 0, right: 0, width: 0, height: 0, toJSON: () => ({}) } as DOMRect;
  const rects = Object.assign([rect], { item: () => rect }) as unknown as DOMRectList;
  if (!Range.prototype.getClientRects) Range.prototype.getClientRects = () => rects;
  if (!Range.prototype.getBoundingClientRect) Range.prototype.getBoundingClientRect = () => rect;
  if (!document.elementFromPoint) document.elementFromPoint = () => null;
  if (!navigator.clipboard) Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: vi.fn(() => Promise.resolve()) } });
});

// The canvas rows contain the email's own (presentation) tables: only take the grid's block rows.
function blockRows(): HTMLElement[] {
  return Array.from(screen.getByRole('grid', { name: 'Email content' }).querySelectorAll<HTMLElement>('[role="row"][data-key]'));
}

function sampleDoc(): EmailDocument {
  return createEmailDocument({
    subject: 'Hello',
    preheader: 'Preheader text',
    blocks: [
      createEmailBlock('heading', { id: 'h', content: emailRichText('Welcome') }),
      createEmailBlock('text', { id: 't', content: emailRichText('Body copy') }),
      createEmailBlock('button', { id: 'b', label: 'Join', href: 'https://example.org' }),
    ],
  });
}

describe('emailDocument helpers', () => {
  it('creates blocks with defaults and unique ids', () => {
    const a = createEmailBlock('button');
    const b = createEmailBlock('button');
    expect(a.id).not.toBe(b.id);
    expect(a).toMatchObject({ type: 'button', label: 'Button', align: 'center' });
    expect(createEmailBlock('image')).toMatchObject({ type: 'image', alt: '' });
    expect(createEmailBlock('spacer').height).toBeGreaterThan(0);
    expect(createEmailBlock('columns').columns).toHaveLength(2);
    const doc = createEmailDocument();
    expect(doc).toMatchObject({ version: 1, blocks: [], settings: { width: 600 } });
  });

  it('updates immutably', () => {
    const doc = sampleDoc();
    const moved = moveEmailBlock(doc, 'b', 0);
    expect(moved.blocks.map((block) => block.id)).toEqual(['b', 'h', 't']);
    expect(doc.blocks.map((block) => block.id)).toEqual(['h', 't', 'b']);
    expect(removeEmailBlock(doc, 't').blocks).toHaveLength(2);
    const duplicated = duplicateEmailBlock(doc, 'h');
    expect(duplicated.blocks).toHaveLength(4);
    expect(duplicated.blocks[1]!.id).not.toBe('h');
    expect(duplicated.blocks[1]!.type).toBe('heading');
  });
});

describe('renderEmailHtml', () => {
  it('produces an email-safe document with preheader, lang/dir and presentation tables', () => {
    const html = renderEmailHtml(sampleDoc(), { lang: 'it', dir: 'rtl' });
    expect(html).toMatch(/^<!DOCTYPE html PUBLIC "-\/\/W3C\/\/DTD XHTML 1\.0 Transitional\/\/EN"/);
    expect(html).toContain('<meta charset="utf-8"');
    expect(html).toContain('name="viewport"');
    expect(html).toContain('name="color-scheme"');
    expect(html).toContain('lang="it"');
    expect(html).toContain('dir="rtl"');
    expect(html).toContain('Preheader text');
    expect(html).toContain('role="presentation"');
    expect(html).toContain('<title>Hello</title>');
    expect(html).toContain('@media');
  });

  it('escapes text and attributes', () => {
    const doc = createEmailDocument({
      subject: '<script>alert(1)</script>',
      blocks: [
        createEmailBlock('text', { content: emailRichText('<img src=x onerror=alert(1)> & "quotes"') }),
        createEmailBlock('image', { src: 'https://example.org/a.png?x="><script>', alt: 'A "quoted" <alt>' }),
        createEmailBlock('button', { label: '<b>Go</b>', href: 'https://example.org/?a=1&b="2"' }),
      ],
    });
    const html = renderEmailHtml(doc);
    expect(html).not.toContain('<script>');
    expect(html).not.toContain('<img src=x');
    expect(html).not.toContain('<b>Go</b>');
    expect(html).toContain('&lt;img src=x onerror=alert(1)&gt; &amp; &quot;quotes&quot;');
    expect(html).toContain('alt="A &quot;quoted&quot; &lt;alt&gt;"');
    expect(html).toContain('&lt;b&gt;Go&lt;/b&gt;');
    expect(escapeEmailHtml(`'`)).toBe('&#39;');
  });

  it('sanitizes URLs and keeps merge tags', () => {
    expect(sanitizeEmailUrl('javascript:alert(1)')).toBe('#');
    expect(sanitizeEmailUrl(' JaVaScRiPt:alert(1)')).toBe('#');
    expect(sanitizeEmailUrl('data:text/html,hi')).toBe('#');
    expect(sanitizeEmailUrl('//evil.example')).toBe('#');
    expect(sanitizeEmailUrl('https://example.org/x')).toBe('https://example.org/x');
    expect(sanitizeEmailUrl('mailto:hi@example.org')).toBe('mailto:hi@example.org');
    expect(sanitizeEmailUrl('tel:+390000')).toBe('tel:+390000');
    expect(sanitizeEmailUrl('{{unsubscribe_url}}')).toBe('{{unsubscribe_url}}');
    const html = renderEmailHtml(
      createEmailDocument({
        blocks: [
          createEmailBlock('button', { label: 'Bad', href: 'javascript:alert(1)' }),
          createEmailBlock('footer', {
            content: {
              type: 'doc',
              content: [
                { type: 'paragraph', content: [{ type: 'text', text: 'Unsubscribe', marks: [{ type: 'link', attrs: { href: '{{unsubscribe_url}}' } }] }] },
              ],
            },
          }),
        ],
      }),
    );
    expect(html).not.toContain('javascript:');
    expect(html).toContain('href="#"');
    expect(html).toContain('href="{{unsubscribe_url}}"');
  });

  it('renders columns with MSO ghost tables and images with alt', () => {
    const doc = createEmailDocument({
      blocks: [
        createEmailBlock('columns', {
          columns: [
            [createEmailBlock('text', { content: emailRichText('Left') })],
            [createEmailBlock('image', { src: 'https://example.org/pic.png', alt: 'A picture' })],
            [createEmailBlock('button', { label: 'Right', href: 'https://example.org' })],
          ],
        }),
      ],
    });
    const html = renderEmailHtml(doc);
    expect(html).toContain('<!--[if mso]>');
    expect(html).toContain('<![endif]-->');
    expect(html.match(/class="dc-col"/g)).toHaveLength(3);
    expect(html).toContain('alt="A picture"');
    expect(html).toContain('Left');
  });

  it('renders rich text through a whitelist and drops unknown nodes', () => {
    const content: EmailRichText = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'Bold', marks: [{ type: 'bold' }] },
            { type: 'text', text: 'Evil', marks: [{ type: 'onclick' }] },
            { type: 'hardBreak' },
            { type: 'iframe', attrs: { src: 'https://evil.example' } } as unknown as EmailRichText,
          ],
        },
        { type: 'script', content: [{ type: 'text', text: 'alert(1)' }] } as unknown as EmailRichText,
        { type: 'bulletList', content: [{ type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Item' }] }] }] },
      ],
    };
    const html = renderEmailRichText(content, { settings: defaultEmailSettings });
    expect(html).toContain('<strong');
    expect(html).toContain('Bold');
    expect(html).toContain('Evil');
    expect(html).toContain('<br');
    expect(html).toContain('<ul');
    expect(html).toContain('Item');
    expect(html).not.toContain('iframe');
    expect(html).not.toContain('alert(1)');
    expect(html).not.toContain('onclick');
  });

  it('renders a plain-text alternative', () => {
    const text = renderEmailText(sampleDoc());
    expect(text.toLowerCase()).toContain('welcome');
    expect(text).toContain('Body copy');
    expect(text).toContain('Join');
    expect(text).toContain('https://example.org');
    expect(text).not.toContain('<');
  });
});

describe('EmailBuilder', () => {
  it('adds a block from the palette, selects it and announces it', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<EmailBuilder defaultValue={createEmailDocument()} onChange={onChange} />);
    expect(screen.getByText('Add a block to start building your email')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Divider' }));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0]![0].blocks[0].type).toBe('divider');
    expect(blockRows()).toHaveLength(1);
    expect(blockRows()[0]).toHaveAttribute('aria-selected', 'true');
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Divider added'));
    expect(screen.getByRole('heading', { name: /Block settings/ })).toBeInTheDocument();
  });

  it('shows email settings without a selection and block settings after selecting', async () => {
    const user = userEvent.setup();
    render(<EmailBuilder defaultValue={sampleDoc()} />);
    expect(screen.getByRole('heading', { name: 'Email settings' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Subject' })).toHaveValue('Hello');
    const rows = blockRows();
    await user.click(within(rows[2]!).getByText('Join'));
    expect(screen.getByRole('heading', { name: /Block settings/ })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Button text' })).toHaveValue('Join');
    await user.click(screen.getByRole('button', { name: 'Email settings' }));
    expect(screen.getByRole('heading', { name: 'Email settings' })).toBeInTheDocument();
  });

  it('moves, duplicates and deletes the selected block', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<EmailBuilder defaultValue={sampleDoc()} onChange={onChange} />);
    await user.click(within(blockRows()[2]!).getByText('Join'));
    const toolbar = screen.getByRole('toolbar', { name: 'Block actions' });
    expect(within(toolbar).getByRole('button', { name: 'Move down' })).toBeDisabled();

    await user.click(within(toolbar).getByRole('button', { name: 'Move up' }));
    expect(onChange.mock.lastCall![0].blocks.map((block: { id: string }) => block.id)).toEqual(['h', 'b', 't']);
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(/Button/));

    await user.click(within(screen.getByRole('toolbar', { name: 'Block actions' })).getByRole('button', { name: 'Move down' }));
    expect(onChange.mock.lastCall![0].blocks.map((block: { id: string }) => block.id)).toEqual(['h', 't', 'b']);

    await user.click(within(screen.getByRole('toolbar', { name: 'Block actions' })).getByRole('button', { name: 'Duplicate' }));
    expect(onChange.mock.lastCall![0].blocks).toHaveLength(4);

    await user.click(within(screen.getByRole('toolbar', { name: 'Block actions' })).getByRole('button', { name: 'Delete' }));
    expect(onChange.mock.lastCall![0].blocks).toHaveLength(3);
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(/Button/));
    expect(blockRows()).toHaveLength(3);
  });

  it('edits the selected block from the inspector', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<EmailBuilder defaultValue={sampleDoc()} onChange={onChange} />);
    await user.click(within(blockRows()[2]!).getByText('Join'));
    const field = screen.getByRole('textbox', { name: 'Button text' });
    await user.clear(field);
    await user.type(field, 'Go');
    expect(onChange.mock.lastCall![0].blocks[2].label).toBe('Go');
  });

  it('mounts the inline rich-text editor for the selected text block', async () => {
    const user = userEvent.setup();
    render(<EmailBuilder defaultValue={sampleDoc()} />);
    await user.click(within(blockRows()[1]!).getByText('Body copy'));
    const editor = await screen.findByRole('textbox', { name: 'Text' });
    expect(editor).toHaveAttribute('contenteditable', 'true');
    expect(editor).toHaveTextContent('Body copy');
    expect(screen.getByRole('button', { name: 'Bold' })).toBeInTheDocument();
  });

  it('previews the exported HTML in a sandboxed iframe', async () => {
    const user = userEvent.setup();
    const onModeChange = vi.fn();
    const { container } = render(<EmailBuilder defaultValue={sampleDoc()} onModeChange={onModeChange} />);
    await user.click(screen.getByRole('radio', { name: 'Preview' }));
    expect(onModeChange).toHaveBeenCalledWith('preview');
    const iframe = container.querySelector('iframe')!;
    expect(iframe).toHaveAttribute('title', 'Preview');
    expect(iframe).toHaveAttribute('sandbox', '');
    expect(iframe.getAttribute('srcdoc')).toContain('Preheader text');
    expect(iframe.getAttribute('srcdoc')).toContain('Join');
  });

  it('exports and copies the HTML', async () => {
    const user = userEvent.setup();
    const onExport = vi.fn();
    const writeText = vi.fn(() => Promise.resolve());
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
    const doc = sampleDoc();
    render(<EmailBuilder value={doc} onExport={onExport} />);
    await user.click(screen.getByRole('button', { name: 'Export HTML' }));
    expect(onExport).toHaveBeenCalledWith(expect.stringContaining('<!DOCTYPE'), doc);
    await user.click(screen.getByRole('button', { name: 'Copy HTML' }));
    expect(writeText).toHaveBeenCalledWith(expect.stringContaining('Join'));
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('HTML copied'));
  });

  it('restricts the palette and hides editing actions when read-only', async () => {
    const user = userEvent.setup();
    render(<EmailBuilder defaultValue={sampleDoc()} blockTypes={['text', 'button']} isReadOnly />);
    const palette = screen.getByRole('list', { name: 'Blocks' });
    expect(
      within(palette)
        .getAllByRole('button')
        .map((button) => button.textContent),
    ).toEqual(['Text', 'Button']);
    expect(within(palette).getByRole('button', { name: 'Text' })).toBeDisabled();
    await user.click(within(blockRows()[2]!).getByText('Join'));
    expect(screen.queryByRole('toolbar', { name: 'Block actions' })).not.toBeInTheDocument();
  });

  it('supports keyboard selection in the canvas', async () => {
    const user = userEvent.setup();
    render(<EmailBuilder defaultValue={sampleDoc()} />);
    const rows = blockRows();
    act(() => rows[0]!.focus());
    await user.keyboard('{ArrowDown}');
    await waitFor(() => expect(screen.getByRole('heading', { name: /Block settings/ })).toBeInTheDocument());
    fireEvent.keyDown(document.activeElement!, { key: 'Escape' });
    await waitFor(() => expect(screen.getByRole('heading', { name: 'Email settings' })).toBeInTheDocument());
  });
});
