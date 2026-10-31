import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '../../../test/axe';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { PermissionMatrix } from './PermissionMatrix';

const roles = [{ id: 'editor', label: 'Editor' }, { id: 'viewer', label: 'Viewer' }];
const permissions = [{ id: 'read', label: 'Read' }, { id: 'write', label: 'Write' }];

describe('PermissionMatrix', () => {
  it('updates individual and bulk permissions without modifying disabled cells', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { container } = render(<LocaleProvider locale="en-US"><PermissionMatrix aria-label="Permissions" roles={roles} permissions={permissions}
      defaultValue={{ editor: ['read'] }} isCellDisabled={(permission, role) => permission === 'write' && role === 'viewer'} onChange={onChange} /></LocaleProvider>);
    expect(screen.getByRole('checkbox', { name: 'All permissions for Editor' })).toBePartiallyChecked();
    await user.click(screen.getByRole('checkbox', { name: 'All permissions for Editor' }));
    expect(onChange).toHaveBeenLastCalledWith({ editor: ['read', 'write'] });
    await user.click(screen.getByRole('checkbox', { name: 'Read for all roles' }));
    expect(screen.getByRole('checkbox', { name: 'Read for Viewer' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Write for Viewer' })).toBeDisabled();
    expect(await axe(container)).toHaveNoViolations();
  });
});
