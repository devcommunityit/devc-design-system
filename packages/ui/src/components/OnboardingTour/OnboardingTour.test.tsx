import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '../../../test/axe';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { OnboardingTour } from './OnboardingTour';

describe('OnboardingTour', () => {
  it('moves through anchored steps and finishes', async () => {
    const user = userEvent.setup();
    const onFinish = vi.fn();
    render(<LocaleProvider locale="en-US"><button id="first">First target</button><button id="second">Second target</button>
      <OnboardingTour aria-label="Guide" defaultOpen onFinish={onFinish} steps={[
        { id: 'first', target: '#first', title: 'Welcome', content: 'Start here.' },
        { id: 'second', target: '#second', title: 'Continue', content: 'Go here.' },
      ]} /></LocaleProvider>);
    expect(await screen.findByRole('dialog', { name: 'Welcome' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(await screen.findByRole('dialog', { name: 'Continue' })).toBeInTheDocument();
    expect(await axe(screen.getByRole('dialog', { name: 'Continue' }))).toHaveNoViolations();
    await user.click(screen.getByRole('button', { name: 'Finish' }));
    expect(onFinish).toHaveBeenCalledOnce();
  });

  it('announces missing targets and still allows the user to skip', async () => {
    const onTargetMissing = vi.fn();
    const onSkip = vi.fn();
    render(<LocaleProvider locale="en-US"><OnboardingTour aria-label="Guide" defaultOpen onTargetMissing={onTargetMissing} onSkip={onSkip}
      steps={[{ id: 'missing', target: '#absent', title: 'Missing', content: 'Details' }]} /></LocaleProvider>);
    expect(await screen.findByRole('alert')).toHaveTextContent('target for this step is unavailable');
    expect(onTargetMissing).toHaveBeenCalledOnce();
    await userEvent.setup().click(screen.getByRole('button', { name: 'Skip tour' }));
    expect(onSkip).toHaveBeenCalledOnce();
  });
});
