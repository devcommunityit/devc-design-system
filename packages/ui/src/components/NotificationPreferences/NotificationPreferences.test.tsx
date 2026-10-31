import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '../../../test/axe';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { NotificationPreferences } from './NotificationPreferences';

describe('NotificationPreferences', () => {
  it('edits category and channel combinations', async () => {
    const onChange = vi.fn();
    const { container } = render(<LocaleProvider locale="en-US"><NotificationPreferences aria-label="Notifications"
      categories={[{ id: 'mentions', label: 'Mentions' }]} channels={[{ id: 'email', label: 'Email' }]} onChange={onChange} /></LocaleProvider>);
    await userEvent.setup().click(screen.getByRole('checkbox', { name: 'Mentions: Email' }));
    expect(onChange).toHaveBeenCalledWith({ email: ['mentions'] });
    expect(await axe(container)).toHaveNoViolations();
  });
});
