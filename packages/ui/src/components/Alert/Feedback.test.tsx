import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '../../../test/axe';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { Banner } from '../Banner/Banner';
import { EmptyState } from '../EmptyState/EmptyState';
import { CircularProgress, Progress } from '../Progress/Progress';
import { Skeleton } from '../Skeleton/Skeleton';
import { Alert } from './Alert';

describe('Alert', () => {
  it('conveys tone with hidden text, supports live roles and dismissal', async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    const { container, rerender } = render(
      <Alert tone="danger" title="Pagamento rifiutato" onDismiss={onDismiss}>
        Controlla i dati della carta.
      </Alert>,
    );
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByText(/Error:/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(await axe(container)).toHaveNoViolations();
    rerender(
      <Alert tone="success" live="polite">
        Salvato
      </Alert>,
    );
    expect(screen.getByRole('status')).toHaveTextContent('Success: Salvato');
  });

  it('localizes the tone label', () => {
    render(
      <LocaleProvider locale="it-IT">
        <Alert tone="warning" live="assertive" title="Quota quasi esaurita" />
      </LocaleProvider>,
    );
    expect(screen.getByRole('alert')).toHaveTextContent(/^Avviso: Quota quasi esaurita$|Attenzione: Quota quasi esaurita/);
  });
});

describe('Banner', () => {
  it('renders action and dismiss button', async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    const { container } = render(
      <Banner tone="warning" action={<a href="#status">Stato servizi</a>} onDismiss={onDismiss} sticky>
        Manutenzione programmata alle 22:00.
      </Banner>,
    );
    expect(screen.getByRole('link', { name: 'Stato servizi' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(onDismiss).toHaveBeenCalled();
    expect(container.firstElementChild).toHaveAttribute('data-sticky');
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('Progress', () => {
  it('exposes determinate and indeterminate progressbars', async () => {
    const { container } = render(
      <>
        <Progress label="Caricamento" value={40} />
        <Progress aria-label="Sincronizzazione" />
        <CircularProgress value={75} aria-label="Spazio usato" />
        <CircularProgress />
      </>,
    );
    const bars = screen.getAllByRole('progressbar');
    expect(bars).toHaveLength(4);
    expect(screen.getByRole('progressbar', { name: 'Caricamento' })).toHaveAttribute('aria-valuenow', '40');
    expect(screen.getByRole('progressbar', { name: 'Sincronizzazione' })).not.toHaveAttribute('aria-valuenow');
    expect(screen.getByText('40%')).toBeInTheDocument();
    expect(screen.getByRole('progressbar', { name: 'Spazio usato' })).toHaveAttribute('aria-valuetext', '75%');
    expect(screen.getAllByRole('progressbar', { name: 'Progress' })).toHaveLength(1);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('Skeleton and EmptyState', () => {
  it('hides skeletons from assistive tech and renders empty state outline', async () => {
    const { container } = render(
      <div aria-busy="true">
        <Skeleton lines={3} data-testid="sk" />
        <EmptyState title="Nessun progetto" description="Crea il primo progetto." headingLevel={3} actions={<button type="button">Crea</button>} />
      </div>,
    );
    expect(screen.getByTestId('sk')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByTestId('sk').children).toHaveLength(3);
    expect(screen.getByRole('heading', { level: 3, name: 'Nessun progetto' })).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
});