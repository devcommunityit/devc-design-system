import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '../../../test/axe';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { FormWizard } from './FormWizard';

describe('FormWizard', () => {
  it('blocks invalid steps, supports back navigation and completes', async () => {
    const user = userEvent.setup();
    const validate = vi.fn().mockResolvedValueOnce(false).mockResolvedValue(true);
    const onComplete = vi.fn();
    const { container } = render(<LocaleProvider locale="en-US"><FormWizard aria-label="Setup" onComplete={onComplete} steps={[
      { id: 'first', label: 'Profile', content: 'First step', validate },
      { id: 'second', label: 'Review', content: 'Second step' },
    ]} /></LocaleProvider>);
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(await screen.findByRole('alert')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Next' }));
    await waitFor(() => expect(screen.getByRole('heading', { name: 'Review' })).toHaveFocus());
    await user.click(screen.getByRole('button', { name: 'Previous' }));
    await user.click(screen.getByRole('button', { name: 'Next' }));
    await user.click(await screen.findByRole('button', { name: 'Finish' }));
    await waitFor(() => expect(onComplete).toHaveBeenCalledOnce());
    expect(await axe(container)).toHaveNoViolations();
  });

  it('surfaces rejected validation rather than advancing', async () => {
    const onError = vi.fn();
    const failure = new Error('offline');
    render(<LocaleProvider locale="en-US"><FormWizard aria-label="Setup" onComplete={() => undefined} onError={onError} steps={[
      { id: 'first', label: 'Profile', content: 'Details', validate: () => Promise.reject(failure) },
    ]} /></LocaleProvider>);
    await userEvent.setup().click(screen.getByRole('button', { name: 'Finish' }));
    expect(await screen.findByRole('alert')).toBeInTheDocument();
    expect(onError).toHaveBeenCalledWith(failure);
  });

  it('does not submit the same step twice while validation is pending', async () => {
    let finishValidation: (valid: boolean) => void = () => undefined;
    const validate = vi.fn(() => new Promise<boolean>((resolve) => { finishValidation = resolve; }));
    render(<LocaleProvider locale="en-US"><FormWizard aria-label="Setup" onComplete={() => undefined} steps={[
      { id: 'first', label: 'Profile', content: 'Details', validate },
    ]} /></LocaleProvider>);
    const form = screen.getByRole('form', { name: 'Setup' });
    fireEvent.submit(form);
    fireEvent.submit(form);
    expect(validate).toHaveBeenCalledOnce();
    finishValidation(false);
    expect(await screen.findByRole('alert')).toBeInTheDocument();
  });
});
