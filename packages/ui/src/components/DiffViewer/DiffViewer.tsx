import { useId, useMemo } from 'react';
import { useMessages } from '../../i18n/LocaleProvider';
import { cx, useControllableState } from '../../utils';
import shared from '../composite/Composite.module.css';
import styles from './DiffViewer.module.css';

export type DiffViewerMode = 'unified' | 'split';
export interface DiffLine {
  kind: 'added' | 'removed' | 'unchanged';
  text: string;
  beforeLine?: number;
  afterLine?: number;
}

export interface DiffViewerProps {
  'aria-label': string;
  before: string;
  after: string;
  mode?: DiffViewerMode;
  defaultMode?: DiffViewerMode;
  onModeChange?: (mode: DiffViewerMode) => void;
  className?: string;
}

/** Computes a line-oriented diff. Limits prevent unexpectedly large quadratic allocations. */
export function diffLines(before: string, after: string): DiffLine[] {
  const left = before === '' ? [] : before.replace(/\r\n/g, '\n').split('\n');
  const right = after === '' ? [] : after.replace(/\r\n/g, '\n').split('\n');
  if ((left.length + 1) * (right.length + 1) > 1_000_000 || left.length + right.length > 10_000) {
    throw new RangeError('DiffViewer: input is too large for the built-in line comparison.');
  }
  const lengths = Array.from({ length: left.length + 1 }, () => new Uint32Array(right.length + 1));
  for (let i = left.length - 1; i >= 0; i--) {
    for (let j = right.length - 1; j >= 0; j--) {
      lengths[i]![j] = left[i] === right[j] ? lengths[i + 1]![j + 1]! + 1 : Math.max(lengths[i + 1]![j]!, lengths[i]![j + 1]!);
    }
  }
  const result: DiffLine[] = [];
  let i = 0;
  let j = 0;
  while (i < left.length || j < right.length) {
    if (i < left.length && j < right.length && left[i] === right[j]) {
      result.push({ kind: 'unchanged', text: left[i]!, beforeLine: i + 1, afterLine: j + 1 });
      i++; j++;
    } else if (i < left.length && (j === right.length || lengths[i + 1]![j]! >= lengths[i]![j + 1]!)) {
      result.push({ kind: 'removed', text: left[i]!, beforeLine: i + 1 });
      i++;
    } else {
      result.push({ kind: 'added', text: right[j]!, afterLine: j + 1 });
      j++;
    }
  }
  return result;
}

type SplitRow = { before?: DiffLine; after?: DiffLine };

function splitRows(lines: DiffLine[]): SplitRow[] {
  const rows: SplitRow[] = [];
  let removed: DiffLine[] = [];
  let added: DiffLine[] = [];
  const flush = () => {
    for (let index = 0; index < Math.max(removed.length, added.length); index++) {
      rows.push({ before: removed[index], after: added[index] });
    }
    removed = [];
    added = [];
  };
  for (const line of lines) {
    if (line.kind === 'unchanged') {
      flush();
      rows.push({ before: line, after: line });
    } else if (line.kind === 'removed') removed.push(line);
    else added.push(line);
  }
  flush();
  return rows;
}

/** Read-only line diff; text is rendered as text, not interpreted as HTML. */
export function DiffViewer({ 'aria-label': ariaLabel, before, after, mode: controlledMode, defaultMode = 'unified', onModeChange, className }: DiffViewerProps) {
  const t = useMessages();
  const text = t.components;
  const id = useId();
  const [mode, setMode] = useControllableState(controlledMode, defaultMode, onModeChange, 'mode');
  const lines = useMemo(() => diffLines(before, after), [before, after]);
  const label = (line: DiffLine) => line.kind === 'added' ? text.diffAdded : line.kind === 'removed' ? text.diffRemoved : text.diffUnchanged;
  const cell = (line?: DiffLine) => line ? (
    <span data-kind={line.kind} className={styles.line}>
      <span className={shared.srOnly}>{label(line)}: </span>
      <span aria-hidden="true">{line.kind === 'added' ? '+ ' : line.kind === 'removed' ? '− ' : '  '}</span>
      <code>{line.text || ' '}</code>
    </span>
  ) : null;
  return (
    <section className={cx(shared.root, className)} aria-label={ariaLabel}>
      <div className={shared.field}>
        <label htmlFor={id}>{text.diffView}</label>
        <select id={id} value={mode} onChange={(event) => {
          if (event.target.value === 'unified' || event.target.value === 'split') setMode(event.target.value);
        }}>
          <option value="unified">{text.diffUnified}</option>
          <option value="split">{text.diffSplit}</option>
        </select>
      </div>
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- keyboard access to the scroll container */}
      <div className={shared.scroll} role="group" aria-label={ariaLabel} tabIndex={0}>
        <table className={cx(shared.table, styles.table)} aria-label={ariaLabel}>
          <thead>
            {mode === 'unified' ? <tr><th scope="col">{text.diffBefore}</th><th scope="col">{text.diffAfter}</th><th scope="col">{text.diffView}</th></tr>
              : <tr><th scope="col">{text.diffBefore}</th><th scope="col">{text.diffAfter}</th></tr>}
          </thead>
          <tbody>
            {mode === 'unified' ? lines.map((line, index) => (
              <tr key={index} data-kind={line.kind}>
                <td>{line.beforeLine ?? ''}</td><td>{line.afterLine ?? ''}</td><td>{cell(line)}</td>
              </tr>
            )) : splitRows(lines).map((row, index) => (
              <tr key={index}>
                <td data-kind={row.before?.kind}>{row.before?.beforeLine ?? ''} {cell(row.before)}</td>
                <td data-kind={row.after?.kind}>{row.after?.afterLine ?? ''} {cell(row.after)}</td>
              </tr>
            ))}
            {!lines.length ? <tr><td colSpan={mode === 'unified' ? 3 : 2}>{t.noData}</td></tr> : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}
