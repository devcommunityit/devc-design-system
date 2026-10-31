import { render, screen } from '@testing-library/react';
import { createRef, type ReactNode } from 'react';
import { describe, expect, it } from 'vitest';
import { axe } from '../../../test/axe';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { RaffleDraw } from './RaffleDraw';

const renderEnglish = (ui: ReactNode) => render(<LocaleProvider locale="en-US">{ui}</LocaleProvider>);

describe('RaffleDraw', () => {
  it('displays the externally supplied winner and entry count', () => {
    const ref = createRef<HTMLElement>();
    renderEnglish(
      <RaffleDraw
        ref={ref}
        title="Member raffle"
        entryCount={128}
        winner={{ id: 'entry-42', name: 'Jordan Lee', entryNumber: 'A-042' }}
      />,
    );
    expect(ref.current).toBeTruthy();
    expect(screen.getByRole('heading', { level: 2, name: 'Member raffle' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Winner' })).toBeInTheDocument();
    expect(screen.getByText('Jordan Lee')).toBeInTheDocument();
    expect(screen.getByText('128 entries')).toBeInTheDocument();
  });

  it('keeps winner selection external and supports the empty state accessibly', async () => {
    const { container } = renderEnglish(<RaffleDraw title="Member raffle" winner={null} />);
    expect(screen.getByRole('status')).toHaveTextContent('No winner has been announced yet.');
    expect(await axe(container)).toHaveNoViolations();
  });
});
