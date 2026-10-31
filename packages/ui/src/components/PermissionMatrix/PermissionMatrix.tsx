import { useMessages } from '../../i18n/LocaleProvider';
import { cx, useControllableState } from '../../utils';
import shared from '../composite/Composite.module.css';
import { SelectionMatrix, type MatrixItem, type MatrixValue } from '../composite/SelectionMatrix';

export type PermissionMatrixItem = MatrixItem;
/** Keys are role ids and values are the permission ids granted to that role. */
export type PermissionMatrixValue = MatrixValue;

export interface PermissionMatrixProps {
  'aria-label': string;
  roles: readonly PermissionMatrixItem[];
  permissions: readonly PermissionMatrixItem[];
  value?: PermissionMatrixValue;
  defaultValue?: PermissionMatrixValue;
  onChange?: (value: PermissionMatrixValue) => void;
  isCellDisabled?: (permissionId: string, roleId: string) => boolean;
  showBulkActions?: boolean;
  className?: string;
}

/** Editor for a consumer-owned role/permission matrix; it does not enforce authorization. */
export function PermissionMatrix({
  'aria-label': ariaLabel, roles, permissions, value: controlledValue, defaultValue = {}, onChange,
  isCellDisabled, showBulkActions = true, className,
}: PermissionMatrixProps) {
  const t = useMessages().components;
  const [value, setValue] = useControllableState(controlledValue, defaultValue, onChange, 'value');
  return (
    <section className={cx(shared.root, className)} aria-label={ariaLabel}>
      <SelectionMatrix
        label={ariaLabel} columns={roles} rows={permissions} value={value} onChange={setValue}
        isCellDisabled={isCellDisabled} cellLabel={t.permissionCell}
        columnAllLabel={showBulkActions ? t.permissionRoleAll : undefined}
        rowAllLabel={showBulkActions ? t.permissionAllRoles : undefined}
      />
    </section>
  );
}
