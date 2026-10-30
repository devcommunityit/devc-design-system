import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Link as LinkIcon } from 'lucide-react';
import { Alert, CodeBlock, Heading, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from '@dev-community/ui';
import { slugify } from '../content/source';

/** Section with a linkable heading (direct links to sections). */
export function DocSection({ title, id, level = 2, children }: { title: string; id?: string; level?: 2 | 3; children: ReactNode }) {
  const anchor = id ?? slugify(title);
  return (
    <section className="docs-section" aria-labelledby={anchor}>
      <Heading level={level} id={anchor} className="docs-anchor-heading">
        {title}
        <a className="docs-anchor" href={`#${anchor}`} aria-label={`Link diretto alla sezione ${title}`}>
          <LinkIcon aria-hidden="true" size={14} />
        </a>
      </Heading>
      {children}
    </section>
  );
}

/** Copyable TypeScript snippet. */
export function Code({ children, language = 'tsx', title }: { children: string; language?: string; title?: string }) {
  return <CodeBlock code={children.trim()} language={language} title={title} copyable />;
}

/** Simple two-or-more column reference table built on the library Table. */
export function RefTable({ label, columns, rows }: { label: string; columns: string[]; rows: ReactNode[][] }) {
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

export class ErrorBoundary extends Component<BoundaryProps, { error: Error | null }> {
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