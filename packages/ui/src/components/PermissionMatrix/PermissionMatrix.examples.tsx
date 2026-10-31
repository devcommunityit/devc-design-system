import { useState } from 'react';
import { PermissionMatrix, type PermissionMatrixValue } from '@dev-community/ui';

export function Roles() {
  const [value, setValue] = useState<PermissionMatrixValue>({ editor: ['read'] });
  return <PermissionMatrix aria-label="Permessi" roles={[{ id: 'editor', label: 'Editor' }, { id: 'reader', label: 'Lettore' }]}
    permissions={[{ id: 'read', label: 'Leggere' }, { id: 'edit', label: 'Modificare' }]} value={value} onChange={setValue} />;
}
