import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import type { Editor } from '@tiptap/core';
import { axe } from '../../../test/axe';
import { RichTextContent, RichTextEditor, isSafeRichTextUrl, type RichTextEditorValue } from '.';
import { getBlockByIndex, moveBlock } from './extensions';

beforeAll(() => {
  const rect = { x: 0, y: 0, top: 0, left: 0, bottom: 0, right: 0, width: 0, height: 0, toJSON: () => ({}) } as DOMRect;
  const rects = () => Object.assign([rect], { item: () => rect }) as unknown as DOMRectList;
  if (!Range.prototype.getClientRects) Range.prototype.getClientRects = rects;
  if (!Range.prototype.getBoundingClientRect) Range.prototype.getBoundingClientRect = () => rect;
  if (!document.elementFromPoint) document.elementFromPoint = () => null;
});

afterEach(() => vi.useRealTimers());

async function renderEditor(props: Partial<Parameters<typeof RichTextEditor>[0]> = {}) {
  let editor: Editor | undefined;
  const utils = render(
    <RichTextEditor
      label="Body"
      {...props}
      onEditorReady={(instance) => {
        editor = instance;
        props.onEditorReady?.(instance);
      }}
    />,
  );
  const textbox = await screen.findByRole('textbox', { name: /^Body/ });
  await waitFor(() => expect(editor).toBeDefined());
  return { ...utils, textbox, editor: editor as Editor };
}

describe('RichTextEditor', () => {
  it('renders a labelled multiline textbox with field states', async () => {
    const { textbox } = await renderEditor({ description: 'Help', isRequired: true, isInvalid: true, errorMessage: 'Required field' });
    expect(textbox).toHaveAttribute('aria-multiline', 'true');
    expect(textbox).toHaveAttribute('aria-required', 'true');
    expect(textbox).toHaveAttribute('aria-invalid', 'true');
    expect(textbox).toHaveAccessibleDescription(/Help/);
    expect(textbox).toHaveAccessibleDescription(/Required field/);
    expect(textbox).toHaveAttribute('contenteditable', 'true');
  });

  it('has no axe violations', async () => {
    const { container } = await renderEditor({ description: 'Help', defaultValue: '<p>Hello</p>', showCount: true });
    expect(await axe(container)).toHaveNoViolations();
  });

  it('falls back to a localized accessible name', async () => {
    render(<RichTextEditor />);
    const textbox = await screen.findByRole('textbox');
    expect(textbox).toHaveAttribute('aria-label');
    expect(textbox.getAttribute('aria-label')).not.toBe('');
  });

  it('reflects active marks with aria-pressed and toggles bold from the toolbar', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { editor } = await renderEditor({ defaultValue: '<p>Hello world</p>', onChange });
    expect(screen.getByRole('toolbar')).toBeInTheDocument();
    const bold = screen.getByRole('button', { name: /bold|grassetto/i });
    expect(bold).toHaveAttribute('aria-pressed', 'false');
    act(() => {
      editor.commands.focus();
      editor.commands.selectAll();
    });
    await user.click(bold);
    await waitFor(() => expect(bold).toHaveAttribute('aria-pressed', 'true'));
    expect(editor.getHTML()).toContain('<strong>Hello world</strong>');
    expect(onChange).toHaveBeenLastCalledWith(expect.objectContaining({ html: '<p><strong>Hello world</strong></p>' }));
  });

  it('emits html, json and text on change', async () => {
    const onChange = vi.fn<(value: RichTextEditorValue) => void>();
    const { editor } = await renderEditor({ onChange });
    act(() => {
      editor.commands.setContent('<h2>Title</h2><p>Body</p>', { emitUpdate: true });
    });
    const value = onChange.mock.lastCall?.[0];
    expect(value?.html).toBe('<h2>Title</h2><p>Body</p>');
    expect(value?.text).toBe('Title\nBody');
    expect(value?.json.content?.[0]).toMatchObject({ type: 'heading', attrs: { level: 2 } });
    act(() => {
      editor.commands.clearContent(true);
    });
    expect(onChange.mock.lastCall?.[0].html).toBe('');
  });

  it('syncs controlled values without resetting the selection on its own updates', async () => {
    let setter: (value: string) => void = () => {};
    let editor: Editor | undefined;
    function Controlled() {
      const [value, setValue] = useState('<p>First</p>');
      setter = setValue;
      return <RichTextEditor label="Body" value={value} onChange={(next) => setValue(next.html)} onEditorReady={(e) => (editor = e)} />;
    }
    render(<Controlled />);
    await screen.findByRole('textbox', { name: 'Body' });
    await waitFor(() => expect(editor).toBeDefined());
    const instance = editor as Editor;
    expect(instance.getHTML()).toBe('<p>First</p>');

    act(() => {
      instance.commands.setTextSelection(3);
      instance.commands.insertContent('X');
    });
    expect(instance.getHTML()).toBe('<p>FiXrst</p>');
    expect(instance.state.selection.from).toBe(4);

    act(() => setter('<p>External</p>'));
    await waitFor(() => expect(instance.getHTML()).toBe('<p>External</p>'));
  });

  it('is read-only without toolbar', async () => {
    const { textbox } = await renderEditor({ isReadOnly: true, defaultValue: '<p>Locked</p>' });
    expect(textbox).toHaveAttribute('aria-readonly', 'true');
    expect(textbox).toHaveAttribute('contenteditable', 'false');
    expect(screen.queryByRole('toolbar')).not.toBeInTheDocument();
  });

  it('marks disabled editors', async () => {
    const { textbox } = await renderEditor({ isDisabled: true });
    expect(textbox).toHaveAttribute('aria-disabled', 'true');
    expect(textbox).toHaveAttribute('contenteditable', 'false');
  });

  it('shows a live character counter and enforces the limit', async () => {
    const { editor, textbox } = await renderEditor({ characterLimit: 10, defaultValue: '<p>Hello</p>' });
    expect(textbox).toHaveAccessibleDescription(/5/);
    act(() => {
      editor.commands.focus('end');
      editor.commands.insertContent('12345');
    });
    expect(editor.getText()).toBe('Hello12345');
    act(() => {
      editor.commands.insertContent('6');
    });
    expect(editor.getText()).toBe('Hello12345');
    await waitFor(() => expect(textbox).toHaveAccessibleDescription(/^0 /));
  });

  it('counts words when requested', async () => {
    const { textbox } = await renderEditor({ showCount: 'words', defaultValue: '<p>one two three</p>' });
    expect(textbox).toHaveAccessibleDescription(/3/);
  });

  it('respects disabled features', async () => {
    const { editor } = await renderEditor({ features: { table: false, image: false, headings: false } });
    expect(editor.schema.nodes.table).toBeUndefined();
    expect(editor.schema.nodes.image).toBeUndefined();
    expect(editor.schema.nodes.heading).toBeUndefined();
    expect(editor.schema.nodes.bulletList).toBeDefined();
  });

  it('drops unsafe link protocols and adds rel to links', async () => {
    const { editor } = await renderEditor({
      defaultValue: '<p><a href="javascript:alert(1)">bad</a> <a href="https://example.com" target="_blank">good</a></p>',
    });
    const html = editor.getHTML();
    expect(html).not.toContain('javascript:');
    expect(html).toContain('href="https://example.com"');
    expect(html).toContain('rel="noopener noreferrer"');
    expect(editor.commands.setLink({ href: 'javascript:alert(1)' })).toBe(false);
  });

  it('opens the slash menu in the blocks variant, filters and inserts a block', async () => {
    const { editor, textbox } = await renderEditor({ variant: 'blocks' });
    act(() => {
      editor.commands.focus();
      editor.commands.insertContent('/');
    });
    const listbox = await screen.findByRole('listbox');
    expect(textbox).toHaveAttribute('aria-expanded', 'true');
    expect(textbox).toHaveAttribute('aria-controls', listbox.id);
    expect(screen.getAllByRole('option').length).toBeGreaterThan(5);

    act(() => {
      editor.commands.insertContent('quote');
    });
    await waitFor(() => expect(screen.getAllByRole('option')).toHaveLength(1));
    expect(textbox.getAttribute('aria-activedescendant')).toBe(screen.getByRole('option').id);

    fireEvent.keyDown(textbox, { key: 'Enter' });
    await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument());
    expect(editor.getHTML()).toMatch(/^<blockquote><p><\/p><\/blockquote>/);
  });

  it('shows the empty state in the slash menu and closes it with Escape', async () => {
    const { editor, textbox } = await renderEditor({ variant: 'blocks' });
    act(() => {
      editor.commands.focus();
      editor.commands.insertContent('/zzzz');
    });
    const listbox = await screen.findByRole('listbox');
    expect(screen.queryAllByRole('option')).toHaveLength(0);
    expect(listbox).toBeInTheDocument();
    expect(screen.getAllByText(/no matching|nessun blocco/i).length).toBeGreaterThan(0);
    fireEvent.keyDown(textbox, { key: 'Escape' });
    await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument());
  });

  it('moves blocks with the keyboard shortcut helpers', async () => {
    const { editor } = await renderEditor({ defaultValue: '<p>A</p><p>B</p><p>C</p>' });
    act(() => {
      editor.commands.setTextSelection(5);
      moveBlock(editor, -1);
    });
    expect(editor.getHTML()).toBe('<p>B</p><p>A</p><p>C</p>');
    expect(getBlockByIndex(editor.state.doc, 0)?.node.textContent).toBe('B');
  });
});

