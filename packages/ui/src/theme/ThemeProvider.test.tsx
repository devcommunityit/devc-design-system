import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Dialog, DialogTrigger, Modal, Button as RacButton, Heading } from 'react-aria-components';
import { describe, expect, it, vi } from 'vitest';
import { Button as DsButton } from '../components/Button/Button';
import { DialogTrigger as DsDialogTrigger } from '../components/Dialog/Dialog';
import { Drawer } from '../components/Drawer/Drawer';
import { LocaleProvider } from '../i18n/LocaleProvider';
import { ThemeProvider, useTheme } from './ThemeProvider';
import { createTheme } from './createTheme';
import type { ThemeStorage } from './persistence';

function Probe({ id }: { id: string }) {
  const t = useTheme();
  return (
    <span data-testid={id}>
      {t.mode}|{t.theme.name}|{t.density}
    </span>
  );
}

function memoryStorage(initial: Record<string, string> = {}): ThemeStorage & { data: Record<string, string> } {
  const data = { ...initial };
  return { data, get: (k) => data[k] ?? null, set: (k, v) => void (data[k] = v), remove: (k) => void delete data[k] };
}

describe('ThemeProvider', () => {
  it('renders theme attributes and inherits unspecified values in nested providers', () => {
    render(
      <ThemeProvider data-testid="outer" defaultMode="dark" theme="lagoon" density="compact">
        <Probe id="a" />
        <ThemeProvider data-testid="inner" theme="ember">
          <Probe id="b" />
        </ThemeProvider>
      </ThemeProvider>,
    );
    expect(screen.getByTestId('a')).toHaveTextContent('dark|lagoon|compact');
    expect(screen.getByTestId('b')).toHaveTextContent('dark|ember|compact');
    const inner = screen.getByTestId('inner');
    expect(inner).toHaveAttribute('data-dc-palette', 'ember');
    expect(inner).toHaveAttribute('data-dc-scheme', 'dark');
    expect(inner).toHaveAttribute('data-dc-density', 'compact');
  });

  it('applies custom themes as inline variables, or by name with the stylesheet strategy', () => {
    const theme = createTheme({ name: 'acme', seeds: { brand: '#0a7d4f' } });
    const { rerender } = render(<ThemeProvider data-testid="p" theme={theme} />);
    const el = screen.getByTestId('p');
    expect(el).toHaveAttribute('data-dc-palette-source', 'inline');
    expect(el.style.getPropertyValue('--dc-light-color-action-primary')).toBe(theme.colors.light['action.primary']);
    rerender(<ThemeProvider data-testid="p" theme={theme} themeStrategy="stylesheet" />);
    expect(el).not.toHaveAttribute('data-dc-palette-source');
    expect(el).toHaveAttribute('data-dc-palette', 'acme');
  });

  it('renders portalled overlays inside a container that carries the nested provider theme', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider theme="aurora" defaultMode="light">
        <ThemeProvider theme="ember" mode="dark">
          <DialogTrigger>
            <RacButton>Open</RacButton>
            <Modal>
              <Dialog>
                <Heading slot="title">Hello</Heading>
              </Dialog>
            </Modal>
          </DialogTrigger>
        </ThemeProvider>
      </ThemeProvider>,
    );
    await user.click(screen.getByRole('button', { name: 'Open' }));
    const dialog = await screen.findByRole('dialog');
    const container = dialog.closest('[data-dc-portal]');
    expect(container).not.toBeNull();
    expect(container).toHaveAttribute('data-dc-palette', 'ember');
    expect(container).toHaveAttribute('data-dc-scheme', 'dark');
    expect(container?.parentElement).toBe(document.body);
  });

  it('keeps overlays in the direction of a LocaleProvider placed inside the ThemeProvider', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <LocaleProvider locale="ar-EG">
          <DsDialogTrigger>
            <DsButton>Open</DsButton>
            <Drawer title="RTL" placement="start">
              body
            </Drawer>
          </DsDialogTrigger>
        </LocaleProvider>
      </ThemeProvider>,
    );
    await user.click(screen.getByRole('button', { name: 'Open' }));
    const dialog = await screen.findByRole('dialog');
    expect(dialog.closest('[dir]')).toHaveAttribute('dir', 'rtl');
    expect(dialog.closest('[lang]')).toHaveAttribute('lang', 'ar-EG');
  });

  it('does not touch storage unless persistence is enabled', () => {
    const spy = vi.spyOn(Storage.prototype, 'getItem');
    render(<ThemeProvider />);
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it('restores and writes persisted preferences through a custom adapter', async () => {
    const storage = memoryStorage({ k: JSON.stringify({ mode: 'dark', theme: 'graphite', density: 'compact' }) });
    function Toggle() {
      const t = useTheme();
      return <button onClick={() => t.setMode('light')}>light</button>;
    }
    render(
      <ThemeProvider persistence={{ storage, key: 'k', keys: ['mode', 'theme'] }}>
        <Probe id="p" />
        <Toggle />
      </ThemeProvider>,
    );
    expect(screen.getByTestId('p')).toHaveTextContent('dark|graphite|comfortable');
    await userEvent.click(screen.getByRole('button', { name: 'light' }));
    expect(JSON.parse(storage.data.k ?? '{}')).toEqual({ mode: 'light', theme: 'graphite' });
  });

  it('reports read, parse and write errors without crashing', async () => {
    const onError = vi.fn();
    const failing: ThemeStorage = {
      get: () => '{not json',
      set: () => {
        throw new Error('quota');
      },
      remove: () => {},
    };
    function Toggle() {
      const t = useTheme();
      return (
        <>
          <button onClick={() => t.setMode('dark')}>dark</button>
          <output>{t.persistenceError?.operation ?? 'none'}</output>
        </>
      );
    }
    render(
      <ThemeProvider persistence={{ storage: failing }} onPersistenceError={onError}>
        <Toggle />
      </ThemeProvider>,
    );
    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError.mock.calls[0]?.[0].operation).toBe('parse');
    await userEvent.click(screen.getByRole('button', { name: 'dark' }));
    expect(onError).toHaveBeenLastCalledWith(expect.objectContaining({ operation: 'write' }));
    expect(screen.getByRole('status')).toHaveTextContent('write');
  });

  it('follows the system scheme when mode is system', () => {
    const mql = Object.assign(new EventTarget(), {
      matches: true,
      media: '(prefers-color-scheme: dark)',
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
    });
    const original = window.matchMedia;
    window.matchMedia = () => mql;
    function Scheme() {
      return <span data-testid="s">{useTheme().resolvedScheme}</span>;
    }
    render(
      <ThemeProvider mode="system">
        <Scheme />
      </ThemeProvider>,
    );
    expect(screen.getByTestId('s')).toHaveTextContent('dark');
    mql.matches = false;
    act(() => {
      mql.dispatchEvent(new Event('change'));
    });
    expect(screen.getByTestId('s')).toHaveTextContent('light');
    window.matchMedia = original;
  });

  it('throws a helpful error when useTheme is used outside a provider', () => {
    const err = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Probe id="x" />)).toThrow(/ThemeProvider/);
    err.mockRestore();
  });
});
