import { Checkbox } from '../Checkbox';
import shared from './Composite.module.css';

export interface MatrixItem {
  id: string;
  label: string;
}

/** Keys are column ids; values are selected row ids. */
export type MatrixValue = Readonly<Record<string, readonly string[]>>;

interface SelectionMatrixProps {
  label: string;
  columns: readonly MatrixItem[];
  rows: readonly MatrixItem[];
  value: MatrixValue;
  onChange: (value: MatrixValue) => void;
  isCellDisabled?: (rowId: string, columnId: string) => boolean;
  cellLabel: (row: string, column: string) => string;
  columnAllLabel?: (column: string) => string;
  rowAllLabel?: (row: string) => string;
}

const selections = (value: MatrixValue, id: string): readonly string[] =>
  Object.prototype.hasOwnProperty.call(value, id) ? value[id]! : [];

export function SelectionMatrix({
  label, columns, rows, value, onChange, isCellDisabled, cellLabel, columnAllLabel, rowAllLabel,
}: SelectionMatrixProps) {
  for (const [name, items] of [['row', rows], ['column', columns]] as const) {
    const ids = new Set<string>();
    for (const item of items) {
      if (ids.has(item.id)) throw new Error(`SelectionMatrix: duplicate ${name} id "${item.id}".`);
      ids.add(item.id);
    }
  }
  const enabled = (row: MatrixItem, column: MatrixItem) => !isCellDisabled?.(row.id, column.id);
  const selected = (row: MatrixItem, column: MatrixItem) => selections(value, column.id).includes(row.id);
  const update = (cells: readonly { row: MatrixItem; column: MatrixItem }[], checked: boolean) => {
    const next: Record<string, readonly string[]> = { ...value };
    for (const { row, column } of cells) {
      if (!enabled(row, column)) continue;
      const current = new Set(selections(next, column.id));
      if (checked) current.add(row.id);
      else current.delete(row.id);
      next[column.id] = [...current];
    }
    onChange(next);
  };
  const allControl = (cells: Array<{ row: MatrixItem; column: MatrixItem }>, ariaLabel: string) => {
    const available = cells.filter(({ row, column }) => enabled(row, column));
    const count = available.filter(({ row, column }) => selected(row, column)).length;
    return (
      <Checkbox
        aria-label={ariaLabel}
        isSelected={available.length > 0 && count === available.length}
        isIndeterminate={count > 0 && count < available.length}
        isDisabled={!available.length}
        onChange={(checked) => update(available, checked)}
      />
    );
  };
  return (
    // The table may contain only disabled cells, so its scroll container must remain keyboard accessible.
    // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
    <div className={shared.scroll} role="group" aria-label={label} tabIndex={0}>
      <table className={shared.table} aria-label={label}>
        <thead>
          <tr>
            <th scope="col">{label}</th>
            {columns.map((column) => (
              <th key={column.id} scope="col">
                {column.label}
                {columnAllLabel ? allControl(rows.map((row) => ({ row, column })), columnAllLabel(column.label)) : null}
              </th>
            ))}
            {rowAllLabel ? <th scope="col">{rowAllLabel(label)}</th> : null}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <th scope="row">{row.label}</th>
              {columns.map((column) => (
                <td key={column.id}>
                  <Checkbox
                    aria-label={cellLabel(row.label, column.label)}
                    isSelected={selected(row, column)}
                    isDisabled={!enabled(row, column)}
                    onChange={(checked) => update([{ row, column }], checked)}
                  />
                </td>
              ))}
              {rowAllLabel ? <td>{allControl(columns.map((column) => ({ row, column })), rowAllLabel(row.label))}</td> : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
