import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '../../../test/axe';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { UnsubscribePage } from './UnsubscribePage';

describe('UnsubscribePage', () => {
  it('exposes controlled notification preferences and delegates unsubscribe-all', async () => {
    const onChange = vi.fn();
    const onUnsubscribeAll = vi.fn();
    const { container } = render(
      <LocaleProvider locale="en-US">
        <UnsubscribePage title="Email preferences" categories={[{ id: 'news', label: 'News' }]} channels={[
          { id: 'email', label: 'Email' },
        ]} value={{ email: [] }} onChange={onChange} unsubscribeAllLabel="Unsubscribe from all" onUnsubscribeAll={onUnsubscribeAll} />
      </LocaleProvider>,
    );
    await userEvent.setup().click(screen.getByRole('checkbox', { name: 'News: Email' }));
    expect(onChange).toHaveBeenCalledWith({ email: ['news'] });
    await userEvent.setup().click(screen.getByRole('button', { name: 'Unsubscribe from all' }));
    expect(onUnsubscribeAll).toHaveBeenCalledOnce();
    expect(await axe(container)).toHaveNoViolations();
  });
});
