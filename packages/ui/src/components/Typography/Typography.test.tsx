import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { axe } from '../../../test/axe';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { CodeBlock } from '../CodeBlock/CodeBlock';
import { Truncate } from '../Truncate/Truncate';
import { Code, Heading, Kbd, Link, List, ListItem, Quote, Text } from './Typography';

describe('Text / Heading', () => {
  it('Text renders the chosen element with role, tone and weight attributes', () => {
    const ref = createRef<HTMLElement>();
    render(
      <Text ref={ref} as="span" variant="label-md" tone="muted" weight="semibold" truncate data-testid="t">
        Hello
      </Text>,
    );
    const el = screen.getByTestId('t');
    expect(el.tagName).toBe('SPAN');
    expect(ref.current).toBe(el);
    expect(el).toHaveAttribute('data-variant', 'label-md');
    expect(el).toHaveAttribute('data-tone', 'muted');
    expect(el).toHaveAttribute('data-weight', 'semibold');
    expect(el).toHaveAttribute('data-truncate');
  });

  it('Heading keeps the semantic level independent from the visual size', () => {
    render(
      <>
        <Heading level={2} size="display">
          Big h2
        </Heading>
        <Heading level={4}>Default h4</Heading>
      </>,
    );
    expect(screen.getByRole('heading', { level: 2, name: 'Big h2' })).toHaveAttribute('data-variant', 'display');
    expect(screen.getByRole('heading', { level: 4, name: 'Default h4' })).toHaveAttribute('data-variant', 'title-lg');
  });
});

describe('Link', () => {
  it('is a real anchor; external links get target, rel and localized hidden text', async () => {
    const { container } = render(
      <LocaleProvider locale="it-IT">
        <p>
          Leggi la <Link href="/docs">guida</Link> o la{' '}
          <Link href="https://example.com" external>
            specifica
          </Link>
          .
        </p>
      </LocaleProvider>,
    );
    const internal = screen.getByRole('link', { name: 'guida' });
    expect(internal.tagName).toBe('A');
    expect(internal).toHaveAttribute('href', '/docs');
    expect(internal).not.toHaveAttribute('target');
    const external = screen.getByRole('link', { name: /specifica/ });
    expect(external).toHaveAttribute('target', '_blank');
    expect(external).toHaveAttribute('rel', 'noopener noreferrer');
    expect(external).toHaveAccessibleName(/^specifica ?\(si apre in una nuova scheda\)$/);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('List / Quote / Code / Kbd', () => {
  it('List keeps list semantics when markers are removed', () => {
    render(
      <List variant="none" ordered start={3}>
        <ListItem>One</ListItem>
        <ListItem>Two</ListItem>
      </List>,
    );
    const list = screen.getByRole('list');
    expect(list.tagName).toBe('OL');
    expect(list).toHaveAttribute('start', '3');
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('Quote renders blockquote with figcaption attribution', () => {
    render(
      <Quote attribution="Ada Lovelace" cite="https://example.com/source" data-testid="q">
        The engine weaves algebraic patterns.
      </Quote>,
    );
    const figure = screen.getByTestId('q');
    expect(figure.tagName).toBe('FIGURE');
    expect(figure.querySelector('blockquote')).toHaveAttribute('cite', 'https://example.com/source');
    expect(figure.querySelector('figcaption')).toHaveTextContent('Ada Lovelace');
  });

  it('Code and Kbd use native elements', () => {
    render(
      <p>
        Run <Code>npm test</Code> or press <Kbd keys={['Ctrl', 'K']} data-testid="k" />
      </p>,
    );
    expect(screen.getByText('npm test').tagName).toBe('CODE');
    const combo = screen.getByTestId('k');
    expect(combo.tagName).toBe('KBD');
    expect(combo.querySelectorAll('kbd')).toHaveLength(2);
  });
});

describe('CodeBlock', () => {
  afterEach(() => vi.restoreAllMocks());

  it('is a focusable named region with a wrap toggle and copy button', async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
    const onCopyCode = vi.fn();
    const { container } = render(<CodeBlock code={'const a = 1;'} language="ts" onCopyCode={onCopyCode} data-testid="cb" />);
    const region = screen.getByRole('region', { name: 'Code ts' });
    expect(region).toHaveAttribute('tabindex', '0');
    const wrap = screen.getByRole('button', { name: 'Wrap lines' });
    expect(wrap).toHaveAttribute('aria-pressed', 'false');
    await user.click(wrap);
    expect(wrap).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByTestId('cb')).toHaveAttribute('data-wrap');
    await user.click(screen.getByRole('button', { name: 'Copy' }));
    expect(writeText).toHaveBeenCalledWith('const a = 1;');
    expect(onCopyCode).toHaveBeenCalledWith('const a = 1;');
    expect(await screen.findByRole('status')).toHaveTextContent('Copied');
    expect(await axe(container)).toHaveNoViolations();
  });

  it('announces an error when the clipboard is unavailable', async () => {
    const user = userEvent.setup();
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined });
    render(<CodeBlock code="x" />);
    await user.click(screen.getByRole('button', { name: 'Copy' }));
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Error'));
  });
});

describe('Truncate', () => {
  afterEach(() => vi.restoreAllMocks());

  it('shows no toggle when the content fits', () => {
    render(<Truncate>Short text</Truncate>);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('reveals the full content with a real button when it overflows (uncontrolled)', async () => {
    vi.spyOn(HTMLElement.prototype, 'scrollHeight', 'get').mockReturnValue(200);
    vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(60);
    const user = userEvent.setup();
    render(<Truncate lines={2}>Very long text</Truncate>);
    const button = await screen.findByRole('button', { name: 'Show more' });
    expect(button).toHaveAttribute('aria-expanded', 'false');
    await user.click(button);
    expect(screen.getByRole('button', { name: 'Show less' })).toHaveAttribute('aria-expanded', 'true');
  });

  it('supports controlled expansion', async () => {
    vi.spyOn(HTMLElement.prototype, 'scrollHeight', 'get').mockReturnValue(200);
    vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(60);
    const user = userEvent.setup();
    const onChange = vi.fn();
    function Controlled() {
      const [open, setOpen] = useState(false);
      return (
        <Truncate
          isExpanded={open}
          onExpandedChange={(v) => {
            onChange(v);
            setOpen(v);
          }}
        >
          Long
        </Truncate>
      );
    }
    render(<Controlled />);
    await act(async () => {
      await user.click(await screen.findByRole('button', { name: 'Show more' }));
    });
    expect(onChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole('button', { name: 'Show less' })).toBeInTheDocument();
  });
});
