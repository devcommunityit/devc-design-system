import {
  Component,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ErrorInfo,
  type ReactNode,
  type RefObject,
} from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ChevronDown,
  Link as LinkIcon,
  ListTree,
} from "lucide-react";
import {
  Alert,
  CodeBlock,
  Heading,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Text,
  VisuallyHidden,
} from "@devcommunityit/ui";
import { slugify } from "../content/source";
import { useI18n } from "../settings";

/** Section with a linkable heading (direct links to sections). */
export function DocSection({
  title,
  id,
  level = 2,
  children,
}: {
  title: string;
  id?: string;
  level?: 2 | 3;
  children: ReactNode;
}) {
  const { t } = useI18n();
  const anchor = id ?? slugify(title);
  return (
    <section className="docs-section" aria-labelledby={anchor}>
      <Heading level={level} id={anchor} className="docs-anchor-heading">
        {title}
        <a
          className="docs-anchor"
          href={`#${anchor}`}
          aria-label={t.doc.anchor(title)}
        >
          <LinkIcon aria-hidden="true" size={14} />
        </a>
      </Heading>
      {children}
    </section>
  );
}

/** Copyable TypeScript snippet. */
export function Code({
  children,
  language = "tsx",
  title,
}: {
  children: string;
  language?: string;
  title?: string;
}) {
  return (
    <CodeBlock
      code={children.trim()}
      language={language}
      title={title}
      copyable
    />
  );
}

