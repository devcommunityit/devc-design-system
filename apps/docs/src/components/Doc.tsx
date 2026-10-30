import {
  Component,
  useEffect,
  useState,
  type ErrorInfo,
  type ReactNode,
  type RefObject,
} from "react";
import { ArrowLeft, ArrowRight, Link as LinkIcon } from "lucide-react";
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
} from "@dev-community/ui";
import { slugify } from "../content/source";

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
  const anchor = id ?? slugify(title);
  return (
    <section className="docs-section" aria-labelledby={anchor}>
      <Heading level={level} id={anchor} className="docs-anchor-heading">
        {title}
        <a
          className="docs-anchor"
          href={`#${anchor}`}
          aria-label={`Link diretto alla sezione ${title}`}
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
  return (
    <Alert tone="danger" title="Impossibile caricare il contenuto">
      {error.message}
    </Alert>
  );
}

export interface TocItem {
  id: string;
  label: string;
  children?: TocItem[];
}

/** "On this page" navigation with direct links to the page sections. */
export function PageToc({ items }: { items: TocItem[] }) {
  if (items.length < 2) return null;
  return (
    <nav className="docs-toc" aria-label="In questa pagina">
      <Text as="p" variant="label-md" tone="secondary">
        In questa pagina
      </Text>
      <ol className="docs-toc-list">
        {items.map((item) => (
          <li key={item.id}>
            <a href={`#${item.id}`}>{item.label}</a>
            {item.children && item.children.length > 0 ? (
              <ol className="docs-toc-list docs-toc-list--nested">
                {item.children.map((child) => (
                  <li key={child.id}>
                    <a href={`#${child.id}`}>{child.label}</a>
                  </li>
                ))}
              </ol>
            ) : null}
          </li>
        ))}
      </ol>
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
        prev.every((p, i) => p.id === next[i]?.id)
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
  if (!prev && !next) return null;
  return (
    <nav className="docs-pager" aria-label={label}>
      {prev ? (
        <Link href={prev.href} className="docs-pager-link" rel="prev">
          <ArrowLeft aria-hidden="true" size={16} />
          <span>
            <span className="docs-pager-hint">Precedente</span>
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
            <span className="docs-pager-hint">Successivo</span>
            <span className="docs-pager-title">{next.label}</span>
          </span>
          <ArrowRight aria-hidden="true" size={16} />
        </Link>
      ) : null}
    </nav>
  );
}