describe('isSafeRichTextUrl', () => {
  it.each([
    ['https://example.com', true],
    ['mailto:hi@example.com', true],
    ['tel:+390000', true],
    ['/relative/path', true],
    ['#anchor', true],
    ['javascript:alert(1)', false],
    ['  JaVa\tScRiPt:alert(1)', false],
    ['data:text/html,<script>', false],
    ['vbscript:x', false],
  ])('%s → %s', (url, expected) => {
    expect(isSafeRichTextUrl(url)).toBe(expected);
  });

  it('allows data images only for images', () => {
    expect(isSafeRichTextUrl('data:image/png;base64,AAAA', 'image')).toBe(true);
    expect(isSafeRichTextUrl('data:image/png;base64,AAAA', 'link')).toBe(false);
  });
});

describe('RichTextContent', () => {
  it('renders trusted HTML with optional sanitize', () => {
    const { container } = render(
      <RichTextContent
        as="article"
        html="<h2>Hi</h2><script>bad()</script>"
        sanitize={(html) => html.replace(/<script.*<\/script>/, '')}
      />,
    );
    expect(container.querySelector('article h2')).toHaveTextContent('Hi');
    expect(container.querySelector('script')).toBeNull();
  });

  it('renders JSON through the editor schema', async () => {
    render(
      <RichTextContent
        json={{
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', marks: [{ type: 'link', attrs: { href: 'javascript:alert(1)' } }], text: 'x' }],
            },
          ],
        }}
        data-testid="content"
      />,
    );
    const content = await screen.findByTestId('content');
    await waitFor(() => expect(content).toHaveTextContent('x'));
    expect(content.innerHTML).not.toContain('javascript:');
  });
});
