import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '../../../test/axe';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { PrivacyPreferences } from './PrivacyPreferences';

const categories = [
  { id: 'essential', label: 'Essential', isRequired: true },
  { id: 'analytics', label: 'Analytics' },
];

describe('PrivacyPreferences', () => {
  it('starts with optional categories off and can reject or accept them explicitly', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    const { container } = render(<LocaleProvider locale="en-US"><PrivacyPreferences aria-label="Privacy" categories={categories} onSave={onSave} /></LocaleProvider>);
    expect(screen.getByRole('checkbox', { name: 'Essential (Required)' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Essential (Required)' })).toBeDisabled();
    expect(screen.getByRole('checkbox', { name: 'Analytics' })).not.toBeChecked();
    await user.click(screen.getByRole('button', { name: 'Accept all' }));
    expect(onSave).toHaveBeenLastCalledWith(['essential', 'analytics']);
    await user.click(screen.getByRole('button', { name: 'Reject optional' }));
    expect(onSave).toHaveBeenLastCalledWith(['essential']);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('announces save failures and reports them to the consumer', async () => {
    const onError = vi.fn();
    const failure = new Error('offline');
    render(<LocaleProvider locale="en-US"><PrivacyPreferences aria-label="Privacy" categories={categories} onSave={() => Promise.reject(failure)} onError={onError} /></LocaleProvider>);
    await userEvent.setup().click(screen.getByRole('button', { name: 'Save preferences' }));
    expect(await screen.findByRole('alert')).toBeInTheDocument();
    expect(onError).toHaveBeenCalledWith(failure);
  });
});