/** Simple two-or-more column reference table built on the library Table. */
export function RefTable({
  label,
  columns,
  rows,
}: {
  label: string;
  columns: string[];
  rows: ReactNode[][];
}) {
  return (
    <Table scrollRegionLabel={label} className="docs-table">
      <TableHead>
        <TableRow>
          {columns.map((c) => (
            <TableHeaderCell key={c}>{c}</TableHeaderCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row, r) => (
          <TableRow key={r}>
            {row.map((cell, c) =>
              c === 0 ? (
                <TableHeaderCell key={c} scope="row">
                  {cell}
                </TableHeaderCell>
              ) : (
                <TableCell key={c}>{cell}</TableCell>
              ),
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

interface BoundaryProps {
  children: ReactNode;
  fallback: (error: Error) => ReactNode;
}

export class ErrorBoundary extends Component<
  BoundaryProps,
  { error: Error | null }
> {
  override state: { error: Error | null } = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info.componentStack);
  }

  override render() {
    if (this.state.error) return this.props.fallback(this.state.error);
    return this.props.children;
  }
}

export function LoadError({ error }: { error: Error }) {
  const { t } = useI18n();
  return (
    <Alert tone="danger" title={t.doc.loadError}>
      {error.message}
    </Alert>
  );
}

export interface TocItem {
  id: string;
  label: string;
  children?: TocItem[];
}

/**
 * Id of the section currently read: the last target whose top has reached its own
 * scroll-margin line (the same position an anchor jump scrolls it to).
 */
function useActiveSection(ids: string[]): string | undefined {
  const [active, setActive] = useState<string>();
  const key = ids.join("|");
  useEffect(() => {
    const targets = key ? key.split("|") : [];
    if (targets.length === 0) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      let current: string | undefined;
      let currentTop = -Infinity;
      let last: string | undefined;
      let lastTop = -Infinity;
      for (const id of targets) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top > lastTop) {
          last = id;
          lastTop = top;
        }
        const margin = parseFloat(getComputedStyle(el).scrollMarginBlockStart) || 0;
        if (top - margin <= 1 && top > currentTop) {
          current = id;
          currentTop = top;
        }
      }
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      setActive(atBottom && window.scrollY > 0 ? last : current);
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [key]);
  return active;
}

/**
 * "On this page" navigation. In a wide main area it is a sticky right-hand column
 * (see `.docs-article--toc`); in narrow ones a sticky bar that opens a panel.
 * The section being read is marked with `aria-current="location"`.
 */
export function PageToc({ items }: { items: TocItem[] }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const listId = useId();
  const navRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const ids = useMemo(
    () => items.flatMap((i) => [i.id, ...(i.children ?? []).map((c) => c.id)]),
    [items],
  );
  const activeId = useActiveSection(ids);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      toggleRef.current?.focus();
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  // Keep the current entry visible when the list scrolls inside its own box.
  useEffect(() => {
    const list = listRef.current;
    if (!list || !activeId || list.scrollHeight <= list.clientHeight) return;
    const link = list.querySelector<HTMLElement>('[aria-current="location"]');
    if (!link) return;
    const linkBox = link.getBoundingClientRect();
    const listBox = list.getBoundingClientRect();
    if (linkBox.top < listBox.top) list.scrollTop -= listBox.top - linkBox.top + 8;
    else if (linkBox.bottom > listBox.bottom)
      list.scrollTop += linkBox.bottom - listBox.bottom + 8;
  }, [activeId, open]);

  if (items.length < 2) return null;
  const activeIndex = items.findIndex(
    (i) => i.id === activeId || i.children?.some((c) => c.id === activeId),
  );
  const activeLabel = activeIndex >= 0 ? items[activeIndex]?.label : undefined;
  const backToTop = () => {
    setOpen(false);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    const heading = navRef.current?.closest("article")?.querySelector<HTMLElement>("h1");
    if (heading) {
      if (!heading.hasAttribute("tabindex")) heading.setAttribute("tabindex", "-1");
      heading.focus({ preventScroll: true });
    }
  };
  const link = (item: TocItem) => (
    <a
      href={`#${item.id}`}
      aria-current={item.id === activeId ? "location" : undefined}
      onClick={() => setOpen(false)}
    >
      {item.label}
    </a>
  );

  return (
    <nav
      ref={navRef}
      className="docs-toc"
      aria-label={t.doc.onThisPage}
      data-open={open || undefined}
    >
      <Text as="p" variant="label-md" tone="secondary" className="docs-toc-title">
        <ListTree aria-hidden="true" size={16} />
        {t.doc.onThisPage}
      </Text>
      <button
        ref={toggleRef}
        type="button"
        className="docs-toc-toggle"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="docs-toc-toggle-label">{t.doc.onThisPage}</span>
        {activeLabel ? (
          <span className="docs-toc-current">
            <VisuallyHidden>{t.doc.currentSection}</VisuallyHidden>
            {activeLabel}
          </span>
        ) : (
          <span className="docs-toc-current" />
        )}
        {activeIndex >= 0 ? (
          <span className="docs-toc-count" aria-hidden="true">
            {activeIndex + 1}/{items.length}
          </span>
        ) : null}
        <ChevronDown aria-hidden="true" size={16} />
      </button>
      <span className="docs-toc-progress" aria-hidden="true" />
      <ol ref={listRef} id={listId} className="docs-toc-list">
        {items.map((item) => (
          <li key={item.id}>
            {link(item)}
            {item.children && item.children.length > 0 ? (
              <ol className="docs-toc-sublist">
                {item.children.map((child) => (
                  <li key={child.id}>{link(child)}</li>
                ))}
              </ol>
            ) : null}
          </li>
        ))}
      </ol>
      <button type="button" className="docs-toc-top" onClick={backToTop}>
        <ArrowUp aria-hidden="true" size={14} />
        {t.doc.backToTop}
      </button>
    </nav>
  );
}

/** Collects the level-2 section headings rendered inside `container` (also after lazy content loads). */
export function useSectionHeadings(
  container: RefObject<HTMLElement | null>,
  pageKey: string,
): TocItem[] {
  const [items, setItems] = useState<TocItem[]>([]);
  useEffect(() => {
    const root = container.current;
    if (!root) return;
    const read = () => {
      const next = Array.from(
        root.querySelectorAll<HTMLElement>("h2.docs-anchor-heading[id]"),
      ).map((h) => ({
        id: h.id,
        label: h.textContent?.trim() ?? h.id,
      }));
      setItems((prev) =>
        prev.length === next.length &&
        prev.every((p, i) => p.id === next[i]?.id && p.label === next[i]?.label)
          ? prev
          : next,
      );
    };
    read();
    const observer = new MutationObserver(read);
    observer.observe(root, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [container, pageKey]);
  return items;
}

export interface PagerLink {
  href: string;
  label: string;
}

/** Previous / next links at the bottom of a page. */
export function PrevNext({
  prev,
  next,
  label,
}: {
  prev?: PagerLink;
  next?: PagerLink;
  label: string;
}) {
  const { t } = useI18n();
  if (!prev && !next) return null;
  return (
    <nav className="docs-pager" aria-label={label}>
      {prev ? (
        <Link href={prev.href} className="docs-pager-link" rel="prev">
          <ArrowLeft aria-hidden="true" size={16} />
          <span>
            <span className="docs-pager-hint">{t.doc.previous}</span>
            <span className="docs-pager-title">{prev.label}</span>
          </span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link
          href={next.href}
          className="docs-pager-link docs-pager-link--next"
          rel="next"
        >
          <span>
            <span className="docs-pager-hint">{t.doc.next}</span>
            <span className="docs-pager-title">{next.label}</span>
          </span>
          <ArrowRight aria-hidden="true" size={16} />
        </Link>
      ) : null}
    </nav>
  );
}
