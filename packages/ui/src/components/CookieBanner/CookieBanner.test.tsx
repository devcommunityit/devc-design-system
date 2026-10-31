import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '../../../test/axe';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { CookieBanner } from './CookieBanner';

describe('CookieBanner', () => {
  it('composes controlled privacy preferences and delegates saving', async () => {
    const onChange = vi.fn();
    const onSave = vi.fn();
    const { container } = render(
      <LocaleProvider locale="en-US">
        <CookieBanner title="Privacy choices" description="Choose optional categories." categories={[
          { id: 'required', label: 'Essential', isRequired: true }, { id: 'analytics', label: 'Analytics' },
        ]} value={['required']} onChange={onChange} onSave={onSave} />
      </LocaleProvider>,
    );
    await userEvent.setup().click(screen.getByRole('checkbox', { name: 'Analytics' }));
    expect(onChange).toHaveBeenCalledWith(['required', 'analytics']);
    await userEvent.setup().click(screen.getByRole('button', { name: 'Save preferences' }));
    expect(onSave).toHaveBeenCalledWith(['required']);
    expect(await axe(container)).toHaveNoViolations();
  });
});
